import React, { useState, useEffect, useCallback } from "react";
import { Winery, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Map, 
  Search, 
  Filter,
  MapPin, 
  Wine,
  Leaf,
  ExternalLink,
  Calendar,
  Heart,
  Locate,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Per compatibilità iOS - uso versione senza react-leaflet temporaneamente
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

import { calculateDistance, getWineryCoordinates, addRandomOffset, regionCoordinates } from "../components/utils/geolocation";

export default function WineriesMap() {
  const [wineries, setWineries] = useState([]);
  const [filteredWineries, setFilteredWineries] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: "",
    region: "all",
    certification: "all"
  });

  const [showFilters, setShowFilters] = useState(false);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const applyFilters = useCallback(() => {
    let result = wineries;
    
    if (filters.search) {
      result = result.filter(w => 
        w.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        w.region.toLowerCase().includes(filters.search.toLowerCase()) ||
        w.story?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.region !== "all") {
      result = result.filter(w => w.region === filters.region);
    }
    if (filters.certification !== "all") {
      result = result.filter(w => w.certifications?.includes(filters.certification));
    }
    
    setFilteredWineries(result);
  }, [wineries, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [wineriesData, userData] = await Promise.all([
        Winery.list("-created_date"),
        User.me().catch(() => null)
      ]);
      
      const wineriesWithCoords = wineriesData.map(winery => {
        const baseCoords = getWineryCoordinates(winery);
        const coords = addRandomOffset(baseCoords, 0.05);
        return { ...winery, coordinates: coords };
      });
      
      setWineries(wineriesWithCoords);
      setUser(userData);
      
      const uniqueRegions = [...new Set(wineriesData.map(w => w.region).filter(Boolean))];
      setRegions(uniqueRegions.sort());
      
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = async (wineryId) => {
    if (!user) return;
    const newFavorites = user.favorite_wineries?.includes(wineryId)
      ? user.favorite_wineries.filter(id => id !== wineryId)
      : [...(user.favorite_wineries || []), wineryId];
    
    setUser(prev => ({ ...prev, favorite_wineries: newFavorites }));
    await User.updateMyUserData({ favorite_wineries: newFavorites });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30">
      {/* Header */}
      <header className="bg-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Map className="w-6 h-6 text-amber-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Mappa delle Cantine
            </h1>
          </div>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            Esplora le startup vinicole italiane. La mappa interattiva sarà disponibile a breve.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Toolbar compatta */}
        <div className="mb-4 space-y-2">
          <div className="bg-white/90 border rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sticky top-16 z-30">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {showFilters ? 'Nascondi filtri' : 'Mostra filtri'}
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
              <span className="text-sm text-gray-600">
                <strong>{filteredWineries.length}</strong> cantine visualizzate
              </span>
            </div>

            {/* Controlli desktop */}
            <div className="hidden md:flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca cantina o regione"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="h-8 pl-8 text-sm"
                />
              </div>
              <Select value={filters.region} onValueChange={(v) => handleFilterChange('region', v)}>
                <SelectTrigger className="h-8 w-48 text-sm">
                  <SelectValue placeholder="Regione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutta Italia</SelectItem>
                  {regions.map(r => (
                    <SelectItem key={r} value={r}>
                      {r} ({wineries.filter(w => w.region === r).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtri mobile espansi */}
          {showFilters && (
            <div className="bg-white/90 border rounded-lg p-3 md:hidden space-y-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca cantina o regione"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filters.region} onValueChange={(v) => handleFilterChange('region', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Regione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutta Italia</SelectItem>
                  {regions.map(r => (
                    <SelectItem key={r} value={r}>
                      {r} ({wineries.filter(w => w.region === r).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Griglia cantine invece della mappa per ora */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredWineries.map((winery) => (
              <Card key={winery.id} className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-red-100 to-amber-100 flex items-center justify-center">
                    {winery.cover_image_url ? (
                      <img 
                        src={winery.cover_image_url} 
                        alt={winery.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-6xl text-red-200">🍷</div>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-800 text-white border-0">
                      Startup
                    </Badge>
                  </div>
                  {winery.certifications?.includes("Bio") && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-600 text-white border-0">
                        <Leaf className="w-3 h-3 mr-1" />
                        Bio
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-800 transition-colors">
                      {winery.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{winery.region}</span>
                      {winery.sub_region && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-sm">{winery.sub_region}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {winery.story || "Una cantina emergente che rappresenta l'innovazione nel settore vinicolo italiano."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {winery.established_year && (
                        <span>Dal {winery.established_year}</span>
                      )}
                    </div>
                    <Link to={createPageUrl(`WineryDetails?id=${winery.id}`)}>
                      <Button variant="ghost" size="sm" className="text-red-700 hover:text-red-800 hover:bg-red-50 group">
                        Scopri
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}