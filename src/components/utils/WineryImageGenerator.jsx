// Utility per generare URL immagini Unsplash per cantine
export const getWineryImage = (wineryName, region, tags = []) => {
  const baseUrl = "https://images.unsplash.com";
  
  // Mapping regioni -> keywords Unsplash
  const regionKeywords = {
    "Piemonte": "piedmont-vineyard-hills",
    "Toscana": "tuscany-vineyard-cypress", 
    "Sicilia": "sicily-vineyard-etna",
    "Veneto": "veneto-prosecco-hills",
    "Friuli-Venezia Giulia": "friuli-collio-vineyard",
    "Campania": "campania-vineyard-vesuvius",
    "Emilia-Romagna": "emilia-lambrusco-hills",
    "Lazio": "lazio-frascati-vineyard",
    "Lombardia": "lombardy-franciacorta-vineyard",
    "Marche": "marche-verdicchio-hills",
    "Basilicata": "basilicata-vulture-vineyard",
    "Calabria": "calabria-ciro-vineyard",
    "Sardegna": "sardinia-cannonau-vineyard",
    "Umbria": "umbria-sagrantino-hills",
    "Valle d'Aosta": "valle-aosta-alpine-vineyard",
    "Molise": "molise-biferno-vineyard"
  };

  // Keywords per tipo cantina
  const wineryTypeKeywords = {
    "moderna": "modern-winery-architecture",
    "storica": "historic-italian-winery", 
    "familiare": "family-vineyard-italy",
    "innovativa": "innovative-wine-cellar",
    "biologica": "organic-vineyard-rows",
    "naturale": "natural-wine-cellar"
  };

  // Crea keyword combinata
  const regionKeyword = regionKeywords[region] || "italian-vineyard";
  const typeKeyword = tags.find(tag => wineryTypeKeywords[tag]) || "wine-cellar";
  
  // Genera URL Unsplash ottimizzato
  return `${baseUrl}/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center&auto=format&q=80`;
};

// Lista di immagini vineyard/winery di alta qualità da Unsplash
export const vineyardImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop", // Vineyard rows
  "https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=800&h=400&fit=crop", // Wine cellar
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=400&fit=crop", // Tuscan vineyard
  "https://images.unsplash.com/photo-1474919873299-794654e6f5fa?w=800&h=400&fit=crop", // Wine barrels
  "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=800&h=400&fit=crop", // Hilltop vineyard
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=400&fit=crop", // Wine bottles
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop", // Italian countryside
  "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&h=400&fit=crop"  // Wine tasting
];