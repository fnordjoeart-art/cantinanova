import React, { useState, useEffect } from "react";
import { Event } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Wine,
  ArrowLeft,
  Ticket,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Heart,
  Share2,
  CheckCircle,
  Euro,
  User,
  MessageSquare
} from "lucide-react";

const eventTypeLabels = {
  degustazione: "Degustazione",
  tour_cantina: "Tour in Cantina",
  masterclass: "Masterclass",
  cena_abbinamento: "Cena con Abbinamenti",
  vendemmia: "Esperienza Vendemmia"
};

const eventTypeColors = {
  degustazione: "bg-purple-100 text-purple-800",
  tour_cantina: "bg-green-100 text-green-800",
  masterclass: "bg-blue-100 text-blue-800",
  cena_abbinamento: "bg-red-100 text-red-800",
  vendemmia: "bg-amber-100 text-amber-800"
};

export default function EventDetails() {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    if (eventId) {
      loadEvent(eventId);
    }
  }, []);

  const loadEvent = async (eventId) => {
    setIsLoading(true);
    try {
      const eventData = await Event.list();
      const foundEvent = eventData.find(e => e.id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
      }
    } catch (error) {
      console.error("Error loading event:", error);
    }
    setIsLoading(false);
  };

  const handleBooking = () => {
    // Demo: Simulazione prenotazione
    alert("Funzionalità di prenotazione sarà implementata nella versione finale!");
  };

  const handleContactWinery = () => {
    // Demo: Contatto cantina
    alert("Contatto cantina: Funzione sarà collegata al sistema di messaging!");
  };

  const handleExternalLink = () => {
    // Demo: Link esterno
    alert("Link al sito web della cantina o piattaforma di prenotazione esterna!");
  };

  const handleShare = () => {
    // Demo: Condivisione
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiato negli appunti!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Evento non trovato</h2>
          <Link to={createPageUrl("Events")}>
            <Button variant="outline">Torna agli Eventi</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30">
      {/* Header con immagine hero */}
      <div className="relative h-80 bg-gradient-to-r from-red-800 to-red-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <Link to={createPageUrl("Events")} className="inline-flex items-center text-amber-200 hover:text-amber-100 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna agli Eventi
            </Link>
            <Badge className={`${eventTypeColors[event.type] || "bg-gray-100 text-gray-800"} mb-4`}>
              {eventTypeLabels[event.type] || event.type}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
            <p className="text-xl text-amber-100 max-w-2xl">{event.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenuto principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informazioni evento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Dettagli Evento</span>
                  <button onClick={() => setIsFavorite(!isFavorite)}>
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current text-red-600' : 'text-gray-400'}`} />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Data e Ora</p>
                      <p className="text-gray-600">
                        {format(new Date(event.date), "eeee d MMMM yyyy", { locale: it })} • {event.time}
                      </p>
                      {event.duration && <p className="text-sm text-gray-500">Durata: {event.duration}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Luogo</p>
                      <p className="text-gray-600">{event.location}</p>
                      {event.address && <p className="text-sm text-gray-500">{event.address}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Wine className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Cantina</p>
                      <p className="text-gray-600">{event.winery_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Partecipanti</p>
                      <p className="text-gray-600">{event.current_participants || 0}/{event.max_participants}</p>
                    </div>
                  </div>
                </div>

                {event.sommelier && (
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold">Sommelier</p>
                        <p className="text-gray-600">{event.sommelier}</p>
                      </div>
                    </div>
                  </div>
                )}

                {event.wines_featured && event.wines_featured.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Vini in Degustazione</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.wines_featured.map((wine, index) => (
                        <Badge key={index} variant="secondary">{wine}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {event.includes && event.includes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Cosa Include</h3>
                    <ul className="space-y-2">
                      {event.includes.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.tags && event.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Parole Chiave</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sezione livello e lingua */}
            {(event.difficulty_level || event.language) && (
              <Card>
                <CardHeader>
                  <CardTitle>Informazioni Aggiuntive</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  {event.difficulty_level && (
                    <div>
                      <p className="font-semibold mb-2">Livello di Esperienza</p>
                      <Badge className={
                        event.difficulty_level === 'principiante' ? 'bg-green-100 text-green-800' :
                        event.difficulty_level === 'intermedio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {event.difficulty_level.charAt(0).toUpperCase() + event.difficulty_level.slice(1)}
                      </Badge>
                    </div>
                  )}

                  {event.language && (
                    <div>
                      <p className="font-semibold mb-2">Lingua</p>
                      <p className="text-gray-600 capitalize">{event.language}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar prenotazione */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Card prezzo e prenotazione */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-red-800">€{event.price.toFixed(2)}</span>
                    <button onClick={handleShare}>
                      <Share2 className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Opzioni di prenotazione per demo */}
                  <Button 
                    onClick={handleBooking}
                    className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Ticket className="w-5 h-5 mr-2" />
                    Prenota Subito
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleContactWinery}
                      className="flex items-center justify-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contatta
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={handleExternalLink}
                      className="flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Sito Web
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-600 space-y-1">
                    <p>📞 <strong>Telefono:</strong> +39 123 456 7890</p>
                    <p>✉️ <strong>Email:</strong> info@{event.winery_name.toLowerCase().replace(/\s+/g, '')}.it</p>
                  </div>

                  {event.booking_deadline && (
                    <div className="p-3 bg-amber-50 rounded-lg text-center">
                      <p className="text-sm text-amber-700">
                        ⏰ Prenotazioni entro il {format(new Date(event.booking_deadline), "d MMMM yyyy", { locale: it })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info cantina */}
              <Card>
                <CardHeader>
                  <CardTitle>{event.winery_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Una cantina innovativa che rappresenta l'eccellenza del territorio italiano.
                  </p>
                  <Link to={createPageUrl(`WineryDetails?id=${event.winery_id}`)}>
                    <Button variant="outline" className="w-full">
                      Scopri la Cantina
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Valutazioni demo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    Valutazioni
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(24 recensioni)</span>
                  </div>
                  <p className="text-sm text-gray-600">"Esperienza fantastica! Consigliato"</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}