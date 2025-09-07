import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Wine,
  ChevronRight,
  Sparkles 
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function UpcomingEvents({ events, isLoading }) {
  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Calendar className="w-6 h-6 text-amber-600" />
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 text-sm">
            Eventi
          </Badge>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Prossimi Eventi
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Partecipa a degustazioni, tour in cantina e masterclass con i produttori emergenti.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={eventTypeColors[event.type] || "bg-gray-100 text-gray-800"}>
                      {eventTypeLabels[event.type] || event.type}
                    </Badge>
                    {event.is_online && (
                      <Badge variant="outline">Online</Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-800 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-red-600" />
                  <span>
                    {format(new Date(event.date), "d MMMM yyyy", { locale: it })}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3 text-red-600" />
                  <span>{event.time}</span>
                  {event.duration && (
                    <span className="text-gray-400 ml-2">({event.duration})</span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-red-600" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-red-600" />
                    <span>{event.current_participants || 0}/{event.max_participants} partecipanti</span>
                  </div>
                  <div className="flex items-center">
                    <Wine className="w-4 h-4 mr-2 text-amber-600" />
                    <span className="font-semibold">{event.winery_name}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xl font-bold text-red-800">
                  €{event.price}
                </div>
                <Link to={createPageUrl(`Event?id=${event.id}`)}>
                  <Button className="bg-red-800 hover:bg-red-900 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                    Prenota
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link to={createPageUrl("Events")}>
          <Button size="lg" variant="outline" className="border-red-200 text-red-800 hover:bg-red-50 px-8 py-3 rounded-full">
            Tutti gli Eventi
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}