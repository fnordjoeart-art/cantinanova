import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Controlla se l'utente ha già accettato i cookie
    const hasConsented = localStorage.getItem('cookie_consent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-6 md:right-6">
      <Card className="bg-white shadow-2xl border-2 border-gray-200 p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Cookie className="w-6 h-6 text-amber-600 mt-1" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Utilizziamo i Cookie
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Questo sito utilizza cookie per migliorare la tua esperienza di navigazione, 
              analizzare il traffico e personalizzare i contenuti. Continuando a navigare 
              acconsenti all'uso dei cookie.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2 text-xs">
                <Link 
                  to={createPageUrl("PrivacyPolicy")} 
                  className="text-red-700 hover:text-red-800 flex items-center"
                >
                  Privacy Policy <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  to={createPageUrl("TermsOfService")} 
                  className="text-red-700 hover:text-red-800 flex items-center"
                >
                  Termini di Servizio <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReject}
                  className="text-gray-600 hover:text-gray-700"
                >
                  Rifiuta
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAccept}
                  className="bg-red-800 hover:bg-red-900 text-white"
                >
                  Accetta Cookie
                </Button>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowBanner(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </Card>
    </div>
  );
}