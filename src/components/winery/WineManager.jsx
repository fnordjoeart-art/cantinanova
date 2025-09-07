
import React, { useState, useEffect, useCallback } from "react";
import { Wine } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Upload,
  Wine as WineIcon,
  Save,
  X
} from "lucide-react";

export default function WineManager({ winery }) {
  const [wines, setWines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingWine, setEditingWine] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const wineTypes = ["rosso", "bianco", "rosé", "spumante", "dolce"];
  const commonGrapes = [
    "Sangiovese", "Nebbiolo", "Montepulciano", "Barbera", "Dolcetto", "Primitivo",
    "Pinot Nero", "Merlot", "Cabernet Sauvignon", "Syrah", "Corvina",
    "Trebbiano", "Pinot Grigio", "Chardonnay", "Sauvignon Blanc", "Vermentino",
    "Prosecco", "Gewürztraminer", "Riesling", "Moscato"
  ];

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    denominazione: "",
    vintage: new Date().getFullYear(),
    grape_varieties: [],
    alcohol_content: "",
    price: "",
    tasting_notes: "",
    image_url: "",
    attivo: true
  });

  const loadWines = useCallback(async () => {
    if (!winery) return;
    setIsLoading(true);
    try {
      const winesData = await Wine.filter({ winery_name: winery.name });
      setWines(winesData);
    } catch (error) {
      console.error("Error loading wines:", error);
    }
    setIsLoading(false);
  }, [winery]); // Dependency on winery to reload wines if winery changes

  useEffect(() => {
    loadWines();
  }, [loadWines]); // Dependency on loadWines memoized function

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      denominazione: "",
      vintage: new Date().getFullYear(),
      grape_varieties: [],
      alcohol_content: "",
      price: "",
      tasting_notes: "",
      image_url: "",
      attivo: true
    });
    setEditingWine(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const wineData = {
      ...formData,
      winery_id: winery.id,
      winery_name: winery.name,
      region: winery.region,
      // Ensure codice_vino is unique and stable. Using Date.now() might be problematic on updates.
      // For now, keeping original logic for demonstration purposes.
      codice_vino: `${winery.codice_cantina}_${formData.name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`, 
      price: parseFloat(formData.price),
      alcohol_content: parseFloat(formData.alcohol_content) || null,
      vintage: parseInt(formData.vintage)
    };

    try {
      if (editingWine) {
        // When editing, preserve the existing codice_vino
        await Wine.update(editingWine.id, { ...wineData, codice_vino: editingWine.codice_vino });
      } else {
        await Wine.create(wineData);
      }
      
      setIsFormOpen(false);
      resetForm();
      loadWines();
    } catch (error) {
      console.error("Error saving wine:", error);
    }
  };

  const handleEdit = (wine) => {
    setFormData({
      name: wine.name || "",
      type: wine.type || "",
      denominazione: wine.denominazione || "",
      vintage: wine.vintage || new Date().getFullYear(),
      grape_varieties: wine.grape_varieties || [],
      alcohol_content: wine.alcohol_content || "",
      price: wine.price || "",
      tasting_notes: wine.tasting_notes || "",
      image_url: wine.image_url || "",
      attivo: wine.attivo !== false // Ensure attivo is true by default if not explicitly false
    });
    setEditingWine(wine);
    setIsFormOpen(true);
  };

  const handleDelete = async (wineId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo vino?")) {
      try {
        await Wine.delete(wineId);
        loadWines();
      } catch (error) {
        console.error("Error deleting wine:", error);
      }
    }
  };

  const handleGrapeToggle = (grape) => {
    setFormData(prev => ({
      ...prev,
      grape_varieties: prev.grape_varieties.includes(grape)
        ? prev.grape_varieties.filter(g => g !== grape)
        : [...prev.grape_varieties, grape]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>I Miei Vini</CardTitle>
            <CardDescription>
              Gestisci il catalogo dei vini della tua cantina
            </CardDescription>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-red-800 hover:bg-red-900">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Vino
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingWine ? "Modifica Vino" : "Nuovo Vino"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informazioni Base */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wine-name">Nome del Vino</Label>
                    <Input
                      id="wine-name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Es. Barolo Riserva"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="wine-type">Tipologia</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger id="wine-type">
                        <SelectValue placeholder="Seleziona tipo" />
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wine-denominazione">Denominazione</Label>
                    <Input
                      id="wine-denominazione"
                      value={formData.denominazione}
                      onChange={(e) => setFormData({...formData, denominazione: e.target.value})}
                      placeholder="Es. DOCG, DOC, IGT"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wine-vintage">Annata</Label>
                    <Input
                      id="wine-vintage"
                      type="number"
                      value={formData.vintage}
                      onChange={(e) => setFormData({...formData, vintage: e.target.value})}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                {/* Vitigni */}
                <div>
                  <Label>Vitigni Utilizzati</Label>
                  <div className="mt-2 grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                    {commonGrapes.map(grape => (
                      <label key={grape} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.grape_varieties.includes(grape)}
                          onChange={() => handleGrapeToggle(grape)}
                          className="rounded"
                        />
                        <span className="text-sm">{grape}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wine-alcohol">Gradazione Alcolica (%)</Label>
                    <Input
                      id="wine-alcohol"
                      type="number"
                      step="0.1"
                      value={formData.alcohol_content}
                      onChange={(e) => setFormData({...formData, alcohol_content: e.target.value})}
                      placeholder="Es. 14.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wine-price">Prezzo (€)</Label>
                    <Input
                      id="wine-price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Es. 25.00"
                      required
                    />
                  </div>
                </div>

                {/* Note di Degustazione */}
                <div>
                  <Label htmlFor="wine-tasting-notes">Note di Degustazione</Label>
                  <Textarea
                    id="wine-tasting-notes"
                    value={formData.tasting_notes}
                    onChange={(e) => setFormData({...formData, tasting_notes: e.target.value})}
                    placeholder="Descrivi il profilo organolettico, gli abbinamenti consigliati..."
                    rows={4}
                  />
                </div>

                {/* Immagine */}
                <div>
                  <Label>Immagine Etichetta</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-20 h-20 border rounded-lg flex items-center justify-center bg-gray-50">
                      {formData.image_url ? (
                        <img src={formData.image_url} alt="Anteprima Etichetta" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <Button type="button" variant="outline" onClick={() => alert('Caricamento immagine - da implementare')}>
                      <Upload className="w-4 h-4 mr-2" />
                      Carica Etichetta
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Annulla
                  </Button>
                  <Button type="submit" className="bg-red-800 hover:bg-red-900">
                    <Save className="w-4 h-4 mr-2" />
                    {editingWine ? "Aggiorna" : "Salva"} Vino
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Caricamento vini...</div>
        ) : wines.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <WineIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun vino presente</h3>
            <p className="text-gray-600 mb-4">Inizia ad aggiungere i vini della tua cantina</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Annata</TableHead>
                <TableHead>Prezzo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
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
                    <Badge className={wine.attivo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {wine.attivo ? "Attivo" : "Non attivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(wine)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(wine.id)}>
                        <Trash2 className="w-4 h-4" />
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
  );
}
