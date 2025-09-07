
import React, { useState, useEffect } from "react";
import RoleGuard from "../components/auth/RoleGuard.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Winery, Wine, TastingBox, User, Event, Order } from "@/api/entities"; // Added Event, Order
import { Building, Wine as WineIcon, Gift, Image, UploadCloud, Home as HomeIcon, Database, ShoppingCart, Upload, DollarSign } from "lucide-react"; // Updated icons
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Sistema completo di gestione ordini per admin, cantine e utenti

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalWineries: 0,
    totalWines: 0,
    totalEvents: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeWineries: 0,
    loading: true
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [wineriesList, winesList, eventsList, ordersList] = await Promise.all([
        Winery.list(),
        Wine.list(),
        Event.list(), // Fetch Events
        Order.list()  // Fetch Orders
      ]);
      
      let calculatedRevenue = 0;
      if (ordersList && ordersList.length > 0) {
        calculatedRevenue = ordersList.reduce((sum, order) => sum + (order.total || 0), 0);
      }

      setStats({
        totalWineries: wineriesList.length,
        totalWines: winesList.length,
        totalEvents: eventsList.length,
        totalOrders: ordersList.length,
        totalRevenue: calculatedRevenue,
        activeWineries: wineriesList.length, // Assuming all registered wineries are active for now
        loading: false
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const quickActions = [
    { title: "Gestione Dati", description: "Amministra cantine e vini", icon: Database, link: "AdminData", color: "bg-blue-500" },
    { title: "Ordini", description: "Visualizza tutti gli ordini", icon: ShoppingCart, link: "AdminOrders", color: "bg-green-500" },
    { title: "Media Library", description: "Gestisci immagini e video", icon: Image, link: "AdminMedia", color: "bg-purple-500" },
    { title: "Box Degustazione", description: "Gestisci le box", icon: Gift, link: "AdminTastingBoxes", color: "bg-orange-500" },
    { title: "Contenuti Home", description: "Modifica homepage", icon: HomeIcon, link: "AdminContentHome", color: "bg-pink-500" },
    { title: "Import Dati", description: "Importa da CSV", icon: UploadCloud, link: "AdminImport", color: "bg-indigo-500" }
  ];

  return (
    <RoleGuard allow={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Quick Actions Menu */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Azioni Rapide</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action, index) => (
                <Link 
                  key={index} 
                  to={createPageUrl(action.link)} 
                  className="group rounded-2xl border p-6 bg-white hover:shadow-lg hover:border-red-600 transition-all block" // Generic hover color for all
                >
                  <action.icon className={`w-8 h-8 mb-3 ${action.color.replace('bg-', 'text-')}`} />
                  <h3 className="font-semibold text-lg text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Statistiche Overview */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Cantine Totali</CardTitle>
                <Building className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {stats.loading ? "..." : stats.totalWineries}
                </div>
                <p className="text-xs text-green-600 mt-1">cantine registrate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Vini in Catalogo</CardTitle>
                <WineIcon className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  {stats.loading ? "..." : stats.totalWines}
                </div>
                <p className="text-xs text-purple-600 mt-1">etichette totali</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-800">Ordini Effettuati</CardTitle>
                <ShoppingCart className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">
                  {stats.loading ? "..." : stats.totalOrders}
                </div>
                <p className="text-xs text-amber-600 mt-1">ordini totali</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Ricavo Totale</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">
                  {stats.loading ? "..." : `$${stats.totalRevenue.toFixed(2)}`}
                </div>
                <p className="text-xs text-blue-600 mt-1">guadagni lordi</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
