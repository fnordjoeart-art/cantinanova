import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, ShoppingCart } from "lucide-react";
import { useCart } from '../cart/CartContext';

export default function WineCard({ wine }) {
  const { addToCart } = useCart();

  const getWineTypeColor = (type) => {
    const colors = {
      'rosso': 'bg-red-100 text-red-800',
      'bianco': 'bg-yellow-100 text-yellow-800',
      'rosé': 'bg-pink-100 text-pink-800',
      'spumante': 'bg-blue-100 text-blue-800',
      'dolce': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };
  
  const handleAddToCart = (e) => {
    e.preventDefault(); // Impedisce la navigazione quando si clicca il bottone
    e.stopPropagation();
    addToCart(wine);
  };

  return (
    <Card className="h-full group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-stone-200/80 flex flex-col">
      <Link to={createPageUrl(`WineDetails?id=${wine.id}`)} className="block">
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-red-100 to-amber-100 flex items-center justify-center">
            {wine.image_url ? (
              <img 
                src={wine.image_url} 
                alt={wine.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="text-5xl opacity-60">🍷</div>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge className={getWineTypeColor(wine.type)}>
              {wine.type}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3 flex-grow">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-red-800 transition-colors">
              {wine.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2 truncate">{wine.winery_name}</p>
            <div className="flex items-center text-gray-500 text-xs mb-3">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{wine.region}</span>
              {wine.vintage && (
                <>
                  <span className="mx-2">•</span>
                  <span>{wine.vintage}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      
      <div className="p-4 pt-0 mt-auto">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-red-800">
            €{wine.price.toFixed(2)}
          </div>
          <Button size="sm" className="bg-red-800 hover:bg-red-900" onClick={handleAddToCart}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Aggiungi
          </Button>
        </div>
      </div>
    </Card>
  );
}