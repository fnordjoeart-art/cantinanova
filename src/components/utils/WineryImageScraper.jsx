import { UploadFile, GenerateImage } from "@/api/integrations";

// Sistema automatico per recuperare immagini cantine
export class WineryImageScraper {
  
  // Verifica se un sito web è accessibile
  static async checkWebsiteExists(url) {
    if (!url) return false;
    
    try {
      // Prova a fare una semplice richiesta HEAD
      const response = await fetch(url, { 
        method: 'HEAD',
        timeout: 5000,
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.log(`Sito non accessibile: ${url}`);
      return false;
    }
  }

  // Estrae immagini principali da un sito web
  static async scrapeWineryImages(winery) {
    if (!winery.website) {
      console.log(`${winery.name}: Nessun sito web disponibile`);
      return await this.generateAIImage(winery);
    }

    try {
      console.log(`🔍 Analizzando sito: ${winery.name} - ${winery.website}`);
      
      // Lista di possibili endpoint immagini per cantine
      const imageEndpoints = [
        '/wp-content/uploads/',
        '/images/',
        '/assets/images/',
        '/media/',
        '/gallery/',
        '/foto/',
        '/img/'
      ];

      // Keywords per identificare immagini di cantine
      const wineryKeywords = [
        'cantina', 'winery', 'vineyard', 'vigna', 'vigneto', 
        'cellar', 'cantina-', 'azienda', 'estate', 'tenuta',
        'hero', 'banner', 'cover', 'header', 'main'
      ];

      // Prova a trovare immagini comuni sui siti delle cantine
      const commonImagePaths = [
        `${winery.website}/wp-content/uploads/cantina.jpg`,
        `${winery.website}/images/hero.jpg`,
        `${winery.website}/assets/images/winery.jpg`,
        `${winery.website}/img/cantina-${winery.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        `${winery.website}/gallery/main.jpg`,
        `${winery.website}/media/header.jpg`
      ];

      // Testa ogni possibile path
      for (const imagePath of commonImagePaths) {
        try {
          const response = await fetch(imagePath, { method: 'HEAD', timeout: 3000 });
          if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
            console.log(`✅ Immagine trovata: ${imagePath}`);
            return imagePath;
          }
        } catch (error) {
          // Continua con il prossimo path
          continue;
        }
      }

      // Se non trova immagini dirette, prova con pattern più specifici
      const specificPaths = [
        `${winery.website}/wp-content/uploads/${new Date().getFullYear()}/`,
        `${winery.website}/wp-content/uploads/${new Date().getFullYear() - 1}/`,
        `${winery.website}/images/gallery/`,
        `${winery.website}/assets/img/`,
      ];

      // Pattern di nomi file comuni per cantine
      const filePatterns = [
        'cantina', 'winery', 'azienda', 'estate', 'vineyard', 
        'hero', 'banner', 'main', 'cover', 'header'
      ];

      const fileExtensions = ['jpg', 'jpeg', 'png', 'webp'];

      for (const basePath of specificPaths) {
        for (const pattern of filePatterns) {
          for (const ext of fileExtensions) {
            try {
              const testUrl = `${basePath}${pattern}.${ext}`;
              const response = await fetch(testUrl, { method: 'HEAD', timeout: 2000 });
              if (response.ok) {
                console.log(`✅ Immagine trovata con pattern: ${testUrl}`);
                return testUrl;
              }
            } catch (error) {
              continue;
            }
          }
        }
      }

      console.log(`❌ Nessuna immagine trovata per ${winery.name}, genero AI`);
      return await this.generateAIImage(winery);

    } catch (error) {
      console.error(`Errore scraping ${winery.name}:`, error);
      return await this.generateAIImage(winery);
    }
  }

  // Genera un'immagine AI personalizzata per la cantina
  static async generateAIImage(winery) {
    try {
      console.log(`🎨 Generando immagine AI per: ${winery.name}`);
      
      // Crea prompt dettagliato basato sui dati della cantina
      const regionDescriptions = {
        "Piemonte": "rolling hills with morning mist, Langhe landscape",
        "Toscana": "cypress trees, golden tuscan hills, chianti countryside", 
        "Sicilia": "Mount Etna volcano, mediterranean vineyard, sunny landscape",
        "Veneto": "Prosecco hills, venetian countryside, alpine backdrop",
        "Friuli-Venezia Giulia": "Collio hills, border alpine landscape, elegant vineyards",
        "Campania": "Vesuvius volcano, Irpinia hills, southern italian landscape",
        "Emilia-Romagna": "Po valley, lambrusco vineyards, italian countryside",
        "Lazio": "Roman hills, Frascati landscape, volcanic soil vineyards",
        "Lombardia": "Franciacorta hills, lake district, northern italian vineyards",
        "Marche": "Adriatic hills, verdicchio landscape, central italy countryside",
        "Basilicata": "Mount Vulture, volcanic soil, aglianico vineyards, southern landscape",
        "Calabria": "Calabrian hills, southern italian landscape, mediterranean vineyard",
        "Sardegna": "Sardinian hills, mediterranean island vineyard, coastal landscape",
        "Umbria": "Umbrian hills, sagrantino landscape, green heart of italy",
        "Valle d'Aosta": "Alpine vineyard, mountain landscape, highest vineyards in europe",
        "Molise": "gentle hills, small region landscape, authentic italian countryside"
      };

      const styleDescriptions = {
        "moderna": "modern winery architecture, contemporary building, sleek design",
        "storica": "historic stone building, traditional italian architecture, ancient cellar",
        "familiare": "family estate, rustic charm, traditional farmhouse", 
        "innovativa": "cutting-edge winery, innovative design, modern technology",
        "biologica": "organic vineyard, natural farming, sustainable agriculture",
        "giovane": "young dynamic winery, fresh approach, modern viticulture"
      };

      const regionDesc = regionDescriptions[winery.region] || "italian vineyard landscape";
      const styleDesc = winery.tags ? 
        styleDescriptions[winery.tags.find(tag => styleDescriptions[tag])] || "beautiful winery estate" 
        : "charming italian winery";

      const prompt = `Professional photography of ${winery.name} winery in ${winery.region}, Italy. ${regionDesc}, ${styleDesc}. Beautiful vineyard rows, ${winery.production_method || 'traditional winemaking'}, golden hour lighting, cinematic composition, high quality, detailed, realistic, no text, no watermark`;

      console.log(`🎯 Prompt generato: ${prompt}`);

      const result = await GenerateImage({ prompt });
      
      if (result && result.url) {
        console.log(`✅ Immagine AI generata per ${winery.name}: ${result.url}`);
        return result.url;
      } else {
        // Fallback a immagine Unsplash tematica
        return this.getFallbackImage(winery);
      }

    } catch (error) {
      console.error(`Errore generazione AI per ${winery.name}:`, error);
      return this.getFallbackImage(winery);
    }
  }

  // Immagine di fallback da Unsplash
  static getFallbackImage(winery) {
    const fallbackImages = {
      "Piemonte": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
      "Toscana": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=400&fit=crop", 
      "Sicilia": "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=800&h=400&fit=crop",
      "default": "https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=800&h=400&fit=crop"
    };

    return fallbackImages[winery.region] || fallbackImages.default;
  }

  // Processo automatico per tutte le cantine
  static async processAllWineries(wineries) {
    console.log(`🚀 Avviando processo automatico per ${wineries.length} cantine...`);
    
    const results = {
      scraped: 0,
      aiGenerated: 0,
      fallback: 0,
      errors: []
    };

    for (const winery of wineries) {
      try {
        console.log(`\n📍 Processando: ${winery.name} (${winery.region})`);
        
        // Verifica se ha già un'immagine
        if (winery.cover_image_url && winery.cover_image_url.startsWith('http')) {
          console.log(`⏭️  Immagine già presente, skip...`);
          continue;
        }

        const imageUrl = await this.scrapeWineryImages(winery);
        
        if (imageUrl) {
          // Aggiorna la cantina nel database
          // Qui dovresti chiamare l'API per aggiornare il record
          console.log(`💾 Immagine assegnata a ${winery.name}: ${imageUrl}`);
          
          if (imageUrl.includes('openai') || imageUrl.includes('ai-generated')) {
            results.aiGenerated++;
          } else if (imageUrl.includes('unsplash')) {
            results.fallback++;
          } else {
            results.scraped++;
          }
        }

        // Pausa per non sovraccaricare i server
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Errore processando ${winery.name}:`, error);
        results.errors.push({ winery: winery.name, error: error.message });
      }
    }

    console.log(`\n📊 Risultati finali:`);
    console.log(`✅ Immagini estratte da siti: ${results.scraped}`);
    console.log(`🎨 Immagini generate con AI: ${results.aiGenerated}`);
    console.log(`🖼️  Immagini fallback: ${results.fallback}`);
    console.log(`❌ Errori: ${results.errors.length}`);

    return results;
  }
}