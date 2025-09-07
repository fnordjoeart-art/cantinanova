
import React, { useState, useMemo } from 'react';
import { Winery, Media } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, FileText, ImageIcon, CheckCircle, AlertTriangle, Loader2, Link as LinkIcon, Building, Wine as WineIcon, Info, Trash2, Gift } from 'lucide-react'; // Added Gift icon
import { Link as RouterLink } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Progress } from '@/components/ui/progress';

const sanitizeFileName = (fileName) =>
  fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_').replace(/_{2,}/g, '_').replace(/^_+|_+$/g, '');

const DroppableArea = ({ onDrop, title, description, acceptedTypes, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (disabled) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = acceptedTypes;
    input.onchange = (e) => onDrop(e.target.files);
    input.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`p-8 border-2 border-dashed rounded-xl text-center transition-all ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : `cursor-pointer ${isDragOver ? 'border-red-600 bg-red-50 scale-[1.01]' : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'}`
      }`}
    >
      <div className="flex flex-col items-center pointer-events-none">
        <Upload className="w-10 h-10 text-gray-400 mb-3" />
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        {disabled && <p className="text-xs text-red-500 mt-2 font-semibold">Carica prima il file CSV delle cantine.</p>}
      </div>
    </div>
  );
};


const ImportWineries = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [parsedWineries, setParsedWineries] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ value: 0, text: '' });
  const [importResult, setImportResult] = useState(null);
  const [importErrors, setImportErrors] = useState([]);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const uploadFileWithRetry = async (file, maxRetries = 3) => {
    const sanitizedName = sanitizeFileName(file.name);
    const newFile = new File([file], sanitizedName, { type: file.type });
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await UploadFile({ file: newFile });
        if (!response?.file_url) throw new Error("Risposta upload non valida");
        return response;
      } catch (error) {
        if (error.response?.status === 429 && attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.warn(`Rate limit hit per ${file.name}. Riprovo tra ${waitTime / 1000}s...`);
          await delay(waitTime);
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Upload di ${file.name} fallito dopo ${maxRetries} tentativi.`);
  };
  
  // --- FUNZIONI DI UTILITÀ RIPRISTINATE ---
  const getValueWithSynonyms = (obj, keys) => {
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        return obj[key];
      }
    }
    return null;
  };

  const generateSlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/&/g, 'e')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  const parseCityProvince = (cityField) => {
    if (!cityField) return { citta: null, provincia: null };
    const match = cityField.match(/^(.*?)\s*\(([A-Z]{2})\)$/i);
    if (match) {
      return { citta: match[1].trim(), provincia: match[2].trim().toUpperCase() };
    }
    return { citta: cityField.trim(), provincia: null };
  };

  const generateUniqueCode = async (name, usedCodes) => {
    if (!name) name = "CANTINA";
    let baseCode = name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    let uniqueCode = baseCode;
    let counter = 1;
    // This check is against codes used in the current import session
    while (usedCodes.has(uniqueCode)) {
      uniqueCode = `${baseCode}${counter}`;
      counter++;
    }
    usedCodes.add(uniqueCode); // Mark as used for subsequent generations in the same run
    return uniqueCode;
  };
  // --- FINE FUNZIONI DI UTILITÀ ---

  const handleCsvDrop = (files) => {
    const file = files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        // Parse CSV using a simple split for now, consider a more robust library like 'papaparse' for production
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length > 0) {
          const headers = lines[0].split(';').map(h => h.trim());
          const data = lines.slice(1).map(line => {
            const values = line.split(';').map(v => v.trim());
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {});
          });
          setParsedWineries(data);
          setImportErrors([]); // Clear previous errors on new CSV drop
          setImportResult(null); // Clear previous results
        }
      };
      reader.readAsText(file);
    } else {
      alert("Per favore, carica un file CSV valido.");
      setCsvFile(null);
      setParsedWineries([]);
    }
  };

  const handleRemoveCsv = () => {
    setCsvFile(null);
    setParsedWineries([]);
    setMediaFiles([]); // Rimuove anche i media associati, per evitare confusioni
    setImportErrors([]);
    setImportResult(null);
  };

  const handleMediaDrop = (files) => {
    if (!csvFile) {
      alert("Per favore, carica prima il file CSV delle cantine.");
      return;
    }
    setMediaFiles(prev => [...prev, ...Array.from(files)]);
  };

  const linkedMedia = useMemo(() => {
    if (parsedWineries.length === 0 || mediaFiles.length === 0) return [];

    return mediaFiles.map(file => {
      const fileNameLower = file.name.toLowerCase();
      // Regex più tollerante per estrarre il codice_cantina prima di _cover, _gallery, o il punto dell'estensione
      const match = fileNameLower.match(/^(.*?)(_cover|_gallery|\.[^.]+$)/);
      const wineryCode = match ? match[1] : '';

      const wineryMatch = parsedWineries.find(w => {
        const csvCode = getValueWithSynonyms(w, ['codice_cantina', 'codice', 'Codice'])?.toLowerCase();
        return csvCode && csvCode === wineryCode;
      });

      return {
        file,
        linked: !!wineryMatch,
        wineryName: wineryMatch ? (getValueWithSynonyms(wineryMatch, ['name', 'Nome', 'cantina']) || 'N/A') : 'Non Trovata',
        wineryCode: wineryCode.toUpperCase(),
      };
    });
  }, [mediaFiles, parsedWineries]);

  const handleImport = async () => {
    setIsProcessing(true);
    setImportResult(null);
    setImportErrors([]);
    let createdCount = 0;
    let updatedCount = 0;
    const errors = [];
    
    const allMediaItems = await Media.list();
    const mediaMapByName = new Map(allMediaItems.map(item => [item.name.toLowerCase(), item.file_url]));

    setProgress({ value: 5, text: 'Caricamento nuovi media...' });
    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      setProgress({ value: 5 + (45 * (i + 1) / mediaFiles.length), text: `Caricando ${file.name}` });
      try {
        const response = await uploadFileWithRetry(file);
        const sanitizedName = sanitizeFileName(file.name);
        mediaMapByName.set(sanitizedName.toLowerCase(), response.file_url);
      } catch (e) {
        const errorMessage = e.message || 'Errore sconosciuto';
        errors.push(`Errore upload media '${file.name}': ${errorMessage}`);
        console.error("Failed to upload file:", file.name, e);
      }
    }

    setProgress({ value: 50, text: 'Importazione dati cantine...' });
    
    const allExistingWineries = await Winery.filter({});
    const usedCodes = new Set(allExistingWineries.map(w => w.codice_cantina));
    
    for (let i = 0; i < parsedWineries.length; i++) {
      const wineryData = parsedWineries[i];
      const wineryIdentifier = getValueWithSynonyms(wineryData, ['name', 'Nome']) || `Riga ${i + 2}`;
      
      try {
        let codiceCantina = getValueWithSynonyms(wineryData, ['codice_cantina', 'codice', 'Codice']);
        if (!codiceCantina) {
          const nameForCode = getValueWithSynonyms(wineryData, ['name', 'Nome']);
          codiceCantina = await generateUniqueCode(nameForCode, usedCodes);
          errors.push(`Avviso: Codice cantina mancante per '${wineryIdentifier}'. Generato: ${codiceCantina}`);
        } else if (usedCodes.has(codiceCantina)) {
          // If code is duplicated within the CSV or exists in DB and new entry is distinct
          // For now, let's just make sure new unique codes generated don't conflict with parsed ones.
          // Actual duplicate handling would need more complex logic (e.g. check ID for update)
        } else {
          usedCodes.add(codiceCantina);
        }

        const { citta, provincia } = parseCityProvince(getValueWithSynonyms(wineryData, ['citta', 'città', 'city']));

        const newWinery = {
          name: getValueWithSynonyms(wineryData, ['name', 'Nome', 'cantina']),
          slug: generateSlug(getValueWithSynonyms(wineryData, ['name', 'Nome', 'cantina'])),
          codice_cantina: codiceCantina,
          descrizione: getValueWithSynonyms(wineryData, ['descrizione', 'description']),
          indirizzo: getValueWithSynonyms(wineryData, ['indirizzo', 'address']),
          cap: getValueWithSynonyms(wineryData, ['cap', 'zip']),
          citta: citta,
          provincia: provincia,
          nazione: getValueWithSynonyms(wineryData, ['nazione', 'country']),
          telefono: getValueWithSynonyms(wineryData, ['telefono', 'phone']),
          email: getValueWithSynonyms(wineryData, ['email']),
          website: getValueWithSynonyms(wineryData, ['website', 'sito_web']),
          facebook_link: getValueWithSynonyms(wineryData, ['facebook', 'facebook_link']),
          instagram_link: getValueWithSynonyms(wineryData, ['instagram', 'instagram_link']),
          youtube_link: getValueWithSynonyms(wineryData, ['youtube', 'youtube_link']),
          google_maps_link: getValueWithSynonyms(wineryData, ['google_maps', 'maps_link']),
          // Assuming lat/lng might be present as numbers
          lat: parseFloat(getValueWithSynonyms(wineryData, ['lat', 'latitude']) || 0),
          lng: parseFloat(getValueWithSynonyms(wineryData, ['lng', 'longitude']) || 0),
          // Additional fields that might be in the CSV
          type: getValueWithSynonyms(wineryData, ['type', 'tipologia']),
          founded_year: parseInt(getValueWithSynonyms(wineryData, ['founded_year', 'anno_fondazione']) || 0),
          size_hectares: parseFloat(getValueWithSynonyms(wineryData, ['size_hectares', 'ettari']) || 0),
          organic_certified: (getValueWithSynonyms(wineryData, ['organic_certified', 'bio_certificato']) || '').toLowerCase() === 'si',
        };

        // --- LOGICA AGGANCIO COVER ---
        let coverUrl = null;
        const coverFilenameFromCsv = getValueWithSynonyms(wineryData, ['cover_filename', 'immagine_cover_filename', 'copertina']);
        
        if (coverFilenameFromCsv) {
          if (mediaMapByName.has(coverFilenameFromCsv.toLowerCase())) {
            coverUrl = mediaMapByName.get(coverFilenameFromCsv.toLowerCase());
          } else {
            errors.push(`Avviso per '${wineryIdentifier}': cover '${coverFilenameFromCsv}' specificata nel CSV ma non trovata nei media.`);
          }
        } else {
          // Cerca per convenzione: codice_cantina.png/jpg etc.
          const commonExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
          for (const ext of commonExtensions) {
            const conventionFilename = `${codiceCantina.toLowerCase()}${ext}`;
            if (mediaMapByName.has(conventionFilename)) {
              coverUrl = mediaMapByName.get(conventionFilename);
              break;
            }
          }
        }

        if (coverUrl) {
          newWinery.cover_image_url = coverUrl;
        }
        // --- FINE LOGICA COVER ---
        
        const existing = await Winery.filter({ codice_cantina: codiceCantina });
        if (existing.length > 0) {
          await Winery.update(existing[0].id, newWinery);
          updatedCount++;
        } else {
          await Winery.create(newWinery);
          createdCount++;
        }
      } catch (e) {
        let errorMessage = e.message;
        if (typeof e === 'object' && e !== null && e.response?.data) {
          errorMessage = e.response.data.detail || JSON.stringify(e.response.data);
        }
        errors.push(`Errore cantina '${wineryIdentifier}': ${errorMessage}`);
        console.error("Failed to import winery:", wineryIdentifier, e);
      }
      setProgress({ value: 50 + (50 * (i + 1) / parsedWineries.length), text: `Importando ${wineryIdentifier}` });
    }
    
    setIsProcessing(false);
    setImportErrors(errors);
    setImportResult({ created: createdCount, updated: updatedCount, media: mediaFiles.length, totalProcessed: parsedWineries.length, errors: errors.length });
    setMediaFiles([]);
  };

  return (
    <div className="space-y-6">
      {!isProcessing && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Passo 1: Carica il file CSV delle Cantine</CardTitle>
              <CardDescription>
                Carica un file CSV contenente i dati delle cantine. Assicurati che le colonne siano separate da punto e virgola (<code>;</code>) e che contenga almeno le colonne <code>name</code> e <code>codice_cantina</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DroppableArea onDrop={handleCsvDrop} title="Carica file CSV" description="Trascina o clicca per selezionare (.csv)" acceptedTypes=".csv" />
              {csvFile && (
                <div className="mt-4 p-3 border rounded-lg bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{csvFile.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{parsedWineries.length} righe caricate</span>
                    <Button variant="ghost" size="icon" onClick={handleRemoveCsv} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <span className="sr-only">Rimuovi file</span>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passo 2 (Opzionale): Carica le Immagini</CardTitle>
              <CardDescription>
                Puoi caricare qui nuove immagini o lasciare che il sistema agganci quelle già presenti nella Media Library.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DroppableArea 
                onDrop={handleMediaDrop} 
                title="Carica immagini" 
                description="Trascina o clicca per selezionare (.jpg, .png, .webp)" 
                acceptedTypes="image/jpeg,image/png,image/webp"
                disabled={!csvFile} 
              />
              {mediaFiles.length > 0 && (
                <div className="mt-4 max-h-60 overflow-y-auto space-y-2 p-3 border rounded-lg">
                  {linkedMedia.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 rounded-md bg-white border">
                      <div className="flex items-center truncate">
                        <ImageIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="truncate mr-2">{item.file.name}</span>
                        {item.linked ? (
                          <span className="flex items-center text-green-600 ml-auto">
                            <CheckCircle className="w-4 h-4 mr-1" /> Collegato a: {item.wineryName} ({item.wineryCode})
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600 ml-auto">
                            <AlertTriangle className="w-4 h-4 mr-1" /> Nessuna cantina corrispondente
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
               <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-center gap-3">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <span>
                    <b>Nota:</b> Il sistema aggancerà automaticamente anche le immagini già presenti nella Media Library se i nomi dei file corrispondono al <strong>codice_cantina</strong> (es. <code>AB001.png</code>).
                  </span>
                </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleImport}
              disabled={parsedWineries.length === 0}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              <Upload className="w-5 h-5 mr-2" />
              Avvia Importazione ({parsedWineries.length} cantine)
            </Button>
          </div>
        </>
      )}

      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Importazione in corso...
            </CardTitle>
            <CardDescription>{progress.text}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress.value} className="w-full" />
            <p className="text-center mt-2 text-sm text-gray-600">{Math.round(progress.value)}% completato</p>
          </CardContent>
        </Card>
      )}

      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle>Risultato Importazione</CardTitle>
            <CardDescription>Riepilogo dell'operazione di importazione.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Cantine create: <span className="font-semibold text-green-600">{importResult.created}</span></p>
              <p>Cantine aggiornate: <span className="font-semibold text-blue-600">{importResult.updated}</span></p>
              <p>Media caricati: <span className="font-semibold text-purple-600">{importResult.media}</span></p>
              <p>Totale cantine elaborate: <span className="font-semibold">{importResult.totalProcessed}</span></p>
              <p>Errori riscontrati: <span className="font-semibold text-red-600">{importResult.errors}</span></p>
            </div>
            {importErrors.length > 0 && (
              <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg max-h-40 overflow-y-auto">
                <h4 className="font-semibold text-red-700 mb-2">Dettagli Errori:</h4>
                <ul className="list-disc pl-5 text-red-600 text-sm">
                  {importErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => {
                setCsvFile(null);
                setParsedWineries([]);
                setMediaFiles([]);
                setImportResult(null);
                setImportErrors([]);
              }}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Nuova Importazione
              </Button>
              <RouterLink to={createPageUrl('admin_wineries_list')}>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <WineIcon className="w-4 h-4 mr-2" /> Vai alla lista cantine
                </Button>
              </RouterLink>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Nuovo componente: Import Demo Package (JSONL + images)
const ImportDemoPackage = () => {
  const [jsonlFile, setJsonlFile] = useState(null);
  const [records, setRecords] = useState([]); // parsed JSONL rows
  const [imageFiles, setImageFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ value: 0, text: "" });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // Sanitize senza timestamp: preserva il pattern CODICE_cover.png
  const sanitizeNamePreservePattern = (fileName) =>
    fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_').replace(/_{2,}/g, '_').replace(/^_+|_+$/g, '');

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

  const uploadFileWithRetry = async (file, onStatus, maxRetries = 3) => {
    const sanitizedName = sanitizeNamePreservePattern(file.name);
    const newFile = new File([file], sanitizedName, { type: file.type });
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await UploadFile({ file: newFile });
        if (!res?.file_url) throw new Error("Risposta upload non valida");
        return res;
      } catch (error) {
        if (error?.response?.status === 429 && attempt < maxRetries) {
          const wait = getRetryAfterSeconds(error, attempt);
          onStatus?.(`Rate limit: riprovo tra ${wait}s…`);
          await delay(wait * 1000);
          continue;
        }
        throw error;
      }
    }
    throw new Error(`Upload fallito dopo ${maxRetries} tentativi`);
  };

  const entityCreateWithRetry = async (data, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await Winery.create(data);
      } catch (error) {
        if (error?.response?.status === 429 && attempt < maxRetries) {
          const wait = getRetryAfterSeconds(error, attempt);
          await delay(wait * 1000);
          continue;
        }
        throw error;
      }
    }
  };

  const entityUpdateWithRetry = async (id, data, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await Winery.update(id, data);
      } catch (error) {
        if (error?.response?.status === 429 && attempt < maxRetries) {
          const wait = getRetryAfterSeconds(error, attempt);
          await delay(wait * 1000);
          continue;
        }
        throw error;
      }
    }
  };

  const parseJsonl = async (file) => {
    const txt = await file.text();
    const lines = txt.split(/\r?\n/).filter(l => l.trim() !== "");
    const tmp = [];
    const parseErrors = [];
    lines.forEach((line, idx) => {
      try {
        const obj = JSON.parse(line);
        tmp.push({ ...obj, __row: idx + 1 }); // salva numero riga per report
      } catch (e) {
        parseErrors.push(`Riga ${idx + 1}: JSON non valido`);
      }
    });
    setRecords(tmp);
    setErrors(parseErrors);
  };

  const onJsonlDrop = (files) => {
    const f = files[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".jsonl")) {
      alert("Seleziona un file .jsonl");
      return;
    }
    setJsonlFile(f);
    parseJsonl(f);
  };

  const onImagesDrop = (files) => {
    setImageFiles(prev => [...prev, ...Array.from(files)]);
  };

  const generateSlug = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/&/g, "e")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const normCode = (code) => (code || "").toString().trim().toUpperCase();

  // Costruisce oggetto cantina limitato ai campi dello schema attuale
  const buildWineryData = (row, coverUrl, galleryUrls) => {
    const pick = (k) => row[k] ?? row[k.toLowerCase()] ?? row[k.toUpperCase()];
    const name = (pick("name") || "").toString().trim();
    const regione = pick("region") || pick("regione");
    const provincia = pick("provincia") || pick("province");
    const citta = pick("citta") || pick("città") || pick("city");
    const indirizzo = pick("indirizzo") || pick("address");
    const cap = pick("cap") || pick("zip");
    const email = pick("email");
    const phone = pick("phone") || pick("telefono");
    const website = pick("website") || pick("sito_web");
    const descrizione_breve = pick("descrizione_breve") || pick("slogan");
    const story = pick("story") || pick("storia");

    const data = {
      name,
      slug: generateSlug(name),
      codice_cantina: normCode(pick("codice_cantina") || pick("codice")),
      region: regione,
      provincia: provincia,
      citta: citta,
      indirizzo: indirizzo,
      cap: cap,
      email: email,
      phone: phone,
      website: website && typeof website === "string" && !/^https?:\/\//i.test(website) ? `https://${website}` : website,
      descrizione_breve: descrizione_breve,
      story: story,
      attiva: true
    };

    if (coverUrl) data.cover_image_url = coverUrl;
    if (galleryUrls?.length) data.galleria = galleryUrls;

    // Rimuovi chiavi undefined/empty
    Object.keys(data).forEach(k => {
      if (data[k] === undefined || data[k] === null || data[k] === "") delete data[k];
    });

    return data;
  };

  const handleImport = async () => {
    if (!jsonlFile || records.length === 0) {
      alert("Carica prima il file JSONL.");
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setErrors(prev => prev.filter(Boolean)); // mantieni eventuali errori di parsing
    let created = 0;
    let updated = 0;
    let imagesLinked = 0;

    // 1) Carica immagini (se presenti) e crea una mappa per nome base -> url
    setProgress({ value: 5, text: 'Caricamento immagini...' });
    const mediaMap = new Map(); // baseName (senza estensione) -> { url, name }
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const f = imageFiles[i];
        setProgress({ value: 5 + (30 * (i + 1) / imageFiles.length), text: `Caricando immagine ${f.name}` });
        try {
          const res = await uploadFileWithRetry(f, (s) => setProgress(p => ({ ...p, text: `Upload ${f.name}: ${s}` })));
          const sanitizedName = sanitizeNamePreservePattern(f.name);
          const base = sanitizedName.replace(/\.[^.]+$/, '').toLowerCase();
          mediaMap.set(base, { url: res.file_url, name: sanitizedName });
          // Crea record in Media (opzionale ma utile)
          const fileType = f.type?.startsWith('image') ? 'image' : 'document';
          await Media.create({
            name: sanitizedName,
            file_url: res.file_url,
            file_type: f.type || 'image/png',
            file_size: f.size,
            collection: 'Cantine',
            type: fileType,
            description: `Import demo - ${sanitizedName}`
          });
        } catch (e) {
          const msg = e?.response?.data?.detail || e.message || 'Errore upload';
          setErrors(prev => [...prev, `Upload immagine '${f.name}': ${msg}`]);
        }
      }
    }

    // 2) Per ogni riga JSONL: upsert by codice_cantina e linking immagini
    setProgress({ value: 40, text: 'Importazione dati cantine...' });
    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNo = row.__row || (i + 1);
      const codice = normCode(row.codice_cantina || row.codice);
      const name = (row.name || "").toString().trim();

      try {
        if (!name) throw new Error("Nome mancante o vuoto");
        if (!codice) throw new Error("codice_cantina mancante");

        // Match immagini: CODICE_cover.*, CODICE_gallery_1.*, _2.*, ...
        let coverUrl = null;
        const coverBase = `${codice}_cover`.toLowerCase();
        if (mediaMap.has(coverBase)) {
          coverUrl = mediaMap.get(coverBase).url;
          imagesLinked += 1;
        }

        const galleryUrls = [];
        // raccogli tutte le chiavi che iniziano con `${codice}_gallery_`
        const galleryPrefix = `${codice}_gallery_`.toLowerCase();
        const galleryCandidates = Array.from(mediaMap.keys()).filter(k => k.startsWith(galleryPrefix));
        // Ordina per indice numerico se presente
        galleryCandidates.sort((a, b) => {
          const ai = parseInt(a.split('_').pop(), 10);
          const bi = parseInt(b.split('_').pop(), 10);
          if (Number.isFinite(ai) && Number.isFinite(bi)) return ai - bi;
          return a.localeCompare(b);
        });
        galleryCandidates.forEach(base => {
          galleryUrls.push(mediaMap.get(base).url);
        });
        imagesLinked += galleryUrls.length;

        const data = buildWineryData(row, coverUrl, galleryUrls);

        // Upsert by codice
        const existing = await Winery.filter({ codice_cantina: codice });
        if (existing.length > 0) {
          await entityUpdateWithRetry(existing[0].id, data);
          updated++;
        } else {
          await entityCreateWithRetry(data);
          created++;
        }
      } catch (e) {
        const detail = e?.response?.data?.detail || e.message || "Errore sconosciuto";
        setErrors(prev => [...prev, `Riga ${rowNo} (${name || codice || "sconosciuta"}): ${detail}`]);
      }

      setProgress({ value: 40 + (60 * (i + 1) / records.length), text: `Importando riga ${rowNo}` });
      await delay(150); // piccola pausa anti-rate-limit
    }

    setIsProcessing(false);
    setResult({ created, updated, imagesLinked, total: records.length, errors: errors.length });
  };

  return (
    <div className="space-y-6">
      {!isProcessing && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Passo 1: Carica il file JSONL</CardTitle>
              <CardDescription>
                Seleziona il file cantine_20_seed.jsonl del pacchetto demo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DroppableArea
                onDrop={(files) => onJsonlDrop(files)}
                title="Carica file .jsonl"
                description="Trascina o clicca per selezionare (JSON Lines)"
                acceptedTypes=".jsonl"
                disabled={false}
              />
              {jsonlFile && (
                <div className="mt-3 text-sm text-gray-600">
                  Selezionato: <span className="font-medium">{jsonlFile.name}</span> • Righe: <span className="font-medium">{records.length}</span>
                </div>
              )}
              {errors.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {errors.length} avvisi (parsing JSONL). L'import proseguirà comunque.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passo 2: Carica le immagini</CardTitle>
              <CardDescription>
                Seleziona i file dalla cartella images (puoi selezionare tutti i file). Il sistema collegherà automaticamente cover e gallery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DroppableArea
                onDrop={(files) => onImagesDrop(files)}
                title="Carica immagini (images/)"
                description="Trascina o clicca per selezionare (.png, .jpg, .jpeg, .webp)"
                acceptedTypes="image/png,image/jpeg,image/jpg,image/webp"
                disabled={false}
              />
              {imageFiles.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  Immagini selezionate: <span className="font-medium">{imageFiles.length}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleImport}
              disabled={!jsonlFile || records.length === 0}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Importa pacchetto demo
            </Button>
          </div>

          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            Nota: per limiti del browser, carica direttamente il file .jsonl e i file nella cartella images (se il pacchetto è uno ZIP, estrailo e trascina qui i contenuti).
          </div>
        </>
      )}

      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Importazione demo in corso...
            </CardTitle>
            <CardDescription>{progress.text}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress.value} className="w-full" />
            <p className="text-center mt-2 text-sm text-gray-600">{Math.round(progress.value)}% completato</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Report Importazione Demo</CardTitle>
            <CardDescription>Riepilogo del pacchetto demo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Cantine create: <span className="font-semibold text-green-600">{result.created}</span></p>
              <p>Cantine aggiornate: <span className="font-semibold text-blue-600">{result.updated}</span></p>
              <p>Immagini collegate: <span className="font-semibold text-purple-600">{result.imagesLinked}</span></p>
              <p>Righe elaborate: <span className="font-semibold">{result.total}</span></p>
              <p>Errori/avvisi: <span className="font-semibold text-red-600">{errors.length}</span></p>
            </div>
            {errors.length > 0 && (
              <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg max-h-40 overflow-y-auto">
                <h4 className="font-semibold text-red-700 mb-2">Dettagli:</h4>
                <ul className="list-disc pl-5 text-red-600 text-sm">
                  {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function AdminImport() {
  return (
    <div className="container mx-auto p-6">
      <RouterLink to={createPageUrl('AdminDashboard')} className="mb-6 inline-block">
        <Button variant="outline" className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla Dashboard
        </Button>
      </RouterLink>

      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
        <Upload className="w-8 h-8 mr-3 text-red-700" />
        Importazione Cantine
      </h1>
      <p className="text-gray-600 mb-8">
        Strumento per importare o aggiornare massivamente i dati delle cantine tramite file CSV/JSONL e associare immagini.
      </p>
      
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[520px]">
          <TabsTrigger value="import">
            <Building className="w-4 h-4 mr-2" /> Importa CSV
          </TabsTrigger>
          <TabsTrigger value="demo">
            <Gift className="w-4 h-4 mr-2" /> Importa pacchetto demo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="import" className="mt-6">
          <ImportWineries />
        </TabsContent>
        <TabsContent value="demo" className="mt-6">
          <ImportDemoPackage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
