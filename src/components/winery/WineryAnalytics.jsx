import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  ShoppingCart, 
  Heart,
  Calendar,
  MapPin,
  Wine,
  Download,
  RefreshCw
} from "lucide-react";

export default function WineryAnalytics({ winery }) {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  // Dati mock per la demo - in produzione verrebbero dal backend
  const overviewStats = {
    pageViews: { value: 2847, change: +12.5, period: "vs mese scorso" },
    uniqueVisitors: { value: 1623, change: +8.3, period: "vs mese scorso" },
    wineViews: { value: 4521, change: +15.7, period: "vs mese scorso" },
    eventBookings: { value: 23, change: -2.1, period: "vs mese scorso" },
    avgTimeOnPage: { value: "3m 24s", change: +18.9, period: "vs mese scorso" },
    bounceRate: { value: "32.4%", change: -5.2, period: "vs mese scorso" }
  };

  const visitsData = [
    { date: "1 Gen", visits: 45, uniqueVisitors: 32 },
    { date: "8 Gen", visits: 52, uniqueVisitors: 41 },
    { date: "15 Gen", visits: 67, uniqueVisitors: 49 },
    { date: "22 Gen", visits: 81, uniqueVisitors: 62 },
    { date: "29 Gen", visits: 94, uniqueVisitors: 71 },
    { date: "5 Feb", visits: 103, uniqueVisitors: 78 },
    { date: "12 Feb", visits: 89, uniqueVisitors: 65 }
  ];

  const winePerformance = [
    { name: "Barolo Riserva 2019", views: 543, interactions: 67, conversions: 12 },
    { name: "Nebbiolo d'Alba 2021", views: 421, interactions: 52, conversions: 8 },
    { name: "Barbera d'Asti 2022", views: 387, interactions: 43, conversions: 15 },
    { name: "Dolcetto 2022", views: 298, interactions: 31, conversions: 6 },
    { name: "Moscato d'Asti 2022", views: 276, interactions: 28, conversions: 9 }
  ];

  const geographicData = [
    { region: "Piemonte", visitors: 387, percentage: 34.2 },
    { region: "Lombardia", visitors: 234, percentage: 20.7 },
    { region: "Veneto", visitors: 178, percentage: 15.8 },
    { region: "Toscana", visitors: 145, percentage: 12.8 },
    { region: "Emilia-Romagna", visitors: 89, percentage: 7.9 },
    { region: "Altri", visitors: 98, percentage: 8.6 }
  ];

  const eventStats = [
    { name: "Degustazione Barolo", bookings: 18, capacity: 20, revenue: 450 },
    { name: "Tour in Cantina", bookings: 12, capacity: 15, revenue: 180 },
    { name: "Masterclass Nebbiolo", bookings: 8, capacity: 10, revenue: 320 },
    { name: "Cena Abbinamenti", bookings: 14, capacity: 16, revenue: 840 }
  ];

  const COLORS = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a'];

  const StatCard = ({ title, value, change, period, icon: Icon }) => (
    <Card className="bg-white/90 backdrop-blur-sm border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">{period}</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header con controlli */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Performance della tua cantina e dei tuoi prodotti</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Ultimi 7 giorni</SelectItem>
              <SelectItem value="30d">Ultimi 30 giorni</SelectItem>
              <SelectItem value="3m">Ultimi 3 mesi</SelectItem>
              <SelectItem value="1y">Ultimo anno</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      </div>

      {/* Statistiche Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Visualizzazioni Pagina"
          value={overviewStats.pageViews.value.toLocaleString()}
          change={overviewStats.pageViews.change}
          period={overviewStats.pageViews.period}
          icon={Eye}
        />
        <StatCard
          title="Visitatori Unici"
          value={overviewStats.uniqueVisitors.value.toLocaleString()}
          change={overviewStats.uniqueVisitors.change}
          period={overviewStats.uniqueVisitors.period}
          icon={Users}
        />
        <StatCard
          title="Visualizzazioni Vini"
          value={overviewStats.wineViews.value.toLocaleString()}
          change={overviewStats.wineViews.change}
          period={overviewStats.wineViews.period}
          icon={Wine}
        />
        <StatCard
          title="Tempo Medio Pagina"
          value={overviewStats.avgTimeOnPage.value}
          change={overviewStats.avgTimeOnPage.change}
          period={overviewStats.avgTimeOnPage.period}
          icon={TrendingUp}
        />
        <StatCard
          title="Frequenza Rimbalzo"
          value={overviewStats.bounceRate.value}
          change={overviewStats.bounceRate.change}
          period={overviewStats.bounceRate.period}
          icon={TrendingDown}
        />
        <StatCard
          title="Prenotazioni Eventi"
          value={overviewStats.eventBookings.value}
          change={overviewStats.eventBookings.change}
          period={overviewStats.eventBookings.period}
          icon={Calendar}
        />
      </div>

      {/* Tabs per sezioni dettagliate */}
      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="traffic">Traffico</TabsTrigger>
          <TabsTrigger value="wines">Vini</TabsTrigger>
          <TabsTrigger value="events">Eventi</TabsTrigger>
          <TabsTrigger value="geography">Geografia</TabsTrigger>
        </TabsList>

        {/* Tab Traffico */}
        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Andamento Visite</CardTitle>
              <CardDescription>Visualizzazioni e visitatori unici nel tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={visitsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="visits" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} name="Visite Totali" />
                  <Area type="monotone" dataKey="uniqueVisitors" stackId="2" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} name="Visitatori Unici" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Vini */}
        <TabsContent value="wines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Vini</CardTitle>
              <CardDescription>Visualizzazioni, interazioni e conversioni per ogni vino</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {winePerformance.map((wine, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <Wine className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{wine.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span><Eye className="w-4 h-4 inline mr-1" />{wine.views} views</span>
                          <span><Heart className="w-4 h-4 inline mr-1" />{wine.interactions} likes</span>
                          <span><ShoppingCart className="w-4 h-4 inline mr-1" />{wine.conversions} conversioni</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{((wine.conversions / wine.views) * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">Tasso conversione</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Eventi */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiche Eventi</CardTitle>
              <CardDescription>Performance e ricavi degli eventi organizzati</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#dc2626" name="Prenotazioni" />
                  <Bar dataKey="capacity" fill="#fca5a5" name="Capacità" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            {eventStats.map((event, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{event.name}</h4>
                    <Badge className="bg-green-100 text-green-800">
                      {((event.bookings / event.capacity) * 100).toFixed(0)}% occupato
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{event.bookings}</div>
                      <div className="text-sm text-gray-500">Prenotazioni</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{event.capacity}</div>
                      <div className="text-sm text-gray-500">Posti</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">€{event.revenue}</div>
                      <div className="text-sm text-gray-500">Ricavo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Geografia */}
        <TabsContent value="geography" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuzione Geografica</CardTitle>
                <CardDescription>Da dove arrivano i tuoi visitatori</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={geographicData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                    >
                      {geographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Regioni</CardTitle>
                <CardDescription>Regioni con più visitatori</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geographicData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900">{region.region}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{region.visitors}</div>
                        <div className="text-sm text-gray-500">{region.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}