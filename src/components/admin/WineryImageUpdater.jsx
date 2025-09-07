import React, { useState, useEffect } from "react";
import { Winery } from "@/api/entities";
import { GenerateImage, UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Upload, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Wand2
} from "lucide-react";

const IMAGE_STYLES = {
  winery_building: {
    label: "Cascina/Cantina",
    prompt: "Beautiful Italian wine estate building, rustic stone architecture, surrounded by rolling vineyard hills, golden hour lighting, professional photography, 4K quality"
  },
  vineyard_rows: {
    label: "Filari di Vigneto",
    prompt: "Aerial view of organized vineyard rows on Italian hills, geometric patterns of grapevines, warm golden sunset lighting, cinematic landscape photography"
  },
  wine_bottles: {
    label: "Bottiglie di Vino",
    prompt: "Elegant wine bottles with premium labels arranged on rustic wooden surface, soft vineyard background, luxury wine photography, professional lighting"
  },
  grape_harvest: {
    label: "Uva e Vendemmia",
    prompt: "Fresh wine grapes in wicker baskets, hands harvesting purple grapes, traditional Italian vineyard, authentic harvest scene, warm natural lighting"
  },
  cellar_barrels: {
    label: "Botti in Cantina",
    prompt: "Wine cellar with wooden oak barrels arranged in rows, warm ambient lighting, traditional Italian winemaking, rustic stone walls, premium atmosphere"
  }
};

export default function WineryImageUpdater() {
  const [wineries, setWineries] = useState([]);
  const [filteredWineries, setFilteredWineries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWinery, setSelectedWinery] = useState(null);
  const [selectedImageStyle, setSelectedImageStyle] = useState("winery_building");
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    loadWineries();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = wineries.filter(winery => 
        winery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winery.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWineries(filtered);
    } else {
      setFilteredWineries([]);
    }
  }, [searchTerm, wineries]);

  const loadWineries = async () => {
    setIsSearching(true);
    try {
      const wineriesData = await Winery.list();
      setWineries(wineriesData);
    } catch (error) {
      console.error("Error loading wineries:", error);
    }
    setIsSearching(false);
  };

  const generateWineryImage = async () => {
    if (!selectedWinery) return;

    setIsGenerating(true);
    setUploadStatus("Generazione immagine con AI...");

    try {
      const selectedStyle = IMAGE_STYLES[selectedImageStyle];
      
      // Personalizza il prompt con informazioni della cantina
      const customPrompt = `${selectedStyle.prompt}, wine estate in ${selectedWinery.region} Italy, ${selectedWinery.name} winery style, Italian wine country landscape, high quality professional photography`;

      const result = await GenerateImage({
        prompt: customPrompt
      });

      if (result && result.url) {
        setGeneratedImageUrl(result.url);
        setUploadStatus("Immagine generata con successo! Clicca 'Applica' per salvarla.");
      } else {
        throw new Error("Generazione immagine fallita");
      }

    } catch (error) {
      console.error("Error generating image:", error);
      setUploadStatus(`Errore nella generazione: ${error.message}`);
    }

    setIsGenerating(false);
  };

  const applyGeneratedImage = async () => {
    if (!selectedWinery || !generatedImageUrl) return;

    setIsUploading(true);
    setUploadStatus("Applicazione immagine alla cantina...");

    try {
      // Aggiorna la cantina con la nuova immagine generata
      await Winery.update(selectedWinery.id, {
        cover_image_url: generatedImageUrl
      });

      setUploadStatus("Immagine applicata con successo!");
      
      // Aggiorna la cantina selezionata
      setSelectedWinery(prev => ({ 
        ...prev, 
        cover_image_url: generatedImageUrl 
      }));

      // Reset
      setTimeout(() => {
        setGeneratedImageUrl("");
        setUploadStatus("");
      }, 3000);

    } catch (error) {
      console.error("Error applying image:", error);
      setUploadStatus(`Errore nell'applicazione: ${error.message}`);
    }

    setIsUploading(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedWinery) return;

    setIsUploading(true);
    setUploadStatus("Caricamento immagine...");

    try {
      const uploadResult = await UploadFile({ file });
      
      if (uploadResult && uploadResult.file_url) {
        await Winery.update(selectedWinery.id, {
          cover_image_url: uploadResult.file_url
        });
        
        setSelectedWinery(prev => ({ 
          ...prev, 
          cover_image_url: uploadResult.file_url 
        }));
        
        setUploadStatus("Immagine caricata e applicata con successo!");
        
        setTimeout(() => {
          setUploadStatus("");
        }, 3000);
      }
    } catch (error) {
      setUploadStatus(`Errore: ${error.message}`);
    }

    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Ricerca Cantina */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Cerca Cantina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="Cerca per nome cantina o regione..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Risultati Ricerca */}
          {filteredWineries.length > 0 && (
            <div className="mt-4 max-h-60 overflow-y-auto">
              <div className="grid gap-2">
                {filteredWineries.map((winery) => (
                  <button
                    key={winery.id}
                    onClick={() => {
                      setSelectedWinery(winery);
                      setSearchTerm("");
                      setFilteredWineries([]);
                    }}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{winery.name}</p>
                      <p className="text-sm text-gray-600">{winery.region} • {winery.sub_region}</p>
                    </div>
                    <Badge variant={winery.cover_image_url ? "default" : "destructive"}>
                      {winery.cover_image_url ? "Con Immagine" : "Senza Immagine"}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cantina Selezionata */}
      {selectedWinery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedWinery.name}</span>
              <Badge variant={selectedWinery.cover_image_url ? "default" : "destructive"}>
                {selectedWinery.cover_image_url ? "Ha Immagine" : "Senza Immagine"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Immagine Attuale */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Immagine Attuale:</h3>
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                {selectedWinery.cover_image_url ? (
                  <img 
                    src={selectedWinery.cover_image_url} 
                    alt={selectedWinery.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Nessuna immagine disponibile</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generatore AI */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Genera Immagine con AI
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Stile Immagine:</label>
                  <Select value={selectedImageStyle} onValueChange={setSelectedImageStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(IMAGE_STYLES).map(([key, style]) => (
                        <SelectItem key={key} value={key}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={generateWineryImage}
                    disabled={isGenerating}
                    className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Genera Immagine AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Anteprima Immagine Generata */}
            {generatedImageUrl && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold mb-2">Immagine Generata:</h3>
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={generatedImageUrl} 
                    alt="Immagine generata con AI"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button 
                  onClick={applyGeneratedImage}
                  disabled={isUploading}
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Applicando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Applica Immagine
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Upload Manuale */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold mb-2">Oppure Carica File:</h3>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Status */}
            {uploadStatus && (
              <div className={`p-3 rounded-lg text-sm flex items-center ${
                uploadStatus.includes("successo") ? "bg-green-50 text-green-800" : 
                uploadStatus.includes("Errore") ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800"
              }`}>
                {isGenerating || isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : uploadStatus.includes("successo") ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2" />
                )}
                {uploadStatus}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}