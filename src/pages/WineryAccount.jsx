
import React, { useState, useEffect } from "react";
import { User, Winery } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CheckCircle, 
  Loader2, 
  AlertTriangle 
} from "lucide-react";

export default function WineryAccount() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [winery, setWinery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Dati utente responsabile
    full_name: "",
    email: "",
    phone: "",
    
    // Dati cantina
    company_name: "",
    vat_number: "",
    website: "",
    contact_email: "",
    region: "",
    sub_region: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      
      if (!currentUser || !currentUser.role.startsWith('winery_')) {
        setError("Accesso non autorizzato. Devi essere un membro di una cantina.");
        setTimeout(() => navigate(createPageUrl("Home")), 3000);
        return;
      }
      
      setUser(currentUser);
      
      let wineryData = null; // Declare wineryData here to ensure scope
      if (currentUser.winery_id) {
        const wineryList = await Winery.list({ id: currentUser.winery_id });
        if (wineryList.length > 0) {
          wineryData = wineryList[0]; // Assign the single object
          setWinery(wineryData); // Set the state with the single object
        }
      }

      // Popola form con dati esistenti
      setFormData({
        full_name: currentUser.full_name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        company_name: wineryData?.name || "", // Access directly from wineryData object
        vat_number: wineryData?.vat_number || "",
        website: wineryData?.website || "",
        contact_email: wineryData?.contact_email || "",
        region: wineryData?.region || "",
        sub_region: wineryData?.sub_region || ""
      });
      
    } catch (e) {
      setError("Devi effettuare il login per accedere a questa pagina.");
      setTimeout(() => navigate(createPageUrl("Onboarding")), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Aggiorna dati utente
      await User.updateMyUserData({
        full_name: formData.full_name,
        phone: formData.phone
      });
      
      // Aggiorna dati cantina se esiste
      if (winery) {
        await Winery.update(winery.id, {
          name: formData.company_name,
          vat_number: formData.vat_number,
          website: formData.website,
          contact_email: formData.contact_email,
          region: formData.region,
          sub_region: formData.sub_region
        });
      }

    } catch (error) {
      console.error("Error updating data:", error);
      setError("Si è verificato un errore durante il salvataggio. Riprova.");
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-red-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold">Attenzione</h2>
        <p className="text-gray-600 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Cantina</h1>
              <p className="text-gray-600">Gestisci i dati del tuo account e della tua azienda</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Dati Personali */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-amber-600" />
                I Tuoi Dati
              </CardTitle>
              <CardDescription>
                Informazioni del responsabile dell'account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">L'email non può essere modificata</p>
              </div>
              <div>
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+39 123 456 7890"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dati Cantina */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-amber-600" />
                Dati Azienda
              </CardTitle>
              <CardDescription>
                Informazioni della tua cantina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company_name">Nome Cantina</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vat_number">Partita IVA</Label>
                <Input
                  id="vat_number"
                  value={formData.vat_number}
                  onChange={(e) => handleInputChange("vat_number", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Email Aziendale</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange("contact_email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="website">Sito Web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Localizzazione */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                Dove Siete
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Regione</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Es. Toscana"
                />
              </div>
              <div>
                <Label htmlFor="sub_region">Zona Specifica</Label>
                <Input
                  id="sub_region"
                  value={formData.sub_region}
                  onChange={(e) => handleInputChange("sub_region", e.target.value)}
                  placeholder="Es. Chianti Classico"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottone Salvataggio */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            size="lg"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Salva Modifiche
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
