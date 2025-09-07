
import React, { useState, useEffect } from "react";
import { Wine, Winery, TastingBox, Event, User, HomePageContent } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Wine as WineIcon, 
  MapPin, 
  Star, 
  TrendingUp, 
  Calendar,
  Gift,
  Sparkles,
  ChevronRight,
  Heart,
  Building,
  Users,
  Zap,
  Trophy,
  ArrowRight,
  Loader2
} from "lucide-react";

import HeroSection from "../components/home/HeroSection";
import FeaturedWineries from "../components/home/FeaturedWineries";
import TastingBoxes from "../components/home/TastingBoxes";
import UpcomingEvents from "../components/home/UpcomingEvents";
import PersonalizedRecommendations from "../components/home/PersonalizedRecommendations";

export default function Home() {
  const [user, setUser] = useState(null);
  const [wineries, setWineries] = useState([]);
  const [wines, setWines] = useState([]);
  const [tastingBoxes, setTastingBoxes] = useState([]);
  const [events, setEvents] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const pageContentData = await HomePageContent.list().then(data => (data.length > 0 ? data[0] : null));
      setPageContent(pageContentData);

      // Carica i dati in vetrina basandosi sugli ID salvati, con fallback
      const wineriesPromise = pageContentData?.featured_wineries?.length > 0
        ? Winery.filter({ 'id': { '$in': pageContentData.featured_wineries } })
        : Winery.list('-created_date', 6);
      
      const winesPromise = pageContentData?.featured_wines?.length > 0
        ? Wine.filter({ 'id': { '$in': pageContentData.featured_wines } })
        : Wine.filter({ is_featured: true }, '-created_date', 8);

      const tastingBoxesPromise = pageContentData?.featured_tasting_boxes?.length > 0
        ? TastingBox.filter({ 'id': { '$in': pageContentData.featured_tasting_boxes } })
        : TastingBox.list('-created_date', 2);
        
      const eventsPromise = pageContentData?.featured_events?.length > 0
        ? Event.filter({ 'id': { '$in': pageContentData.featured_events } })
        : Event.filter({ status: 'aperto' }, 'date', 4);

      const [wineriesData, winesData, tastingBoxesData, eventsData] = await Promise.all([
        wineriesPromise,
        winesPromise,
        tastingBoxesPromise,
        eventsPromise
      ]);

      setWineries(wineriesData);
      setWines(winesData);
      setTastingBoxes(tastingBoxesData);
      setEvents(eventsData);

      // Poi prova a caricare i dati utente (opzionale)
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (userError) {
        console.log("User not logged in - showing public content");
        setUser(null);
      }
      
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };
  
  if (isLoading || !pageContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-red-700"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {/* Hero Section */}
        <HeroSection user={user} content={pageContent} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          {/* Featured Wineries */}
          <FeaturedWineries wineries={wineries} isLoading={isLoading} />

          {/* Personalized Recommendations */}
          {user?.completed_onboarding && (
            <PersonalizedRecommendations user={user} wines={wines} />
          )}

          {/* Tasting Boxes */}
          <TastingBoxes tastingBoxes={tastingBoxes} isLoading={isLoading} />

          {/* Upcoming Events */}
          <UpcomingEvents events={events} isLoading={isLoading} />

          {/* Stats Section */}
          <section className="bg-gradient-to-r from-red-800 to-red-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{pageContent?.stats_title || 'La Nostra Rete'}</h2>
                <p className="text-red-100 text-lg">{pageContent?.stats_subtitle || 'Una comunità in crescita di innovatori del vino.'}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-amber-200">{pageContent?.stats_wineries_count || '150+'}</div>
                  <p className="text-red-100">Cantine Registrate</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-amber-200">{pageContent?.stats_wines_count || '500+'}</div>
                  <p className="text-red-100">Etichette Uniche</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-amber-200">{pageContent?.stats_regions_count || '20'}</div>
                  <p className="text-red-100">Regioni Coperte</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center py-16 px-4 bg-gradient-to-br from-amber-50 to-red-50 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-50">
              <div className="absolute top-10 left-10 w-8 h-8 bg-amber-200 rounded-full opacity-20"></div>
              <div className="absolute top-20 right-20 w-6 h-6 bg-red-200 rounded-full opacity-20"></div>
              <div className="absolute bottom-10 left-1/3 w-4 h-4 bg-yellow-200 rounded-full opacity-20"></div>
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-8">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {pageContent?.cta_title || 'Sei una Cantina Emergente?'}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {pageContent?.cta_text || 'Unisciti alla nostra piattaforma per raggiungere nuovi appassionati, raccontare la tua storia e vendere i tuoi vini direttamente. Iscrizione semplice e gratuita.'}
              </p>
              <Link to={createPageUrl("Onboarding")}>
                <Button
                  size="lg"
                  className="bg-red-800 hover:bg-red-900 text-white px-12 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Building className="mr-3 w-6 h-6" />
                  {pageContent?.cta_button_text || 'Registra la Tua Cantina'}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                ⚡ Setup in 5 minuti • 🆓 Completamente gratuito • 🚀 Piano PRO disponibile dal 2026
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
