
import React, { useState, useEffect } from "react";
import { Winery } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle, Save, Image as ImageIcon, Upload, Facebook, Instagram, Twitter, Youtube, Scissors } from "lucide-react";
import { Label } from "@/components/ui/label";

// Helper component for social media inputs
const SocialInput = ({ id, value, onChange, placeholder, Icon }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <Input 
      id={id} 
      name={id} 
      value={value || ""} 
      onChange={onChange} 
      placeholder={placeholder}
      className="pl-10"
    />
  </div>
);

// TikTok icon as a simple component
const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.86-.95-6.69-2.81-1.77-1.8-2.55-4.2-2.4-6.6s.92-4.67 2.56-6.44c.94-1.03 2.15-1.74 3.48-2.04.01 2.11-.01 4.22.02 6.33-.02 1.36.24 2.73.87 3.94.63 1.22 1.59 2.18 2.89 2.71.02-2.06.01-4.12.02-6.18-.01-1.28-.27-2.56-.83-3.71-.56-1.15-1.36-2.14-2.39-2.85-.85-.59-1.84-.96-2.89-1.08l-.02-4.03c.61.02 1.23.08 1.83.18z"/>
  </svg>
);

export default function WineryInfoEditor({ winery, onUpdate }) {
  const [formData, setFormData] = useState({ ...winery, social_media: winery.social_media || {} });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    setFormData({ ...winery, social_media: winery.social_media || {} });
  }, [winery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("");
    try {
      // Estraggo solo i campi modificabili
      const { name, story, website, established_year, sub_region, social_media, logo_url, cover_image_url } = formData;
      const updateData = { name, story, website, established_year: Number(established_year), sub_region, social_media, logo_url, cover_image_url };
      
      const updatedWinery = await Winery.update(winery.id, updateData);
      onUpdate({ ...winery, ...updateData });
      setSaveStatus("Modifiche salvate con successo!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Failed to save winery info:", error);
      setSaveStatus("Errore durante il salvataggio.");
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informazioni della Vetrina</CardTitle>
        <CardDescription>Modifica i dettagli pubblici, le immagini e i social della tua cantina.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Sezione Immagini */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Immagini</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Logo */}
            <div className="space-y-3">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border bg-gray-100 flex items-center justify-center overflow-hidden">
                  {formData.logo_url ? (
                    <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <Button variant="outline" onClick={() => alert('Funzionalità in sviluppo')}>
                  <Upload className="w-4 h-4 mr-2"/> Carica Logo
                </Button>
              </div>
            </div>
            {/* Cover */}
            <div className="space-y-3">
              <Label>Immagine di Copertina</Label>
              <div className="flex items-center gap-4">
                 <div className="w-40 h-24 rounded-lg border bg-gray-100 flex items-center justify-center overflow-hidden">
                   {formData.cover_image_url ? (
                     <img src={formData.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                   ) : (
                     <ImageIcon className="w-8 h-8 text-gray-400" />
                   )}
                 </div>
                 <Button variant="outline" onClick={() => alert('Funzionalità in sviluppo')}>
                   <Upload className="w-4 h-4 mr-2"/> Carica Cover
                 </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dati Principali */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Dati Principali</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Cantina</Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Sito Web</Label>
              <Input id="website" name="website" placeholder="https://..." value={formData.website || ""} onChange={handleInputChange} />
            </div>
          </div>

          <div>
            <Label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">La nostra Storia</Label>
            <Textarea id="story" name="story" value={formData.story || ""} onChange={handleInputChange} rows={6} placeholder="Racconta la filosofia e la passione dietro la tua cantina..." />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="established_year" className="block text-sm font-medium text-gray-700 mb-1">Anno di Fondazione</Label>
              <Input id="established_year" name="established_year" type="number" value={formData.established_year || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="sub_region" className="block text-sm font-medium text-gray-700 mb-1">Sottozona di Produzione</Label>
              <Input id="sub_region" name="sub_region" placeholder="Es. Chianti Classico, Valpolicella" value={formData.sub_region || ""} onChange={handleInputChange} />
            </div>
          </div>
        </div>
        
        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Profili Social</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <SocialInput id="instagram" value={formData.social_media.instagram} onChange={handleSocialChange} placeholder="instagram.com/tuacantina" Icon={Instagram} />
            <SocialInput id="facebook" value={formData.social_media.facebook} onChange={handleSocialChange} placeholder="facebook.com/tuacantina" Icon={Facebook} />
            <SocialInput id="twitter" value={formData.social_media.twitter} onChange={handleSocialChange} placeholder="twitter.com/tuacantina" Icon={Twitter} />
            <SocialInput id="youtube" value={formData.social_media.youtube} onChange={handleSocialChange} placeholder="youtube.com/c/tuacantina" Icon={Youtube} />
            <SocialInput id="tiktok" value={formData.social_media.tiktok} onChange={handleSocialChange} placeholder="tiktok.com/@tuacantina" Icon={TikTokIcon} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salva Modifiche
              </>
            )}
          </Button>
          {saveStatus && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              {saveStatus}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
