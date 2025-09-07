
import React, { useState, useEffect } from "react";
import { Event } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Wine,
  ChevronRight,
  Ticket,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";

const eventTypeLabels = {
  degustazione: "Degustazione",
  tour_cantina: "Tour in Cantina",
  masterclass: "Masterclass",
  cena_abbinamento: "Cena con Abbinamenti",
  vendemmia: "Esperienza Vendemmia"
};

const eventTypeColors = {
  degustazione: "bg-purple-100 text-purple-800 border-purple-200",
  tour_cantina: "bg-green-100 text-green-800 border-green-200",
  masterclass: "bg-blue-100 text-blue-800 border-blue-200",
  cena_abbinamento: "bg-red-100 text-red-800 border-red-200",
  vendemmia: "bg-amber-100 text-amber-800 border-amber-200"
};

const EventCard = ({ event }) => (
  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm h-full flex flex-col">
    <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={eventTypeColors[event.type] || "bg-gray-100 text-gray-800 border-gray-200"}>
            {eventTypeLabels[event.type] || event.type}
          </Badge>
          {event.is_online && (
            <Badge variant="outline">Online</Badge>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-800 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {event.description}
        </p>
        
        {/* Parole Chiave */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-3 text-red-600" />
          <span className="font-semibold">
            {format(new Date(event.date), "eeee d MMMM yyyy", { locale: it })}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-3 text-red-600" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-3 text-red-600" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center">
          <Wine className="w-4 h-4 mr-3 text-red-600" />
          <span className="font-semibold">{event.winery_name}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="text-xl font-bold text-red-800">
          €{event.price.toFixed(2)}
        </div>
        <Link to={createPageUrl(`EventDetails?id=${event.id}`)}>
          <Button className="bg-red-800 hover:bg-red-900 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300 group">
            Scopri di più
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Stati per i filtri temporanei (prima dell'applicazione)
  const [tempFilters, setTempFilters] = useState({
    search: "",
    type: "all",
    wine_type: "all", 
    region: "all",
    date_from: "",
    date_to: ""
  });

  // Filtri applicati (quelli effettivamente attivi)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    type: "all",
    wine_type: "all", 
    region: "all",
    date_from: "",
    date_to: ""
  });

  // Estrai valori unici per i filtri
  const [regions, setRegions] = useState([]);
  const [wineTypes, setWineTypes] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appliedFilters, events]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const eventsData = await Event.filter({ status: 'aperto' }, 'date');
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      
      // Estrai regioni e tipi di vino unici
      const uniqueRegions = [...new Set(eventsData.map(e => e.location.split(',')[0]).filter(Boolean))];
      const uniqueWineTypes = [...new Set(eventsData.flatMap(e => e.wines_featured || []).filter(Boolean))];
      
      setRegions(uniqueRegions.sort());
      setWineTypes(uniqueWineTypes.sort());
      
    } catch (error) {
      console.error("Error loading events:", error);
    }
    setIsLoading(false);
  };

  const applyFilters = () => {
    let result = events;

    // Filtro ricerca testuale
    if (appliedFilters.search) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        event.winery_name.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(appliedFilters.search.toLowerCase()))
      );
    }

    // Filtro tipo evento
    if (appliedFilters.type !== "all") {
      result = result.filter(event => event.type === appliedFilters.type);
    }

    // Filtro tipo di vino
    if (appliedFilters.wine_type !== "all") {
      result = result.filter(event => 
        event.wines_featured?.includes(appliedFilters.wine_type) ||
        event.tags?.includes(appliedFilters.wine_type)
      );
    }

    // Filtro regione
    if (appliedFilters.region !== "all") {
      result = result.filter(event => 
        event.location.toLowerCase().includes(appliedFilters.region.toLowerCase())
      );
    }

    // Filtro data inizio
    if (appliedFilters.date_from) {
      result = result.filter(event => new Date(event.date) >= new Date(appliedFilters.date_from));
    }

    // Filtro data fine
    if (appliedFilters.date_to) {
      result = result.filter(event => new Date(event.date) <= new Date(appliedFilters.date_to));
    }

    setFilteredEvents(result);
  };

  const handleTempFilterChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
  };

  const resetFilters = () => {
    const resetValues = {
      search: "",
      type: "all",
      wine_type: "all",
      region: "all",
      date_from: "",
      date_to: ""
    };
    setTempFilters(resetValues);
    setAppliedFilters(resetValues);
  };

  const hasActiveFilters = Object.values(appliedFilters).some(f => f && f !== "all");
  const hasUnappliedChanges = JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30">
      {/* Header */}
      <header className="bg-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="w-6 h-6 text-amber-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Eventi e Degustazioni
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partecipa a degustazioni, tour in cantina e masterclass. Incontra i produttori e vivi esperienze uniche.
          </p>
        </div>
      </header>

      {/* Filtri Compatti */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Filter className="w-5 h-5 mr-2 text-red-800" />
                Filtra Eventi
              </h3>
              {hasActiveFilters && (
                <Badge className="bg-red-100 text-red-800">
                  Filtri Attivi
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Ricerca */}
              <div className="lg:col-span-1">
                <label className="text-sm font-medium mb-2 block">Cerca Eventi</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Titolo, cantina, parole chiave..."
                    value={tempFilters.search}
                    onChange={(e) => handleTempFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tipo Evento */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo di Evento</label>
                <Select value={tempFilters.type} onValueChange={(v) => handleTempFilterChange('type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tutti i tipi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i Tipi</SelectItem>
                    <SelectItem value="degustazione">🍷 Degustazione</SelectItem>
                    <SelectItem value="tour_cantina">🏛️ Tour in Cantina</SelectItem>
                    <SelectItem value="masterclass">🎓 Masterclass</SelectItem>
                    <SelectItem value="cena_abbinamento">🍽️ Cena con Abbinamenti</SelectItem>
                    <SelectItem value="vendemmia">🍇 Esperienza Vendemmia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo di Vino */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tipologia di Vino</label>
                <Select value={tempFilters.wine_type} onValueChange={(v) => handleTempFilterChange('wine_type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tutti i vini" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i Vini</SelectItem>
                    <SelectItem value="Rosso">🔴 Vini Rossi</SelectItem>
                    <SelectItem value="Bianco">⚪ Vini Bianchi</SelectItem>
                    <SelectItem value="Rosé">🌸 Vini Rosé</SelectItem>
                    <SelectItem value="Spumante">🍾 Spumanti</SelectItem>
                    <SelectItem value="Biologico">🌱 Biologici</SelectItem>
                    <SelectItem value="Naturale">🍃 Naturali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Regione */}
              <div>
                <label className="text-sm font-medium mb-2 block">Regione</label>
                <Select value={tempFilters.region} onValueChange={(v) => handleTempFilterChange('region', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tutte le regioni" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le Regioni</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>
                        📍 {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium mb-2 block">Data Inizio</label>
                <Input
                  type="date"
                  value={tempFilters.date_from}
                  onChange={(e) => handleTempFilterChange('date_from', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Data Fine</label>
                <Input
                  type="date"
                  value={tempFilters.date_to}
                  onChange={(e) => handleTempFilterChange('date_to', e.target.value)}
                />
              </div>
            </div>

            {/* Pulsanti Azione */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="text-sm text-gray-600">
                <strong>{filteredEvents.length}</strong> eventi trovati
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                
                <Button 
                  onClick={handleApplyFilters}
                  className={`bg-red-800 hover:bg-red-900 text-white px-6 ${
                    hasUnappliedChanges ? 'animate-pulse shadow-lg' : ''
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Applica Filtri
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eventi Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)
          ) : (
            filteredEvents.map(event => <EventCard key={event.id} event={event} />)
          )}
        </div>
        
        {filteredEvents.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-white/50 rounded-2xl">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nessun evento trovato</h3>
            <p className="text-gray-600 mb-4">
              Prova a modificare i filtri per trovare eventi che ti interessano.
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Mostra Tutti gli Eventi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
