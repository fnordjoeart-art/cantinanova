import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Wine } from "@/api/entities";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useCart } from "../components/cart/CartContext";
import { 
  MapPin, 
  Calendar, 
  Grape, 
  Percent, 
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Share2,
  Award
} from "lucide-react";

export default function WineDetails() {
  const [searchParams] = useSearchParams();
  const wineId = searchParams.get('id');
  const [wine, setWine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (wineId) {
      Wine.filter({ id: wineId })
        .then(wines => {
          if (wines.length > 0) {
            setWine(wines[0]);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [wineId]);

  const handleAddToCart = () => {
    if (wine) {
      addToCart(wine, quantity);
    }
  };

  const getWineTypeColor = (type) => {
    const colors = {
      'rosso': 'bg-red-100 text-red-800 border-red-200',
      'bianco': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'rosé': 'bg-pink-100 text-pink-800 border-pink-200',
      'spumante': 'bg-blue-100 text-blue-800 border-blue-200',
      'dolce': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!wine) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Vino non trovato</h1>
        <Link to={createPageUrl("Wines")}>
          <Button>Torna al catalogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Immagine del vino */}
        <div className="space-y-4">
          <div className="relative bg-gradient-to-br from-red-50 to-amber-50 rounded-3xl p-8 h-96 flex items-center justify-center">
            {wine.image_url ? (
              <img 
                src={wine.image_url} 
                alt={wine.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-8xl opacity-50">🍷</div>
            )}
          </div>
          
          {/* Galleria aggiuntiva se presente */}
          {wine.galleria && wine.galleria.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {wine.galleria.slice(0, 4).map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`${wine.name} ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 hover:border-red-400 cursor-pointer transition-colors"
                />
              ))}
            </div>
          )}
        </div>

        {/* Dettagli del vino */}
        <div className="space-y-6">
          <div>
            <Badge className={getWineTypeColor(wine.type)}>
              {wine.type}
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mt-3 mb-2">
              {wine.name}
            </h1>
            <Link 
              to={createPageUrl(`WineryDetails?id=${wine.winery_id}`)}
              className="text-lg text-red-700 hover:text-red-800 font-medium hover:underline"
            >
              {wine.winery_name}
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{wine.region}</span>
            </div>
            {wine.vintage && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{wine.vintage}</span>
              </div>
            )}
            {wine.alcohol_content && (
              <div className="flex items-center">
                <Percent className="w-4 h-4 mr-2" />
                <span>{wine.alcohol_content}% vol.</span>
              </div>
            )}
          </div>

          {/* Vitigni */}
          {wine.grape_varieties && wine.grape_varieties.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Grape className="w-4 h-4 mr-2" />
                Vitigni
              </h3>
              <div className="flex flex-wrap gap-2">
                {wine.grape_varieties.map((grape, index) => (
                  <Badge key={index} variant="outline">{grape}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Denominazione */}
          {wine.denominazione && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Denominazione
              </h3>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                {wine.denominazione}
              </Badge>
            </div>
          )}

          {/* Note di degustazione */}
          {wine.tasting_notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Note di Degustazione</h3>
              <p className="text-gray-700 leading-relaxed">{wine.tasting_notes}</p>
            </div>
          )}

          {/* Prezzo e acquisto */}
          <Card className="bg-gradient-to-r from-red-50 to-amber-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">Prezzo per bottiglia</p>
                  <p className="text-3xl font-bold text-red-800">€{wine.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold px-3">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  size="lg" 
                  className="flex-1 bg-red-800 hover:bg-red-900 text-white"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  Aggiungi al Carrello - €{(wine.price * quantity).toFixed(2)}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Spedizione info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 text-sm">
              <span className="font-semibold">✓ Spedizione gratuita</span> per ordini superiori a €50
            </p>
            <p className="text-green-700 text-sm mt-1">
              Consegna in 2-3 giorni lavorativi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}