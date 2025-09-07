import { cityCoordinates, regionCoordinates } from './WineryImageDataset';

// Funzione per calcolare la distanza tra due punti geografici (formula Haversine)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raggio della Terra in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Funzione per ottenere coordinate precise di una cantina
export const getWineryCoordinates = (winery) => {
  // Controllo di sicurezza per l'oggetto winery
  if (!winery || typeof winery !== 'object') {
    return { lat: 41.9, lng: 12.5 }; // Fallback Italia centrale
  }

  const { sub_region, region, name } = winery;

  // 1. Prova a trovare una città/zona esatta dalla sub_region
  if (sub_region && typeof sub_region === 'string') {
    try {
      const subRegionLower = sub_region.toLowerCase().replace(/ \(.+\)/, ''); // Rimuove "(XX)"
      if (cityCoordinates && typeof cityCoordinates === 'object') {
        for (const [city, coords] of Object.entries(cityCoordinates)) {
          if (city && coords && subRegionLower.includes(city.toLowerCase())) {
            return coords;
          }
        }
      }
    } catch (error) {
      console.warn('Error processing sub_region:', error);
    }
  }

  // 2. Se non trova, prova a cercare nel nome della cantina
  if (name && typeof name === 'string') {
    try {
      const nameLower = name.toLowerCase();
      if (cityCoordinates && typeof cityCoordinates === 'object') {
        for (const [city, coords] of Object.entries(cityCoordinates)) {
          if (city && coords && nameLower.includes(city.toLowerCase())) {
            return coords;
          }
        }
      }
    } catch (error) {
      console.warn('Error processing winery name:', error);
    }
  }

  // 3. Fallback alle coordinate generiche della regione
  if (region && typeof region === 'string' && regionCoordinates && regionCoordinates[region]) {
    return regionCoordinates[region];
  }
  
  // 4. Ultimo fallback a un punto centrale in Italia
  return { lat: 41.9, lng: 12.5 };
};

// Aggiunge variazione casuale per evitare sovrapposizioni
export const addRandomOffset = (coords, maxOffset = 0.05) => {
    if (!coords || typeof coords !== 'object' || coords.lat === undefined || coords.lng === undefined) {
        return { lat: 41.9, lng: 12.5 }; // Fallback sicuro
    }
    return {
        lat: coords.lat + (Math.random() - 0.5) * maxOffset,
        lng: coords.lng + (Math.random() - 0.5) * maxOffset
    };
};

// Export come default per compatibilità
export default { calculateDistance, getWineryCoordinates, addRandomOffset };