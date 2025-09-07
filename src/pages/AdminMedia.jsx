
import React, { useState, useEffect, useCallback } from "react";
import { Media } from "@/api/entities";
import RoleGuard from "../components/auth/RoleGuard.js";
import MediaUploader from "../components/admin/media/MediaUploader";
import MediaGrid from "../components/admin/media/MediaGrid";
import MediaFilters from "../components/admin/media/MediaFilters";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function AdminMedia() {
  const [allMedia, setAllMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ query: "", collection: "all" });
  const [selectedItems, setSelectedItems] = useState([]);
  
  const collections = ["Generale", "Cantine", "Vini", "Eventi", "Box", "Documenti"];

  const delay = (ms) => new Promise(res => setTimeout(res, ms)); 
  const getRetryAfterSeconds = (error, attempt) => { 
    const headers = error?.response?.headers;
    let hdr;
    if (headers instanceof Headers) {
      hdr = headers.get('retry-after');
    } else if (headers) {
      hdr = headers['retry-after'] || headers['Retry-After'];
    }
    const parsed = hdr ? parseInt(hdr, 10) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    return Math.min(10, Math.pow(2, attempt));
  };

  const deleteMediaWithRetry = async (id, maxRetries = 4) => { 
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await Media.delete(id);
        return;
      } catch (error) {
        if (error?.response?.status === 429 && attempt < maxRetries) {
          const waitSec = getRetryAfterSeconds(error, attempt);
          await delay(waitSec * 1000);
          continue;
        }
        throw error;
      }
    }
  };

  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const mediaItems = await Media.list("-created_date");
      setAllMedia(mediaItems || []);
    } catch (error) {
      console.error("Failed to load media:", error);
      setAllMedia([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  useEffect(() => {
    let newFilteredMedia = allMedia;
    if (filters.query) {
      newFilteredMedia = newFilteredMedia.filter(item => 
        (item.name?.toLowerCase().includes(filters.query.toLowerCase())) ||
        (item.description?.toLowerCase().includes(filters.query.toLowerCase()))
      );
    }
    if (filters.collection !== "all") {
      newFilteredMedia = newFilteredMedia.filter(item => item.collection === filters.collection);
    }
    setFilteredMedia(newFilteredMedia);
    
    // Reset selected items when filters change
    setSelectedItems([]);
  }, [filters, allMedia]);

  const handleUpdate = (updatedItem) => {
    setAllMedia(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const handleDelete = async (itemId) => {
    try {
      await Media.delete(itemId);
      setAllMedia(prev => prev.filter(item => item.id !== itemId));
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    setSelectedItems(prev => 
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredMedia.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Sei sicuro di voler eliminare ${selectedItems.length} file? L'azione è irreversibile.`)) {
      setIsLoading(true);
      try {
        // Processa sequenziale per evitare 429
        for (let i = 0; i < selectedItems.length; i++) {
          const id = selectedItems[i];
          try {
            await deleteMediaWithRetry(id);
            // aggiorna stato locale
            setAllMedia(prev => prev.filter(item => item.id !== id));
          } catch (error) {
            console.error("Failed to delete media:", id, error);
          }
          // piccola pausa per rate limit
          await delay(200);
        }
        setSelectedItems([]);
      } catch (error) {
        console.error("Failed to delete selected media:", error);
        alert("Errore durante l'eliminazione multipla.");
      }
      setIsLoading(false);
    }
  };

  return (
    <RoleGuard allow={["admin"]}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Link to={createPageUrl("AdminDashboard")} className="mb-6 inline-block">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Dashboard
            </Button>
          </Link>
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600 mt-1">Carica e gestisci immagini, video e documenti per la piattaforma.</p>
          </header>

          <MediaUploader onUploadSuccess={loadMedia} collections={collections} />

          <div className="mt-8">
            <MediaFilters onFilterChange={setFilters} collections={collections} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-red-700" />
            </div>
          ) : (
            <MediaGrid 
              mediaItems={filteredMedia}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              collections={collections}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
              onDeleteSelected={handleDeleteSelected}
            />
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
