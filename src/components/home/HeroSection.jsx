
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import {
  Wine,
  MapPin,
  Star,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function HeroSection({ user, content }) {
  const [heroVideoUrl, setHeroVideoUrl] = useState(content?.hero_video_url || "");
  const [showVideoOverlay, setShowVideoOverlay] = useState(true);

  // Effect to update video URL when content prop changes
  useEffect(() => {
    setHeroVideoUrl(content?.hero_video_url || "");
  }, [content]);

  // Effect for the transition overlay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideoOverlay(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      if (!user.completed_onboarding) {
        window.location.href = createPageUrl("Onboarding");
      } else {
        window.location.href = createPageUrl("Wines");
      }
    } else {
      window.location.href = createPageUrl("Onboarding");
    }
  };

  const isYouTube = (heroVideoUrl || "").includes("youtube.com") || (heroVideoUrl || "").includes("youtu.be");

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30">
      {/* Video Section - Box Separato */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-b-3xl shadow-2xl">
        {/* Video Container - this holds the video and the transition overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-amber-900">
          {heroVideoUrl ? (
            isYouTube ? (
              <iframe
                className="absolute inset-0 w-full h-full object-cover"
                src={heroVideoUrl}
                title="Vineyard Drone Footage"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                key={heroVideoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                src={heroVideoUrl}
                autoPlay
                muted
                loop
                playsInline
              >
                Il tuo browser non supporta il tag video.
              </video>
            )
          ) : (
             <div className="w-full h-full bg-gradient-to-br from-red-800 to-amber-900"></div>
          )}

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Overlay di transizione */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-amber-900 transition-opacity duration-2000 ease-out flex items-center justify-center ${
              showVideoOverlay ? 'opacity-90' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Wine className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">CantinaNova</h2>
              <p className="text-lg opacity-80">Caricamento...</p>
            </div>
          </div>
        </div> {/* Correctly closing the Video container div */}

        {/* Titolo Sovrapposto al Video */}
        <div
          className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-1500 delay-500 ${
            showVideoOverlay ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="text-center text-white px-4">
            <Badge className="bg-amber-600/20 text-amber-200 border-amber-400/30 px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              {content?.hero_badge_text || 'Le Migliori Startup'}
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
                dangerouslySetInnerHTML={{ __html: (content?.hero_title || 'Benvenuto su CantinaNova').replace(/\n/g, '<br />') }}>
            </h1>
          </div>
        </div>
      </div>

      {/* Contenuto sotto il video */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {content?.hero_title || 'Scopri le cantine emergenti'}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          {content?.hero_subtitle || 'La tua guida nel mondo del vino italiano. Unisciti a noi per scoprire i tesori nascosti delle cantine emergenti.'}
        </p>
        <Button
          size="lg"
          onClick={handleGetStarted}
          className="bg-red-800 hover:bg-red-900 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {content?.hero_button_text || 'Inizia a Scoprire'}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
