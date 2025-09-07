
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, Award, ChevronRight, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedWineries({ wineries, isLoading }) {
  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-amber-600" />
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 text-sm">
            In Evidenza
          </Badge>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Cantine Emergenti da Scoprire
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Incontra i giovani produttori che stanno rivoluzionando il panorama vinicolo italiano con passione e innovazione.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wineries.map((winery) => (
          <Card key={winery.id} className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
            <div className="relative overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-red-100 to-amber-100 flex items-center justify-center">
                {winery.cover_image_url ? (
                  <img 
                    src={winery.cover_image_url} 
                    alt={winery.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-6xl text-red-200">🍷</div>
                )}
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-800 text-white border-0">
                  Startup
                </Badge>
              </div>
              {winery.certifications?.includes("Bio") && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white border-0">
                    <Award className="w-3 h-3 mr-1" />
                    Bio
                  </Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-800 transition-colors">
                  {winery.name}
                </h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{winery.region}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {winery.story || "Una cantina emergente che rappresenta l'innovazione nel settore vinicolo italiano."}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {winery.established_year && (
                    <span>Dal {winery.established_year}</span>
                  )}
                </div>
                <Link to={createPageUrl(`WineryDetails?id=${winery.id}`)}>
                  <Button variant="ghost" size="sm" className="text-red-700 hover:text-red-800 hover:bg-red-50 group">
                    Scopri
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link to={createPageUrl("Wineries")}>
          <Button size="lg" variant="outline" className="border-red-200 text-red-800 hover:bg-red-50 px-8 py-3 rounded-full">
            Esplora Tutte le Cantine
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
