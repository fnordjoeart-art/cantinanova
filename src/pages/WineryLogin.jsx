
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, ArrowLeft, LogIn, UserPlus, Eye } from "lucide-react";
import { useUser } from "../components/auth/UserContext";

export default function WineryLogin() {
  const navigate = useNavigate();
  const { enableWineryDemo } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    winery_name: "",
    region: "",
    contact_name: "",
    phone: ""
  });

  const italianRegions = [
    "Piemonte", "Lombardia", "Veneto", "Trentino-Alto Adige", "Friuli-Venezia Giulia",
    "Liguria", "Emilia-Romagna", "Toscana", "Umbria", "Marche", "Lazio", "Abruzzo",
    "Molise", "Campania", "Puglia", "Basilicata", "Calabria", "Sicilia", "Sardegna"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Qui andrà la logica di login/registrazione reale
    console.log("Form submitted:", formData);
    // Simula login reale per cantina
    enableWineryDemo(); // Usa ancora la demo finché non abbiamo il login reale
    navigate(createPageUrl("WineryDashboard"));
  };

  const handleDemoAccess = () => {
    // Attiva la modalità demo cantina
    enableWineryDemo(); // Activate demo mode for demo access
    console.log("Demo access granted");
    navigate(createPageUrl("WineryDashboard"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      {/* Pulsante Torna alla Home */}
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Home"))}
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 hover:bg-white/50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Torna alla Home
      </Button>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? "Accesso Cantine" : "Registrazione Cantina"}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin ? "Accedi al tuo pannello di gestione" : "Unisciti alla nostra rete di cantine"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Form Login/Registrazione */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campi comuni */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="info@tuacantina.it"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Campi aggiuntivi per registrazione */}
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="winery_name">Nome Cantina</Label>
                  <Input
                    id="winery_name"
                    value={formData.winery_name}
                    onChange={(e) => setFormData({...formData, winery_name: e.target.value})}
                    placeholder="Cantina del Borgo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Regione</Label>
                  <Select 
                    value={formData.region}
                    onValueChange={(value) => setFormData({...formData, region: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona regione" />
                    </SelectTrigger>
                    <SelectContent>
                      {italianRegions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_name">Nome Referente</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                    placeholder="Mario Rossi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+39 123 456 7890"
                    required
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3"
            >
              {isLogin ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Accedi
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrati
                </>
              )}
            </Button>
          </form>

          {/* Toggle Login/Registrazione */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-green-700 hover:text-green-800 hover:underline"
            >
              {isLogin ? "Non hai un account? Registrati qui" : "Hai già un account? Accedi"}
            </button>
          </div>

          {/* Info aggiuntiva */}
          {!isLogin && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Vantaggi per le Cantine</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Pannello di gestione dedicato</li>
                <li>✓ Carica e gestisci i tuoi vini</li>
                <li>✓ Monitora visualizzazioni e vendite</li>
                <li>✓ Crea eventi e degustazioni</li>
                <li>✓ Raggiunge nuovi clienti</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
