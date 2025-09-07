
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Wine,
  MapPin,
  Settings,
  LogOut,
  CheckCircle,
  Building,
  RefreshCw,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_year: "",
    taste_profile: {
      preferred_types: [],
      preferred_regions: [],
      sweetness_preference: "secco",
      body_preference: "medio",
      price_range_min: 0,
      price_range_max: 50,
      bio_preference: false,
      natural_preference: false,
      experience_level: "appassionato"
    },
    newsletter_subscription: true,
    address: {
      street: "",
      city: "",
      postal_code: "",
      province: "",
      country: "Italia"
    }
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        birth_year: userData.birth_year || "",
        taste_profile: userData.taste_profile || formData.taste_profile,
        newsletter_subscription: userData.newsletter_subscription !== false,
        address: userData.address || formData.address
      });
    } catch (error) {
      // Se l'utente non è autenticato, reindirizza al login
      console.log("User not authenticated, redirecting to home", error);
      navigate(createPageUrl("Home"));
      return;
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTasteProfileChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      taste_profile: {
        ...prev.taste_profile,
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleTypePreferenceToggle = (type) => {
    const current = formData.taste_profile.preferred_types || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];

    handleTasteProfileChange("preferred_types", updated);
  };

  const handleRegionPreferenceToggle = (region) => {
    const current = formData.taste_profile.preferred_regions || [];
    const updated = current.includes(region)
      ? current.filter(r => r !== region)
      : [...current, region];

    handleTasteProfileChange("preferred_regions", updated);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const updateData = {
        ...formData,
        completed_onboarding: true
      };

      await User.updateMyUserData(updateData);
      setUser(prev => ({ ...prev, ...updateData }));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsUpdating(false);
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.href = createPageUrl("Home");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  // Se non c'è un utente, mostra messaggio e pulsante per tornare alla home
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center max-w-md">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Accesso Richiesto</h2>
            <p className="text-gray-600 mb-4">Devi effettuare il login per vedere il tuo profilo.</p>
            <Button onClick={() => navigate(createPageUrl("Home"))}>
              Torna alla Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const wineTypes = ["rosso", "bianco", "rosé", "spumante", "dolce"];
  const italianRegions = [
    "Piemonte", "Lombardia", "Veneto", "Trentino-Alto Adige", "Friuli-Venezia Giulia",
    "Liguria", "Emilia-Romagna", "Toscana", "Umbria", "Marche", "Lazio", "Abruzzo",
    "Molise", "Campania", "Puglia", "Basilicata", "Calabria", "Sicilia", "Sardegna"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user?.full_name || "Il Tuo Profilo"}</h1>
              <p className="text-gray-600">{user?.email}</p>
              {user?.completed_onboarding && (
                <Badge className="mt-2 bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Profilo Gustativo Completato
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-700 border-red-200 hover:bg-red-50 w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "profile"
                ? "bg-white text-red-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Dati Personali
          </button>
          <button
            onClick={() => setActiveTab("taste")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "taste"
                ? "bg-white text-red-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Wine className="w-4 h-4 inline mr-2" />
            Profilo Gustativo
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-red-800" />
                Informazioni Personali
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    placeholder="Il tuo nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Il tuo numero di telefono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_year">Anno di Nascita</Label>
                  <Input
                    id="birth_year"
                    type="number"
                    value={formData.birth_year}
                    onChange={(e) => handleInputChange("birth_year", parseInt(e.target.value))}
                    placeholder="1990"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-800" />
                  Indirizzo di Spedizione
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="street">Via/Indirizzo</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => handleAddressChange("street", e.target.value)}
                      placeholder="Via Roma, 123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Città</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      placeholder="Milano"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">CAP</Label>
                    <Input
                      id="postal_code"
                      value={formData.address.postal_code}
                      onChange={(e) => handleAddressChange("postal_code", e.target.value)}
                      placeholder="20100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter_subscription}
                  onCheckedChange={(checked) => handleInputChange("newsletter_subscription", checked)}
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Ricevi newsletter con le ultime novità e offerte speciali
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Taste Profile Tab */}
        {activeTab === "taste" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wine className="w-5 h-5 mr-2 text-red-800" />
                Profilo Gustativo
              </CardTitle>
              <p className="text-gray-600">Aiutaci a conoscerti meglio per raccomandazioni personalizzate</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Wine Types */}
              <div>
                <Label className="text-base font-semibold mb-4 block">Tipologie di Vino Preferite</Label>
                <div className="flex flex-wrap gap-2">
                  {wineTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypePreferenceToggle(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        (formData.taste_profile.preferred_types || []).includes(type)
                          ? "bg-red-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regions */}
              <div>
                <Label className="text-base font-semibold mb-4 block">Regioni Preferite</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {italianRegions.map((region) => (
                    <button
                      key={region}
                      onClick={() => handleRegionPreferenceToggle(region)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        (formData.taste_profile.preferred_regions || []).includes(region)
                          ? "bg-red-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Preferenza di Dolcezza</Label>
                  <Select
                    value={formData.taste_profile.sweetness_preference}
                    onValueChange={(value) => handleTasteProfileChange("sweetness_preference", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="secco">Secco</SelectItem>
                      <SelectItem value="abboccato">Abboccato</SelectItem>
                      <SelectItem value="amabile">Amabile</SelectItem>
                      <SelectItem value="dolce">Dolce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Corpo del Vino</Label>
                  <Select
                    value={formData.taste_profile.body_preference}
                    onValueChange={(value) => handleTasteProfileChange("body_preference", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leggero">Leggero</SelectItem>
                      <SelectItem value="medio">Medio</SelectItem>
                      <SelectItem value="pieno">Pieno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Budget Minimo (€)</Label>
                  <Input
                    type="number"
                    value={formData.taste_profile.price_range_min}
                    onChange={(e) => handleTasteProfileChange("price_range_min", parseFloat(e.target.value) || 0)}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Budget Massimo (€)</Label>
                  <Input
                    type="number"
                    value={formData.taste_profile.price_range_max}
                    onChange={(e) => handleTasteProfileChange("price_range_max", parseFloat(e.target.value) || 100)}
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bio"
                    checked={formData.taste_profile.bio_preference}
                    onCheckedChange={(checked) => handleTasteProfileChange("bio_preference", checked)}
                  />
                  <Label htmlFor="bio">Preferisco vini biologici</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="natural"
                    checked={formData.taste_profile.natural_preference}
                    onCheckedChange={(checked) => handleTasteProfileChange("natural_preference", checked)}
                  />
                  <Label htmlFor="natural">Preferisco vini naturali</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Livello di Esperienza</Label>
                <Select
                  value={formData.taste_profile.experience_level}
                  onValueChange={(value) => handleTasteProfileChange("experience_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principiante">Principiante</SelectItem>
                    <SelectItem value="appassionato">Appassionato</SelectItem>
                    <SelectItem value="esperto">Esperto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            size="lg"
            className="bg-red-800 hover:bg-red-900 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
