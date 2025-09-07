import React, { useState, useEffect } from "react";
import { Wine, Winery, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Wine as WineIcon, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";
import RoleGuard from "../components/auth/RoleGuard";

export default function WineryWineManager() {
  const [wines, setWines] = useState([]);
  const [winery, setWinery] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWine, setEditingWine] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "rosso",
    vintage: new Date().getFullYear(),
    price: "",
    denominazione: "",
    grape_varieties: [],
    alcohol_content: "",
    tasting_notes: "",
    attivo: true
  });

  const wineTypes = ["rosso", "bianco", "rosé", "spumante", "dolce"];
  const commonGrapes = [
    "Sangiovese", "Nebbiolo", "Montepulciano", "Barbera", "Dolcetto", "Corvina", "Rondinella",
    "Chardonnay", "Pinot Grigio", "Sauvignon Blanc", "Vermentino", "Friulano", "Gewürztraminer",
    "Prosecco", "Franciacorta", "Lambrusco"
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (currentUser.winery_id) {
        const [winesData, wineriesData] = await Promise.all([
          Wine.filter({ winery_id: currentUser.winery_id }),
          Winery.list()
        ]);
        
        const wineryData = wineriesData.find(w => w.id === currentUser.winery_id);
        setWines(winesData);
        setWinery(wineryData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGrapeVarietyToggle = (grape) => {
    const current = formData.grape_varieties;
    const updated = current.includes(grape)
      ? current.filter(g => g !== grape)
      : [...current, grape];
    setFormData(prev => ({ ...prev, grape_varieties: updated }));
  };

  const openAddForm = () => {
    setEditingWine(null);
    setFormData({
      name: "",
      type: "rosso",
      vintage: new Date().getFullYear(),
      price: "",
      denominazione: "",
      grape_varieties: [],
      alcohol_content: "",
      tasting_notes: "",
      attivo: true
    });
    setIsFormOpen(true);
  };

  const openEditForm = (wine) => {
    setEditingWine(wine);
    setFormData({
      name: wine.name || "",
      type: wine.type || "rosso",
      vintage: wine.vintage || new Date().getFullYear(),
      price: wine.price || "",
      denominazione: wine.denominazione || "",
      grape_varieties: wine.grape_varieties || [],
      alcohol_content: wine.alcohol_content || "",
      tasting_notes: wine.tasting_notes || "",
      attivo: wine.attivo !== false
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!user?.winery_id || !winery) return;

    setIsSaving(true);
    try {
      const wineData = {
        ...formData,
        winery_id: user.winery_id,
        winery_name: winery.name,
        region: winery.region,
        price: parseFloat(formData.price),
        alcohol_content: formData.alcohol_content ? parseFloat(formData.alcohol_content) : undefined,
        codice_vino: editingWine ? editingWine.codice_vino : `${user.winery_id}_${Date.now()}`
      };

      if (editingWine) {
        await Wine.update(editingWine.id, wineData);
      } else {
        await Wine.create(wineData);
      }

      await loadData();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving wine:", error);
    }
    setIsSaving(false);
  };

  const handleDelete = async (wine) => {
    if (!confirm(`Sei sicuro di voler eliminare "${wine.name}"?`)) return;

    try {
      await Wine.delete(wine.id);
      await loadData();
    } catch (error) {
      console.error("Error deleting wine:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-green-700" />
      </div>
    );
  }

  return (
    <RoleGuard allow={["winery_owner", "winery_manager", "winery_editor"]}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">I Miei Vini</h1>
                <p className="text-gray-600">Gestisci il catalogo dei tuoi vini - {winery?.name}</p>
              </div>
              <Button onClick={openAddForm} className="bg-green-700 hover:bg-green-800">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Vino
              </Button>
            </div>
          </header>

          {/* Lista Vini */}
          <Card>
            <CardContent className="p-6">
              {wines.length === 0 ? (
                <div className="text-center py-12">
                  <WineIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun vino ancora</h3>
                  <p className="text-gray-600 mb-4">Inizia ad aggiungere i tuoi vini al catalogo</p>
                  <Button onClick={openAddForm} className="bg-green-700 hover:bg-green-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi il Primo Vino
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome Vino</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Annata</TableHead>
                      <TableHead>Prezzo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wines.map(wine => (
                      <TableRow key={wine.id}>
                        <TableCell className="font-medium">{wine.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{wine.type}</Badge>
                        </TableCell>
                        <TableCell>{wine.vintage}</TableCell>
                        <TableCell>€{wine.price?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={wine.attivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {wine.attivo ? "Attivo" : "Disattivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditForm(wine)}
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Modifica
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(wine)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Elimina
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Dialog per Aggiungere/Modificare Vino */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingWine ? "Modifica Vino" : "Aggiungi Nuovo Vino"}
                </DialogTitle>
                <DialogDescription>
                  Compila i dettagli del vino. I campi obbligatori sono contrassegnati.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Vino *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="es. Chianti Classico"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipologia *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {wineTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vintage">Annata</Label>
                    <Input
                      id="vintage"
                      type="number"
                      value={formData.vintage}
                      onChange={(e) => handleInputChange("vintage", parseInt(e.target.value))}
                      min="1900"
                      max="2030"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Prezzo (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="15.50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="denominazione">Denominazione</Label>
                    <Input
                      id="denominazione"
                      value={formData.denominazione}
                      onChange={(e) => handleInputChange("denominazione", e.target.value)}
                      placeholder="es. DOCG, DOC, IGT"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alcohol_content">Gradazione Alcolica (%)</Label>
                    <Input
                      id="alcohol_content"
                      type="number"
                      step="0.1"
                      value={formData.alcohol_content}
                      onChange={(e) => handleInputChange("alcohol_content", e.target.value)}
                      placeholder="13.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Vitigni</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {commonGrapes.map(grape => (
                      <button
                        key={grape}
                        type="button"
                        onClick={() => handleGrapeVarietyToggle(grape)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          formData.grape_varieties.includes(grape)
                            ? "bg-green-700 text-white border-green-700"
                            : "bg-white text-gray-700 border-gray-200 hover:border-green-300"
                        }`}
                      >
                        {grape}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tasting_notes">Note di Degustazione</Label>
                  <Textarea
                    id="tasting_notes"
                    value={formData.tasting_notes}
                    onChange={(e) => handleInputChange("tasting_notes", e.target.value)}
                    placeholder="Descrivi il profilo sensoriale del vino..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="attivo"
                    checked={formData.attivo}
                    onChange={(e) => handleInputChange("attivo", e.target.checked)}
                  />
                  <Label htmlFor="attivo">Vino attivo (visibile nel catalogo)</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Annulla
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-green-700 hover:bg-green-800">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingWine ? "Salva Modifiche" : "Aggiungi Vino"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </RoleGuard>
  );
}