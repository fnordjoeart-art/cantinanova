
import React, { useState, useEffect, useCallback } from "react";
import { Event } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Upload,
  Calendar,
  Save,
  X,
  MapPin,
  Users,
  Euro
} from "lucide-react";
import { format } from "date-fns";

export default function EventManager({ winery }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const eventTypes = [
    { value: "degustazione", label: "Degustazione" },
    { value: "tour_cantina", label: "Tour in Cantina" },
    { value: "masterclass", label: "Masterclass" },
    { value: "cena_abbinamento", label: "Cena con Abbinamenti" },
    { value: "vendemmia", label: "Esperienza Vendemmia" }
  ];

  const difficultyLevels = [
    { value: "principiante", label: "Principiante" },
    { value: "intermedio", label: "Intermedio" },
    { value: "esperto", label: "Esperto" }
  ];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    address: "",
    is_online: false,
    max_participants: "",
    price: 0,
    includes: [],
    wines_featured: [],
    sommelier: "",
    difficulty_level: "principiante",
    image_url: "",
    status: "aperto"
  });

  const loadEvents = useCallback(async () => {
    if (!winery) return;
    setIsLoading(true);
    try {
      const eventsData = await Event.filter({ winery_id: winery.id });
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
    }
    setIsLoading(false);
  }, [winery]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      address: "",
      is_online: false,
      max_participants: "",
      price: 0,
      includes: [],
      wines_featured: [],
      sommelier: "",
      difficulty_level: "principiante",
      image_url: "",
      status: "aperto"
    });
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      winery_id: winery.id,
      winery_name: winery.name,
      price: parseFloat(formData.price) || 0,
      max_participants: parseInt(formData.max_participants) || null,
      includes: formData.includes.filter(Boolean),
      wines_featured: formData.wines_featured.filter(Boolean)
    };

    try {
      if (editingEvent) {
        await Event.update(editingEvent.id, eventData);
      } else {
        await Event.create(eventData);
      }
      
      setIsFormOpen(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title || "",
      description: event.description || "",
      type: event.type || "",
      date: event.date || "",
      time: event.time || "",
      duration: event.duration || "",
      location: event.location || "",
      address: event.address || "",
      is_online: event.is_online || false,
      max_participants: event.max_participants || "",
      price: event.price || 0,
      includes: event.includes || [],
      wines_featured: event.wines_featured || [],
      sommelier: event.sommelier || "",
      difficulty_level: event.difficulty_level || "principiante",
      image_url: event.image_url || "",
      status: event.status || "aperto"
    });
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo evento?")) {
      try {
        await Event.delete(eventId);
        loadEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleIncludeChange = (index, value) => {
    const newIncludes = [...formData.includes];
    newIncludes[index] = value;
    setFormData({...formData, includes: newIncludes});
  };

  const addIncludeField = () => {
    setFormData({...formData, includes: [...formData.includes, ""]});
  };

  const removeIncludeField = (index) => {
    const newIncludes = formData.includes.filter((_, i) => i !== index);
    setFormData({...formData, includes: newIncludes});
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Eventi della Cantina</CardTitle>
            <CardDescription>
              Crea e gestisci degustazioni, tour e masterclass
            </CardDescription>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-red-800 hover:bg-red-900">
                <Plus className="w-4 h-4 mr-2" />
                Crea Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? "Modifica Evento" : "Nuovo Evento"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informazioni Base */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Titolo Evento</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Es. Degustazione Barolo e Barbaresco"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Tipo di Evento</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Livello di Difficoltà</Label>
                    <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({...formData, difficulty_level: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Data e Ora */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Ora Inizio</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Durata</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="Es. 2 ore"
                    />
                  </div>
                </div>

                {/* Luogo */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_online}
                      onCheckedChange={(checked) => setFormData({...formData, is_online: checked})}
                    />
                    <Label>Evento Online</Label>
                  </div>
                  
                  {!formData.is_online && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Luogo</Label>
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Nome della location"
                          required={!formData.is_online}
                        />
                      </div>
                      <div>
                        <Label>Indirizzo Completo</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="Via, città, provincia"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Partecipanti e Prezzo */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Max Partecipanti</Label>
                    <Input
                      type="number"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                      placeholder="Es. 20"
                    />
                  </div>
                  <div>
                    <Label>Prezzo (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0 = gratuito"
                    />
                  </div>
                  <div>
                    <Label>Sommelier/Relatore</Label>
                    <Input
                      value={formData.sommelier}
                      onChange={(e) => setFormData({...formData, sommelier: e.target.value})}
                      placeholder="Nome del sommelier"
                    />
                  </div>
                </div>

                {/* Descrizione */}
                <div>
                  <Label>Descrizione Evento</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrizione dettagliata dell'evento, cosa aspettarsi..."
                    rows={4}
                  />
                </div>

                {/* Cosa Include */}
                <div>
                  <Label>Cosa Include il Prezzo</Label>
                  <div className="space-y-2">
                    {formData.includes.map((include, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={include}
                          onChange={(e) => handleIncludeChange(index, e.target.value)}
                          placeholder="Es. Degustazione 5 vini, aperitivo..."
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeIncludeField(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addIncludeField}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Aggiungi voce
                    </Button>
                  </div>
                </div>

                {/* Immagine */}
                <div>
                  <Label>Immagine Evento</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-20 h-20 border rounded-lg flex items-center justify-center bg-gray-50">
                      {formData.image_url ? (
                        <img src={formData.image_url} alt="Anteprima" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <Button type="button" variant="outline" onClick={() => alert('Caricamento immagine - da implementare')}>
                      <Upload className="w-4 h-4 mr-2" />
                      Carica Immagine
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
                    {editingEvent ? "Aggiorna" : "Crea"} Evento
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Caricamento eventi...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun evento presente</h3>
            <p className="text-gray-600 mb-4">Inizia a creare eventi per la tua cantina</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Prezzo</TableHead>
                <TableHead>Partecipanti</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map(event => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{eventTypes.find(t => t.value === event.type)?.label}</Badge>
                  </TableCell>
                  <TableCell>
                    {event.date && format(new Date(event.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {event.price > 0 ? `€${event.price.toFixed(2)}` : 'Gratuito'}
                  </TableCell>
                  <TableCell>
                    {event.current_participants || 0}/{event.max_participants || '∞'}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      event.status === 'aperto' ? "bg-green-100 text-green-800" :
                      event.status === 'sold_out' ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }>
                      {event.status === 'aperto' ? 'Aperto' : 
                       event.status === 'sold_out' ? 'Sold Out' : 
                       event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(event.id)}>
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
