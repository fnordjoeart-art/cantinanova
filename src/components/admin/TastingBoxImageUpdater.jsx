import React, { useState, useEffect } from "react";
import { TastingBox } from "@/api/entities";
import { GenerateImage, UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Upload, 
  Sparkles, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Wand2
} from "lucide-react";

const AI_PROMPT = "Premium tasting box for a wine subscription. The box is open, revealing 3-4 elegant wine bottles with minimalist, modern labels (no text). Box is on a rustic wooden table with a corkscrew and grapes. Professional product photography, soft lighting, 4K.";

export default function TastingBoxImageUpdater() {
  const [tastingBoxes, setTastingBoxes] = useState([]);
  const [filteredBoxes, setFilteredBoxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBox, setSelectedBox] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    loadTastingBoxes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = tastingBoxes.filter(box => 
        box.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.theme?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBoxes(filtered);
    } else {
      setFilteredBoxes([]);
    }
  }, [searchTerm, tastingBoxes]);

  const loadTastingBoxes = async () => {
    try {
      const boxesData = await TastingBox.list();
      setTastingBoxes(boxesData);
    } catch (error) {
      console.error("Error loading tasting boxes:", error);
    }
  };

  const generateImage = async () => {
    if (!selectedBox) return;
    setIsGenerating(true);
    setUploadStatus("Generazione immagine con AI...");
    try {
      const result = await GenerateImage({ prompt: `${AI_PROMPT} The box has a theme of '${selectedBox.theme}'.` });
      if (result && result.url) {
        setGeneratedImageUrl(result.url);
        setUploadStatus("Immagine generata con successo! Clicca 'Applica' per salvarla.");
      } else {
        throw new Error("Generazione immagine fallita");
      }
    } catch (error) {
      setUploadStatus(`Errore nella generazione: ${error.message}`);
    }
    setIsGenerating(false);
  };

  const applyGeneratedImage = async () => {
    if (!selectedBox || !generatedImageUrl) return;
    setIsUploading(true);
    setUploadStatus("Applicazione immagine...");
    try {
      await TastingBox.update(selectedBox.id, { image_url: generatedImageUrl });
      setUploadStatus("Immagine applicata con successo!");
      setSelectedBox(prev => ({ ...prev, image_url: generatedImageUrl }));
      setTimeout(() => {
        setGeneratedImageUrl("");
        setUploadStatus("");
      }, 3000);
    } catch (error) {
      setUploadStatus(`Errore nell'applicazione: ${error.message}`);
    }
    setIsUploading(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedBox) return;
    setIsUploading(true);
    setUploadStatus("Caricamento immagine...");
    try {
      const uploadResult = await UploadFile({ file });
      if (uploadResult && uploadResult.file_url) {
        await TastingBox.update(selectedBox.id, { image_url: uploadResult.file_url });
        setSelectedBox(prev => ({ ...prev, image_url: uploadResult.file_url }));
        setUploadStatus("Immagine caricata e applicata con successo!");
        setTimeout(() => setUploadStatus(""), 3000);
      }
    } catch (error) {
      setUploadStatus(`Errore: ${error.message}`);
    }
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Cerca Box Degustazione
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="Cerca per titolo o tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          {filteredBoxes.length > 0 && (
            <div className="mt-4 max-h-60 overflow-y-auto">
              <div className="grid gap-2">
                {filteredBoxes.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => {
                      setSelectedBox(box);
                      setSearchTerm("");
                      setFilteredBoxes([]);
                    }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div>
                      <p className="font-semibold">{box.title}</p>
                      <p className="text-sm text-gray-600">{box.theme}</p>
                    </div>
                    <Badge variant={box.image_url ? "default" : "destructive"}>
                      {box.image_url ? "Con Immagine" : "Senza Immagine"}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBox && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedBox.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Immagine Attuale:</h3>
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                {selectedBox.image_url ? (
                  <img src={selectedBox.image_url} alt={selectedBox.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-center">
                    <div>
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Nessuna immagine</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Genera Immagine con AI
              </h3>
              <Button onClick={generateImage} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generando...</> : <><Wand2 className="w-4 h-4 mr-2" />Genera Immagine per questo Box</>}
              </Button>
            </div>

            {generatedImageUrl && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold mb-2">Anteprima Immagine Generata:</h3>
                <img src={generatedImageUrl} alt="Immagine generata" className="w-full h-48 object-cover rounded-lg mb-4" />
                <Button onClick={applyGeneratedImage} disabled={isUploading} className="bg-green-600 hover:bg-green-700 text-white w-full">
                  {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Applicando...</> : <><CheckCircle className="w-4 h-4 mr-2" />Applica Immagine</>}
                </Button>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold mb-2">Oppure Carica File Manualmente:</h3>
              <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>

            {uploadStatus && (
              <div className={`p-3 rounded-lg text-sm flex items-center ${uploadStatus.includes("successo") ? "bg-green-50 text-green-800" : uploadStatus.includes("Errore") ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800"}`}>
                {isGenerating || isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                {uploadStatus}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}