import React, { useState, useEffect } from "react";
import { Media } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, Loader2, Upload, CheckCircle } from "lucide-react";

export default function AdminVideos() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [newVideoFile, setNewVideoFile] = useState(null);

  useEffect(() => {
    loadActiveVideo();
  }, []);

  const loadActiveVideo = async () => {
    setIsLoading(true);
    try {
      const activeVideos = await Media.filter({ usage_location: "homepage_hero", is_active: true }, "-created_date", 1);
      if (activeVideos.length > 0) {
        setCurrentVideo(activeVideos[0]);
      } else {
        setCurrentVideo(null);
      }
    } catch (error) {
      console.error("Error loading active video:", error);
    }
    setIsLoading(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setNewVideoFile(file);
      setUploadStatus("");
    } else {
      setNewVideoFile(null);
      setUploadStatus("Seleziona un file video valido (es. MP4).");
    }
  };

  const handleUploadAndReplace = async () => {
    if (!newVideoFile) return;

    setIsUploading(true);
    setUploadStatus("Caricamento del file in corso...");

    try {
      // 1. Upload del nuovo video
      const uploadResult = await UploadFile({ file: newVideoFile });
      if (!uploadResult || !uploadResult.file_url) throw new Error("Upload fallito.");
      setUploadStatus("File caricato. Aggiornamento database...");

      // 2. Disattiva il vecchio video, se esiste
      if (currentVideo) {
        await Media.update(currentVideo.id, { is_active: false });
      }

      // 3. Crea il record per il nuovo video e lo imposta come attivo
      await Media.create({
        name: newVideoFile.name.split('.')[0],
        type: "video",
        file_url: uploadResult.file_url,
        usage_location: "homepage_hero",
        is_active: true,
        format: newVideoFile.name.split('.').pop().toLowerCase(),
        file_size: newVideoFile.size,
        aspect_ratio: "16:9"
      });

      setUploadStatus("Video della homepage aggiornato con successo!");
      setNewVideoFile(null);
      document.getElementById('video-file-input').value = '';
      await loadActiveVideo();

    } catch (error) {
      console.error("Error replacing video:", error);
      setUploadStatus(`Errore: ${error.message}`);
    }

    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Homepage</h1>
          <p className="text-gray-600">Gestisci il video mostrato nella sezione hero della homepage.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Video Attualmente Attivo</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
            ) : currentVideo ? (
              <div>
                <video
                  key={currentVideo.id}
                  src={currentVideo.file_url}
                  controls
                  className="w-full rounded-lg shadow-md"
                >
                  Il tuo browser non supporta il tag video.
                </video>
                <div className="mt-4 text-sm text-gray-700">
                  <p><strong>Nome:</strong> {currentVideo.name}</p>
                  <p><strong>URL:</strong> <a href={currentVideo.file_url} target="_blank" rel="noopener noreferrer" className="text-red-700 hover:underline">Apri video</a></p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Nessun video attivo impostato per la homepage.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sostituisci Video</CardTitle>
            <CardDescription>Carica un nuovo video in formato MP4 (16:9). Il video attuale verrà disattivato.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="video-file-input" className="block text-sm font-medium mb-2">Seleziona file video</label>
              <Input
                id="video-file-input"
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={handleFileSelect}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>

            {uploadStatus && (
              <div className="flex items-center text-sm p-3 rounded-md bg-blue-50 text-blue-800">
                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                <span>{uploadStatus}</span>
              </div>
            )}

            <Button
              onClick={handleUploadAndReplace}
              disabled={!newVideoFile || isUploading}
              className="bg-red-800 hover:bg-red-900"
            >
              {isUploading ? "Caricamento in corso..." : "Carica e Sostituisci"}
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}