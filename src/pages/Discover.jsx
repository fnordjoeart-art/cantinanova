import React, { useState, useEffect, useCallback } from "react";
import { Winery } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Compass, 
  MapPin, 
  Navigation,
  Loader2,
  AlertTriangle,
  LocateFixed
} from "lucide-react";
import { calculateDistance, getWineryCoordinates } from "../components/utils/geolocation";

export default function DiscoverPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyWineries, setNearbyWineries] = useState([]);
  const [allWineries, setAllWineries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carica tutte le cantine all'avvio
    Winery.list().then(data => setAllWineries(data));
    
    // Ottieni la posizione dell'utente
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          setError("Impossibile accedere alla tua posizione. Assicurati di aver concesso i permessi al browser.");
          setLoading(false);
        }
      );
    } else {
      setError("La geolocalizzazione non è supportata da questo browser.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLocation && allWineries.length > 0) {
      const wineriesWithDistances = allWineries
        .map(winery => {
          const wineryCoords = getWineryCoordinates(winery);
          if (!wineryCoords) return null; 
          
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            wineryCoords.lat,
            wineryCoords.lng
          );
          
          return { ...winery, distance, coordinates: wineryCoords };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);
        
      setNearbyWineries(wineriesWithDistances.slice(0, 20));
      setLoading(false);
    }
  }, [userLocation, allWineries]);

  const handleGetDirections = (winery) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${winery.coordinates.lat},${winery.coordinates.lng}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-800 mb-4" />
        <h2 className="text-xl font-semibold">Trovando la tua posizione...</h2>
        <p className="text-gray-600">Stiamo cercando le cantine più vicine a te.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold">Errore di Geolocalizzazione</h2>
        <p className="text-gray-600 max-w-md mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          <LocateFixed className="w-4 h-4 mr-2" />
          Riprova
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30">
      <header className="bg-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Compass className="w-6 h-6 text-amber-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Scopri le Cantine Vicino a Te
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Abbiamo trovato {nearbyWineries.length} cantine nelle tue vicinanze.
          </p>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyWineries.map((winery) => (
            <Card 
              key={winery.id} 
              className="hover:shadow-lg hover:border-red-300 transition-all"
            >
              <CardContent className="p-4 flex items-start space-x-4">
                <div className="text-3xl mt-1">🍷</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{winery.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {winery.sub_region || winery.region}
                  </p>
                  <p className="text-sm font-bold text-red-800 mt-1">
                    a {winery.distance.toFixed(1)} km da te
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleGetDirections(winery)}
                      className="bg-red-800 hover:bg-red-900 text-white rounded-full px-4"
                    >
                      <Navigation className="w-3 h-3 mr-2" />
                      Indicazioni
                    </Button>
                    <Link to={createPageUrl(`WineryDetails?id=${winery.id}`)}>
                      <Button size="sm" variant="outline" className="rounded-full px-4">
                        Dettagli
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}