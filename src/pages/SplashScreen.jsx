import React, { useState, useEffect } from "react";
import { Media } from "@/api/entities";
import { Wine } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function SplashScreen() {
  const [splashVideoUrl, setSplashVideoUrl] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Carica il video splash dal database
    const loadSplashVideo = async () => {
      try {
        const splashVideos = await Media.filter({ usage_location: "splash_screen", is_active: true }, "-created_date", 1);
        if (splashVideos.length > 0) {
          setSplashVideoUrl(splashVideos[0].file_url);
        }
      } catch (error) {
        console.error("Error loading splash video:", error);
      }
    };
    loadSplashVideo();

    // Timer per nascondere lo splash dopo 3 secondi
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Reindirizza alla home
      window.location.href = createPageUrl("Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      {splashVideoUrl && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={splashVideoUrl}
          autoPlay
          muted
          loop={false}
          playsInline
        >
          Il tuo browser non supporta il tag video.
        </video>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Logo al centro */}
      <div className="relative z-10 text-center text-white">
        <div className="w-24 h-24 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
          <Wine className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide">
          CantinaNova
        </h1>
        <p className="text-lg md:text-xl text-red-100 mt-4 opacity-90">
          Scopri il futuro del vino
        </p>
      </div>
    </div>
  );
}