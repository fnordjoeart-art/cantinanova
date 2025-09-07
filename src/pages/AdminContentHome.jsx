import React, { useState, useEffect } from "react";
import { HomePageContent, Winery, Wine, TastingBox, Event } from "@/api/entities";
import RoleGuard from "../components/auth/RoleGuard.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save, Link as LinkIcon, Info, UploadCloud, Building, Wine as WineIcon } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { UploadFile } from "@/api/integrations";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const MultiSelect = ({ title, items, selectedIds = [], onSelectionChange, placeholder, itemLabelField = 'name' }) => {
  const selectedItems = items.filter(item => selectedIds.includes(item.id));

  return (
    <div className="space-y-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{title}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 max-h-80 overflow-y-auto">
          <DropdownMenuLabel>{placeholder}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map(item => (
            <DropdownMenuCheckboxItem
              key={item.id}
              checked={selectedIds.includes(item.id)}
              onCheckedChange={(checked) => {
                const newSelection = checked
                  ? [...selectedIds, item.id]
                  : selectedIds.filter(id => id !== item.id);
                onSelectionChange(newSelection);
              }}
            >
              {item[itemLabelField]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-wrap gap-2">
        {selectedItems.length > 0 ? selectedItems.map(item => (
          <Badge key={item.id} variant="secondary">{item[itemLabelField]}</Badge>
        )) : <p className="text-sm text-gray-500">Nessun elemento selezionato.</p>}
      </div>
    </div>
  );
};


export default function AdminContentHome() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Dati per i selettori
  const [allWineries, setAllWineries] = useState([]);
  const [allWines, setAllWines] = useState([]);
  // Aggiungere qui per box ed eventi se necessario

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [records, wineriesData, winesData] = await Promise.all([
          HomePageContent.list(),
          Winery.list(),
          Wine.list()
        ]);
        
        if (records.length > 0) {
          setContent(records[0]);
        } else {
          const newContent = await HomePageContent.create({});
          setContent(newContent);
        }
        setAllWineries(wineriesData);
        setAllWines(winesData);

      } catch (error) {
        console.error("Failed to load data:", error);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleInputChange = (field, value) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectionChange = (field, ids) => {
    setContent(prev => ({...prev, [field]: ids}));
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await UploadFile({ file });
      if (response && response.file_url) {
        handleInputChange('hero_video_url', response.file_url);
      }
    } catch (error) {
      console.error("Video upload failed:", error);
      alert("Caricamento video fallito.");
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    await HomePageContent.update(content.id, content);
    setIsSaving(false);
    alert("Contenuti salvati con successo!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-red-700" />
      </div>
    );
  }

  return (
    <RoleGuard allow={["admin"]}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <RouterLink to={createPageUrl("AdminDashboard")} className="mb-6 inline-block">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Dashboard
            </Button>
          </RouterLink>

          <Card>
            <CardHeader>
              <CardTitle>Gestione Contenuti Pagina Home</CardTitle>
              <CardDescription>Modifica i testi, i media e seleziona i contenuti da mostrare in vetrina nella pagina principale.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Sezione Hero */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">Sezione Principale (Hero)</h3>
                
                <div className="space-y-2">
                  <label htmlFor="hero_video_url" className="block text-sm font-medium">URL Video o Caricamento Diretto</label>
                  <div className="flex gap-2">
                    <Input id="hero_video_url" value={content.hero_video_url || ""} onChange={e => handleInputChange('hero_video_url', e.target.value)} placeholder="Incolla URL o carica un file"/>
                    <Button asChild variant="outline">
                      <label htmlFor="video-upload" className="cursor-pointer">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <UploadCloud className="w-4 h-4"/>}
                        <input id="video-upload" type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                      </label>
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center"><Info className="w-3 h-3 mr-1"/> Puoi incollare un link o caricare un nuovo video. Il caricamento sovrascriverà il link esistente.</p>
                </div>

                {/* ... altri campi hero */}
                <div className="space-y-2">
                  <label htmlFor="hero_badge_text" className="block text-sm font-medium">Testo Badge</label>
                  <Input id="hero_badge_text" value={content.hero_badge_text || ""} onChange={e => handleInputChange('hero_badge_text', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="hero_title" className="block text-sm font-medium">Titolo Principale</label>
                  <Input id="hero_title" value={content.hero_title || ""} onChange={e => handleInputChange('hero_title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="hero_subtitle" className="block text-sm font-medium">Sottotitolo</label>
                  <Textarea id="hero_subtitle" value={content.hero_subtitle || ""} onChange={e => handleInputChange('hero_subtitle', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <label htmlFor="hero_button_text" className="block text-sm font-medium">Testo Pulsante</label>
                  <Input id="hero_button_text" value={content.hero_button_text || ""} onChange={e => handleInputChange('hero_button_text', e.target.value)} />
                </div>
              </div>
              
              {/* Sezione Contenuti in Vetrina */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">Contenuti in Vetrina</h3>
                <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-medium mb-2">Cantine in Evidenza</label>
                     <MultiSelect 
                       title="Seleziona Cantine"
                       items={allWineries}
                       selectedIds={content.featured_wineries || []}
                       onSelectionChange={(ids) => handleSelectionChange('featured_wineries', ids)}
                       placeholder="Scegli le cantine da mostrare"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-2">Vini Raccomandati</label>
                     <MultiSelect 
                       title="Seleziona Vini"
                       items={allWines}
                       selectedIds={content.featured_wines || []}
                       onSelectionChange={(ids) => handleSelectionChange('featured_wines', ids)}
                       placeholder="Scegli i vini da mostrare"
                     />
                   </div>
                </div>
              </div>

              {/* Sezione Statistiche */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">Sezione Statistiche</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="stats_title" className="block text-sm font-medium">Titolo</label>
                    <Input id="stats_title" value={content.stats_title || ""} onChange={e => handleInputChange('stats_title', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="stats_subtitle" className="block text-sm font-medium">Sottotitolo</label>
                    <Input id="stats_subtitle" value={content.stats_subtitle || ""} onChange={e => handleInputChange('stats_subtitle', e.target.value)} />
                  </div>
                </div>
                 <div className="grid md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <label htmlFor="stats_wineries_count" className="block text-sm font-medium">Numero Cantine</label>
                     <Input id="stats_wineries_count" value={content.stats_wineries_count || ""} onChange={e => handleInputChange('stats_wineries_count', e.target.value)} />
                   </div>
                   <div className="space-y-2">
                     <label htmlFor="stats_wines_count" className="block text-sm font-medium">Numero Etichette</label>
                     <Input id="stats_wines_count" value={content.stats_wines_count || ""} onChange={e => handleInputChange('stats_wines_count', e.target.value)} />
                   </div>
                   <div className="space-y-2">
                     <label htmlFor="stats_regions_count" className="block text-sm font-medium">Numero Regioni</label>
                     <Input id="stats_regions_count" value={content.stats_regions_count || ""} onChange={e => handleInputChange('stats_regions_count', e.target.value)} />
                   </div>
                 </div>
              </div>

              {/* Sezione CTA Finale */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">Sezione "Call to Action" Finale</h3>
                <div className="space-y-2">
                  <label htmlFor="cta_title" className="block text-sm font-medium">Titolo</label>
                  <Input id="cta_title" value={content.cta_title || ""} onChange={e => handleInputChange('cta_title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cta_text" className="block text-sm font-medium">Testo</label>
                  <Textarea id="cta_text" value={content.cta_text || ""} onChange={e => handleInputChange('cta_text', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cta_button_text" className="block text-sm font-medium">Testo Pulsante</label>
                  <Input id="cta_button_text" value={content.cta_button_text || ""} onChange={e => handleInputChange('cta_button_text', e.target.value)} />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Salvataggio...</> : <><Save className="w-4 h-4 mr-2"/>Salva Contenuti</>}
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}