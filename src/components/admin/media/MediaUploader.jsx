
import React, { useState, useCallback, useEffect } from 'react';
import { Media } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud, CheckCircle, AlertCircle, Plus, AlertTriangle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Configurazione limiti file
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'text/csv': ['.csv'],
  'video/mp4': ['.mp4']
};
const MAX_CONCURRENT_UPLOADS = 2; // Limite di 2 upload simultanei

// Funzione per pulire i nomi dei file
const sanitizeFileName = (fileName) => {
  // Rimuove caratteri speciali e sostituisce con underscore
  const cleanName = fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
  
  // Aggiunge timestamp per evitare duplicati
  const timestamp = Date.now();
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  const nameWithoutExt = cleanName.substring(0, cleanName.lastIndexOf('.'));
  
  return `${nameWithoutExt}_${timestamp}${extension}`;
};

// Validazione file prima dell'upload
const validateFile = (file) => {
  const errors = [];
  
  // Controllo tipo file
  if (!ALLOWED_TYPES[file.type]) {
    errors.push(`Tipo file non supportato: ${file.type}. Supportati: ${Object.keys(ALLOWED_TYPES).join(', ')}`);
  }
  
  // Controllo dimensione
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File troppo grande: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Massimo: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  // Controllo nome file
  if (file.name.length > 100) {
    errors.push('Nome file troppo lungo (max 100 caratteri)');
  }
  
  return errors;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function MediaUploader({ onUploadSuccess, collections }) {
  const [fileQueue, setFileQueue] = useState([]); // Manages queued, uploading, success, error files
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(collections[0] || "Generale");
  const [uploadErrors, setUploadErrors] = useState([]); // For validation errors before queuing

  // Helper per leggere Retry-After o calcolare backoff
  const getRetryAfterSeconds = (error, attempt) => {
    const header =
      error?.response?.headers?.['retry-after'] ||
      (typeof error?.response?.headers?.get === 'function' ? error.response.headers.get('retry-after') : null); // Check headers.get for axios/fetch consistency
    const parsed = header ? parseInt(header, 10) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    // fallback backoff esponenziale: 2s, 4s, 8s...
    return Math.pow(2, attempt);
  };

  // Funzione di upload con retry
  const uploadFileWithRetry = useCallback(async (fileInQueue, onProgress, maxRetries = 3) => {
    const sanitizedName = sanitizeFileName(fileInQueue.originalFile.name);
    const newFile = new File([fileInQueue.originalFile], sanitizedName, { type: fileInQueue.originalFile.type });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await UploadFile({ file: newFile });
        if (!response || !response.file_url) {
          throw new Error('Risposta upload non valida');
        }
        return response;
      } catch (error) {
        // Messaggio comprensibile
        let errorMessage = 'Errore sconosciuto';
        if (error.message) errorMessage = error.message;
        if (error.response?.data?.detail) errorMessage = error.response.data.detail;

        if (error.response?.status === 429 && attempt < maxRetries) {
          const waitSec = getRetryAfterSeconds(error, attempt);
          onProgress({ status: 'retrying', progress: 50, error: `Limite temporaneo: riprovo tra ${waitSec}s...` });
          await delay(waitSec * 1000);
          onProgress({ status: 'uploading', progress: 50, error: null });
          continue; // Riprova
        }
        // Non 429 o superato il numero di tentativi
        throw new Error(errorMessage);
      }
    }
    throw new Error(`Upload fallito dopo ${maxRetries} tentativi.`);
  }, []);

  // Processa la coda di upload
  useEffect(() => {
    const processQueue = async () => {
      const uploadingFilesCount = fileQueue.filter(f => f.status === 'uploading' || f.status === 'retrying').length;
      const filesToStart = fileQueue.filter(f => f.status === 'queued');

      if (uploadingFilesCount < MAX_CONCURRENT_UPLOADS && filesToStart.length > 0) {
        const fileToProcess = filesToStart[0];
        
        // Aggiorna lo stato a 'uploading' per iniziare, azzerando eventuali errori precedenti
        setFileQueue(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, status: 'uploading', progress: 25, error: null } : f));
        
        try {
          // Callback per aggiornare il progresso del singolo file
          const onProgress = (update) => {
            setFileQueue(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, ...update } : f));
          };
          
          const uploadResponse = await uploadFileWithRetry(fileToProcess, onProgress);
          onProgress({ progress: 75 });
          
          const fileType = fileToProcess.originalFile.type.startsWith('image') ? 'image' : 
                          (fileToProcess.originalFile.type.startsWith('video') ? 'video' : 'document');

          const mediaData = {
            name: sanitizeFileName(fileToProcess.originalFile.name), // Use sanitized name for DB
            file_url: uploadResponse.file_url,
            file_type: fileToProcess.originalFile.type,
            file_size: fileToProcess.originalFile.size,
            collection: selectedCollection,
            type: fileType,
            description: `Caricato il ${new Date().toLocaleDateString()}`
          };
          await Media.create(mediaData);
          
          onProgress({ status: 'success', progress: 100, error: null });
          onUploadSuccess && onUploadSuccess(); // Aggiorna la libreria se la prop è definita

        } catch (error) {
          console.error(`Failed to upload ${fileToProcess.name}:`, error);
          const msg = error?.message || 'Errore sconosciuto';
          setFileQueue(prev => prev.map(f => f.id === fileToProcess.id ? { ...f, status: 'error', error: msg, progress: 100 } : f));
        }
      }
    };

    const interval = setInterval(processQueue, 500); // Controlla la coda ogni 500ms
    return () => clearInterval(interval);

  }, [fileQueue, uploadFileWithRetry, onUploadSuccess, selectedCollection]);


  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    setUploadErrors([]); // Clear previous validation errors
    const newFilesToQueue = [];
    const validationErrors = [];

    fileArray.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        validationErrors.push({ fileName: file.name, errors: fileErrors });
      } else {
        newFilesToQueue.push({
          id: `${file.name}-${Date.now()}`, // Unique ID for each file in queue
          name: file.name, // Original name for display
          originalFile: file, // The actual File object
          status: 'queued', // Initial status
          progress: 0,
          error: null
        });
      }
    });

    if (validationErrors.length > 0) {
      setUploadErrors(validationErrors);
      // Auto-clear validation errors after 10 seconds
      setTimeout(() => setUploadErrors([]), 10000); 
    }
    
    // Add new valid files to the queue
    setFileQueue(prev => [...prev, ...newFilesToQueue]);

  }, []);
  
  const clearCompleted = () => {
    // Keep files that are still uploading, retrying, queued, or have errors
    setFileQueue(prev => prev.filter(f => f.status === 'uploading' || f.status === 'retrying' || f.status === 'queued' || f.status === 'error'));
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    e.target.value = ''; // Reset per permettere ricaricamento stesso file
  };

  return (
    <div className="space-y-6">
      {/* Selezione Collezione */}
      <div className="bg-white p-4 rounded-lg border">
        <Label className="text-sm font-medium mb-2 block">Collezione di Destinazione</Label>
        <Select value={selectedCollection} onValueChange={setSelectedCollection}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Seleziona collezione" />
          </SelectTrigger>
          <SelectContent>
            {collections.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          I file verranno organizzati nella collezione selezionata
        </p>
      </div>

      {/* Area Upload */}
      <div 
        className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
          isDragOver 
            ? 'border-red-600 bg-red-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input 
          id="file-input"
          type="file"
          multiple
          accept={Object.keys(ALLOWED_TYPES).join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${
            isDragOver ? 'text-red-600' : 'text-gray-400'
          }`} />
          <p className="font-semibold text-gray-700 mb-2">
            Trascina i file qui o clicca per caricare
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supportati: JPG, PNG, WEBP, PDF, CSV, MP4 • Max {MAX_FILE_SIZE / (1024 * 1024)}MB
          </p>
          <Button variant="outline" className="pointer-events-none">
            <Plus className="w-4 h-4 mr-2" />
            Seleziona File
          </Button>
        </div>
      </div>

      {/* Errori di Validazione */}
      {uploadErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h4 className="font-medium text-red-800">File non validi</h4>
          </div>
          <div className="space-y-2">
            {uploadErrors.map((error, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium text-red-700">{error.fileName}:</p>
                <ul className="list-disc list-inside text-red-600 ml-4">
                  {error.errors.map((err, errIndex) => (
                    <li key={errIndex}>{err}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Progress Upload */}
      {fileQueue.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Coda di Upload</h4>
            <Button variant="outline" size="sm" onClick={clearCompleted}>
              Pulisci completati
            </Button>
          </div>
          {fileQueue.map((file) => (
            <div key={file.id} className={`p-4 border rounded-lg flex items-center gap-4 ${
              file.status === 'error' ? 'bg-red-50 border-red-200' : 'bg-white'
            }`}>
              <div className="flex-shrink-0">
                {file.status === 'queued' && <Clock className="w-5 h-5 text-gray-400" />}
                {(file.status === 'uploading' || file.status === 'retrying') && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                {file.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {file.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                {file.error && (
                  <p className="text-xs text-red-600 mt-1">{file.error}</p>
                )}
                {/* Progress bar only for files that are not just queued and not yet successful/failed */}
                {(file.status === 'uploading' || file.status === 'retrying') && (
                  <Progress value={file.progress} className="h-2 mt-2" />
                )}
                {/* Show 100% progress for completed/failed items */}
                {(file.status === 'success' || file.status === 'error') && (
                  <Progress value={100} className="h-2 mt-2" />
                )}
              </div>
              <div className="text-xs font-medium w-28 text-right">
                {file.status === 'queued' && <span className="text-gray-500">In coda</span>}
                {file.status === 'uploading' && <span className="text-blue-600">Caricamento…</span>}
                {file.status === 'retrying' && <span className="text-yellow-600">Riprovo…</span>}
                {file.status === 'success' && <span className="text-green-600">✓ Completato</span>}
                {file.status === 'error' && <span className="text-red-600">✗ Errore</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
