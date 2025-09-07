import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Sparkles, 
  Wine, 
  MapPin, 
  Star,
  ChevronRight,
  Heart 
} from "lucide-react";

export default function PersonalizedRecommendations({ user, wines }) {
  if (!user?.taste_profile) return null;

  // Filter wines based on user preferences
  const recommendedWines = wines.filter(wine => {
    const profile = user.taste_profile;
    
    // Match wine type preferences
    if (profile.preferred_types?.length > 0) {
      if (!profile.preferred_types.includes(wine.type)) {
        return false;
      }
    }
    
    // Match region preferences
    if (profile.preferred_regions?.length > 0) {
      if (!profile.preferred_regions.includes(wine.region)) {
        return false;
      }
    }
    
    // Match price range
    if (profile.price_range_min && wine.price < profile.price_range_min) {
      return false;
    }
    if (profile.price_range_max && wine.price > profile.price_range_max) {
      return false;
    }
    
    // Match bio preference
    if (profile.bio_preference && !wine.is_bio) {
      return false;
    }
    
    return true;
  }).slice(0, 4);

  if (recommendedWines.length === 0) return null;

  return (
    <section className="space-y-8 bg-gradient-to-r from-amber-50 to-red-50 rounded-3xl p-8 md:p-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-amber-600" />
          <Badge className="bg-amber-600 text-white border-0 px-4 py-2 text-sm">
            Per Te
          </Badge>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Raccomandazioni Personalizzate
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Basate sul tuo profilo gustativo, abbiamo selezionato questi vini perfetti per te.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedWines.map((wine) => (
          <Card key={wine.id} className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm">
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-red-100 to-amber-100 flex items-center justify-center">
                {wine.image_url ? (
                  <img 
                    src={wine.image_url} 
                    alt={wine.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-5xl">🍷</div>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                  <Heart className="w-4 h-4 text-red-600" />
                </button>
              </div>
              <div className="absolute top-3 left-3">
                <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                  <span className="text-xs font-semibold">Per te</span>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-red-800 transition-colors">
                  {wine.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{wine.winery_name}</p>
                <div className="flex items-center text-gray-500 text-xs mb-3">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{wine.region}</span>
                  {wine.vintage && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{wine.vintage}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-red-800">
                  €{wine.price}
                </div>
                <Link to={createPageUrl(`Wine?id=${wine.id}`)}>
                  <Button size="sm" className="bg-red-800 hover:bg-red-900 text-white rounded-full px-4">
                    Dettagli
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link to={createPageUrl("Wines")}>
          <Button size="lg" className="bg-red-800 hover:bg-red-900 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            Esplora Altri Vini per Te
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}