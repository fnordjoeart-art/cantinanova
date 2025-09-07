
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/api/entities"; // Ensure this import is still valid and used if User type is needed
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wine,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Sparkles,
  MapPin,
  Heart,
  DollarSign,
  Leaf,
  Mail,
  Facebook,
  Building,
  Users,
  ArrowLeft
} from "lucide-react";

const wineTypes = [
  "Rosso", "Bianco", "Rosato", "Spumante", "Passito", "Novello"
];

const regions = [
  "Piemonte", "Lombardia", "Trentino-Alto Adige", "Veneto", "Friuli-Venezia Giulia", "Liguria",
  "Emilia-Romagna", "Toscana", "Umbria", "Marche", "Lazio", "Abruzzo", "Molise", "Campania",
  "Puglia", "Basilicata", "Calabria", "Sicilia", "Sardegna", "Valle d'Aosta"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'consumer' or 'winery'

  // Placeholder for useEffect logic (e.g., fetching user data or checking auth state)
  // This would typically involve an authentication service or a context
  useEffect(() => {
    // Simulate checking if a user is logged in
    const loggedInUser = localStorage.getItem('mockUser'); // Example
    if (loggedInUser) {
      // Ensure the mock user has a userType property for profile completion logic
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      // If the user is logged in, and userType is not set (e.g., fresh load after login simulation)
      // you might want to set the userType state based on the logged-in user's type
      if (parsedUser.userType) {
        setUserType(parsedUser.userType);
      }
    }
  }, []);

  // Renamed for consistency with new userType values, though not directly used by UI buttons
  const handleLoginAsWinery = () => {
    console.log("Login as Winery clicked");
    setUserType('winery');
    // For now, simulate login:
    // setUser({ id: '123', email: 'winery@example.com', profileComplete: false, userType: 'winery' });
  };

  // Renamed for consistency with new userType values, though not directly used by UI buttons
  const handleLoginAsConsumer = () => {
    console.log("Login as Consumer clicked");
    setUserType('consumer');
    // For now, simulate login:
    // setUser({ id: '456', email: 'consumer@example.com', profileComplete: false, userType: 'consumer' });
  };

  const handleCompleteProfile = () => {
    // Simulate profile completion
    if (user) {
      // Ensure userType is part of the user object when completing profile
      const updatedUser = { ...user, profileComplete: true, userType: user.userType || userType };
      setUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      // Redirect to dashboard or home page
      navigate(createPageUrl("dashboard")); // Example navigation
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Pulsante Torna alla Home sempre visibile */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Home"))}
          className="absolute top-6 left-6 text-white/80 hover:text-white hover:bg-white/10 z-20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla Home
        </Button>

        {/* Background pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="1.5" fill="rgba(255,255,255,0.1)" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>
        </div>

        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl relative z-10">
          <CardHeader className="text-center pb-8 relative">
            {userType && (
                <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-500 hover:text-gray-800" onClick={() => setUserType(null)}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
            )}
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3c6f67c95_LG2.jpg"
              alt="CantinaNova Logo"
              className="mx-auto mb-6 h-20 w-auto"
            />
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Benvenuto in CantinaNova
            </CardTitle>
            <p className="text-gray-600 leading-relaxed">
              Scegli come vuoi accedere alla piattaforma
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!userType ? (
              // Modale con due TAB per la scelta
              <div className="space-y-4">
                <Button
                  className="w-full py-6 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center justify-center space-x-3 transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => setUserType('consumer')} // Changed userType to 'consumer'
                >
                  <Users className="w-6 h-6" />
                  <span>Sono un Appassionato</span>
                </Button>
                <Button
                  className="w-full py-6 text-lg font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-lg flex items-center justify-center space-x-3 transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => setUserType('winery')} // Changed userType to 'winery'
                >
                  <Building className="w-6 h-6" />
                  <span>Sono una Cantina</span>
                </Button>
              </div>
            ) : (
              // Pulsante login quando il tipo è selezionato
              <div className="space-y-4">
                <div className="text-center text-gray-700 text-lg font-medium">
                    Continua come {userType === 'winery' ? 'Cantina' : 'Appassionato'} {/* Updated conditional text */}
                </div>
                <Button
                  className="w-full py-6 text-lg font-semibold bg-red-700 hover:bg-red-800 text-white shadow-lg flex items-center justify-center space-x-3"
                  onClick={() => console.log('Login logic here')} // Replace with actual login/signup flow
                >
                  <Mail className="w-6 h-6" />
                  <span>Accedi con Email</span>
                </Button>
                <Button
                  className="w-full py-6 text-lg font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow-lg flex items-center justify-center space-x-3"
                  onClick={() => console.log('Facebook login logic here')} // Replace with actual Facebook login flow
                >
                  <Facebook className="w-6 h-6" />
                  <span>Accedi con Facebook</span>
                </Button>
                <Separator />
                <p className="text-sm text-gray-500 text-center">
                  Non hai un account? <a href="#" className="text-red-700 hover:underline font-semibold">Registrati</a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se l'utente è loggato, mostra la sezione per completare il profilo
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Completa il tuo profilo
          </CardTitle>
          <p className="text-gray-600">
            Per offrirti la migliore esperienza, abbiamo bisogno di alcune informazioni.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Example fields for a winery */}
          {user.userType === 'winery' && ( // Updated userType check
            <div className="space-y-4">
              <div>
                <Label htmlFor="wineryName">Nome Cantina</Label>
                <Input id="wineryName" placeholder="La Vigna del Cuore" />
              </div>
              <div>
                <Label htmlFor="address">Indirizzo</Label>
                <Input id="address" placeholder="Via Roma, 10" />
              </div>
              <div>
                <Label htmlFor="region">Regione</Label>
                <Input id="region" placeholder="Toscana" />
              </div>
              <div>
                <Label htmlFor="description">Descrizione</Label>
                <textarea
                  id="description"
                  rows="4"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Raccontaci della tua cantina e dei tuoi vini..."
                ></textarea>
              </div>
              <div className="space-y-2">
                <Label>Tipi di vino prodotti</Label>
                <div className="flex flex-wrap gap-2">
                  {wineTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Example fields for a consumer */}
          {user.userType === 'consumer' && ( // Updated userType check
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" placeholder="Mario" />
              </div>
              <div>
                <Label htmlFor="lastName">Cognome</Label>
                <Input id="lastName" placeholder="Rossi" />
              </div>
              <div className="space-y-2">
                <Label>Regioni di interesse</Label>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <Badge key={region} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                      <MapPin className="w-4 h-4 mr-1" />
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vini preferiti</Label>
                <div className="flex flex-wrap gap-2">
                  {wineTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                      <Wine className="w-4 h-4 mr-1" />
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full py-3 text-lg font-semibold bg-red-700 hover:bg-red-800 text-white shadow-lg"
            onClick={handleCompleteProfile}
          >
            Completa e Inizia! <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
