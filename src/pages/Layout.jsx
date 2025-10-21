

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Wine, Compass, Calendar, Gift, User, Heart, Grape, Map, LayoutDashboard, Building } from "lucide-react"; // Added Building icon
import { UserProvider } from ".../components/auth/UserContext";
import AdminDropdown from "../components/layout/AdminDropdown";
import { CartProvider } from "../components/cart/CartContext";
import CartTrigger from "../components/cart/CartTrigger";
import CartFlyout from "../components/cart/CartFlyout";
import CookieConsentBanner from "../components/layout/CookieConsentBanner";

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();

  // Layout pulito per onboarding/splash
  if (currentPageName === "Onboarding" || currentPageName === "SplashScreen") {
    return <div className="min-h-screen">{children}</div>;
  }

  // Menu base per tutti (utenti pubblici)
  const navigationItems = [
    { title: "Scopri", url: createPageUrl("Discover"), icon: Compass },
    { title: "Vini", url: createPageUrl("Wines"), icon: Wine },
    { title: "Cantine", url: createPageUrl("Wineries"), icon: Grape },
    { title: "Mappa", url: createPageUrl("WineriesMap"), icon: Map },
    { title: "Box", url: createPageUrl("TastingBoxes"), icon: Gift },
    { title: "Eventi", url: createPageUrl("Events"), icon: Calendar },
  ];

  // Nuovo menu item per accesso cantine (visibile a tutti)
  const wineryAccessItem = { title: "Area Cantine", url: createPageUrl("WineryLogin"), icon: Building };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30">
      {/* Header pubblico standard */}
      <header className="backdrop-blur-sm border-b border-stone-200/50 sticky top-0 z-50 bg-white/95 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3c6f67c95_LG2.jpg" 
                alt="CantinaNova" 
                className="h-10 w-auto" 
              />
            </Link>

            {/* Desktop Navigation - SOLO menu pubblico */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.url
                      ? 'text-red-800 bg-red-50'
                      : 'text-gray-600 hover:text-red-700 hover:bg-red-50/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
              
              {/* Separatore e link Area Cantine */}
              <div className="h-6 w-px bg-gray-300"></div>
              <Link
                to={wineryAccessItem.url}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === wineryAccessItem.url
                    ? 'text-green-800 bg-green-50'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50/50'
                }`}
              >
                <wineryAccessItem.icon className="w-4 h-4" />
                <span>{wineryAccessItem.title}</span>
              </Link>
            </nav>

            {/* User Menu Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <CartTrigger />
              <AdminDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - SOLO menu pubblico */}
      <nav className="md:hidden border-t fixed bottom-0 left-0 right-0 z-50 bg-white border-stone-200">
        <div className="flex justify-around items-center py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center py-2 px-2 transition-all duration-200 ${
                location.pathname === item.url
                  ? 'text-red-800'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          ))}
          <Link
            to={createPageUrl("Profile")}
            className={`flex flex-col items-center py-2 px-2 transition-all duration-200 ${
              location.pathname === createPageUrl("Profile")
                ? 'text-red-800'
                : 'text-gray-500'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Profilo</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      
      <CartFlyout />
      <CookieConsentBanner />
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <UserProvider>
      <CartProvider>
        <LayoutContent children={children} currentPageName={currentPageName} />
      </CartProvider>
    </UserProvider>
  );
}

