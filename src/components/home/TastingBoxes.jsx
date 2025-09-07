import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, ChevronRight, Clock, Percent } from "lucide-react";

const TastingBoxCard = ({ box }) => (
  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-amber-50/50">
    <div className="relative">
      <div className="h-64 bg-gradient-to-br from-red-100 via-amber-50 to-red-100 flex items-center justify-center relative overflow-hidden">
        {box.image_url ? (
          <img 
            src={box.image_url} 
            alt={box.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-8xl">🎁</div>
        )}
        
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <Badge className="bg-red-800 text-white border-0 shadow-lg">
            {box.bottles_count} Bottiglie
          </Badge>
          {box.is_limited && (
            <Badge className="bg-amber-600 text-white border-0 shadow-lg">
              <Clock className="w-3 h-3 mr-1" />
              Limitato
            </Badge>
          )}
        </div>
        
        <div className="absolute top-4 right-4">
          <div className="bg-green-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
            <Percent className="w-3 h-3 mr-1" />
            <span>Risparmi {Math.round(((box.regular_price - box.discounted_price) / box.regular_price) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <CardContent className="p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-800 transition-colors line-clamp-2">
          {box.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {box.description}
        </p>
        
        {box.theme && (
          <Badge variant="secondary" className="mb-3">
            {box.theme}
          </Badge>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-red-800">€{box.discounted_price.toFixed(2)}</span>
              <span className="text-lg text-gray-400 line-through">€{box.regular_price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-green-600 font-semibold">
              Risparmi €{(box.regular_price - box.discounted_price).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      <Link to={createPageUrl(`TastingBoxDetails?id=${box.id}`)}>
        <Button className="w-full bg-red-800 hover:bg-red-900 text-white rounded-full py-3 shadow-lg hover:shadow-xl transition-all duration-300 group">
          Scopri il Box
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export default function TastingBoxes({ tastingBoxes, isLoading }) {
  // Mostra solo i primi 2 box
  const displayedBoxes = tastingBoxes.slice(0, 2);

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Gift className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Box Degustazione
            </h2>
          </div>
          <p className="text-gray-600">
            Selezioni curate per esplorare nuovi sapori
          </p>
        </div>
        <Link to={createPageUrl("TastingBoxes")}>
          <Button variant="outline" className="hidden sm:flex text-red-700 border-red-200 hover:bg-red-50">
            Tutti i Box Degustazione
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        {isLoading ? (
          Array(2).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          displayedBoxes.map(box => (
            <TastingBoxCard key={box.id} box={box} />
          ))
        )}
      </div>
      
      {/* Link mobile per vedere tutti i box */}
      <div className="text-center sm:hidden">
        <Link to={createPageUrl("TastingBoxes")}>
          <Button variant="outline" className="text-red-700 border-red-200 hover:bg-red-50 px-8">
            Vedi Tutti i Box Degustazione
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}