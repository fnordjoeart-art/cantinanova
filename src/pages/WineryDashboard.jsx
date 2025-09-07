
import React, { useState, useEffect, useCallback } from "react";
import { Winery, Wine } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import RoleGuard from "../components/auth/RoleGuard.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Wine as WineIcon, Calendar, BarChart, Settings, Loader2, AlertTriangle, Info, Pencil, ShoppingCart, TrendingUp, RefreshCw, Eye } from "lucide-react";
import WineryInfoEditor from "../components/winery/WineryInfoEditor";
import WineManager from "../components/winery/WineManager";
import EventManager from "../components/winery/EventManager";
import WineryAnalytics from "../components/winery/WineryAnalytics";
import { useUser } from "../components/auth/UserContext";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WineryDashboard() {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useUser();
  const [winery, setWinery] = useState(null);
  const [wines, setWines] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Nuova funzione per caricare statistiche ordini - ora stabile con useCallback
  const loadOrderStats = useCallback(async () => {
    // Ensure user data is available before proceeding
    if (!user || !user.winery_id) {
        return; 
    }

    try {
      const { OrderItem } = await import("@/api/entities");
      const allOrderItems = await OrderItem.list();
      
      // Filtra gli order items della mia cantina
      const myItems = allOrderItems.filter(item => 
        item.winery_id === user.winery_id || 
        item.winery_name?.includes('Mock') // Fallback per demo
      );
      
      // Conta ordini degli ultimi giorni (simulando "nuovi")
      const recentItems = myItems.filter(item => {
        const itemDate = new Date(item.created_date);
        const daysDiff = (new Date() - itemDate) / (1000 * 60 * 60 * 24);
        // An order item is "new" if it's recent and its order status is 'paid' or 'pending_payment'
        return daysDiff <= 7 && (item.status === 'paid' || item.status === 'pending_payment');
      });
      
      setPendingOrders(recentItems.length);
    } catch (error) {
      console.error("Error loading order stats:", error);
    }
  }, [user]); // Dependency: user, as user.winery_id is used inside

  const loadWineryData = useCallback(async () => {
    if (isUserLoading || !user) {
      return;
    }
    
    setIsLoading(true);

    if (!user.role.startsWith('winery_')) {
      setError("Accesso non autorizzato.");
      setIsLoading(false);
      return;
    }
    
    if (!user.winery_id) {
      setError("Account non associato a una cantina.");
      setIsLoading(false);
      return;
    }

    try {
      const wineryData = await Winery.filter({ 'codice_cantina': user.winery_id });
      if (wineryData.length === 0) {
        setError("Dati della cantina non trovati.");
        setIsLoading(false);
        return;
      }
      
      const currentWinery = wineryData[0];
      setWinery(currentWinery);

      // Workaround for demo: filter wines by winery_name since winery_id in mock data is incorrect
      const winesData = await Wine.filter({ winery_name: currentWinery.name });
      setWines(winesData);

      // Carica statistiche ordini
      await loadOrderStats(); // Call loadOrderStats without argument as it now uses user from context

    } catch (e) {
      console.error("Error loading winery data:", e);
      setError("Errore nel caricamento dei dati della cantina.");
    } finally {
      setIsLoading(false);
    }
  }, [user, isUserLoading, loadOrderStats]); // Added loadOrderStats to dependencies

  useEffect(() => {
    loadWineryData();
  }, [loadWineryData]);


  const handleWineryUpdate = (updatedWinery) => {
    setWinery(updatedWinery);
  };

  if (isUserLoading || isLoading) {
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
        <Button onClick={() => navigate(createPageUrl("Home"))} className="mt-4">Torna alla Home</Button>
      </div>
    );
  }
  
  if (!winery) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold">Caricamento Dati</h2>
            <p className="text-gray-600 max-w-md">Attendere, stiamo caricando i dati della cantina...</p>
        </div>
      )
  }

  return (
    <RoleGuard allow={["winery_owner", "winery_manager", "winery_editor"]}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold">🏛️ PANNELLO CANTINA</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{winery.name}</h1>
                <p className="text-gray-600">Benvenuto, {user.full_name}. Gestisci la tua cantina da qui.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">La tua cantina</p>
                <p className="font-semibold text-green-700">{winery.region}</p>
                {/* Badge ordini nuovi */}
                {pendingOrders > 0 && (
                  <div className="mt-2">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
                      🔔 {pendingOrders} nuovi ordini
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          <Tabs defaultValue="vetrina" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="vetrina">
                <Info className="w-4 h-4 mr-2" /> Vetrina
              </TabsTrigger>
              <TabsTrigger value="prodotti">
                <WineIcon className="w-4 h-4 mr-2" /> I Miei Vini
              </TabsTrigger>
              <TabsTrigger value="ordini">
                <ShoppingCart className="w-4 h-4 mr-2" /> 
                Ordini
                {pendingOrders > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingOrders}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="eventi">
                <Calendar className="w-4 h-4 mr-2" /> Eventi
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart className="w-4 h-4 mr-2" /> Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vetrina">
              <WineryInfoEditor winery={winery} onUpdate={handleWineryUpdate} />
            </TabsContent>

            <TabsContent value="prodotti">
              <WineManager winery={winery} />
            </TabsContent>

            <TabsContent value="ordini">
              <EnhancedWineryOrdersTab />
            </TabsContent>

            <TabsContent value="eventi">
              <EventManager winery={winery} />
            </TabsContent>

            <TabsContent value="analytics">
              <WineryAnalytics winery={winery} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  );
}

// Nuovo componente completo per la tab ordini con tutte le funzionalità
function EnhancedWineryOrdersTab() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [myOrderItems, setMyOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadWineryOrders = useCallback(async () => {
    if (!user?.winery_id) {
        setLoading(false); 
        return;
    }
    
    try {
      const { Order, OrderItem } = await import("@/api/entities");
      
      // Carica tutti gli ordini e i loro items
      const allOrders = await Order.list('-created_date');
      const allOrderItems = await OrderItem.list();
      
      // Filtra gli order items che appartengono alla mia cantina
      const myItems = allOrderItems.filter(item => {
        return item.winery_id === user.winery_id || 
               item.winery_name?.includes('Mock') // Fallback per dati demo
      });
      
      // Trova gli ordini che contengono i miei prodotti
      // Create a set of unique order IDs that contain items from this winery
      const myOrderIds = new Set(myItems.map(item => item.order_id));
      const myOrders = allOrders.filter(order => myOrderIds.has(order.id));
      
      setOrders(myOrders);
      setMyOrderItems(myItems);
      
      // Calcola le statistiche
      const totalRevenue = myItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      const pendingOrdersCount = myOrders.filter(order => 
        order.status === 'paid' || order.status === 'pending_payment'
      ).length; // Count orders that are paid or pending payment, meaning they need action
      
      setStats({
        totalOrders: myOrders.length,
        totalRevenue,
        pendingOrders: pendingOrdersCount
      });
      
    } catch (error) {
      console.error("Error loading winery orders:", error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadWineryOrders();
  }, [loadWineryOrders]);

  const handleMarkAsShipped = async (orderId, carrier, trackingNumber) => {
    try {
      const { Order } = await import("@/api/entities");
      await Order.update(orderId, {
        status: 'shipped',
        shipping_details: {
          carrier,
          tracking_number: trackingNumber,
          shipped_date: new Date().toISOString()
        }
      });
      await loadWineryOrders(); // Reload data to reflect changes
      setIsShippingModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error marking order as shipped:", error);
      alert("Si è verificato un errore durante l'aggiornamento dell'ordine.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending_payment': { color: 'bg-yellow-100 text-yellow-800', text: 'In Attesa Pagamento' },
      'paid': { color: 'bg-blue-100 text-blue-800', text: 'Pagato - Da Spedire' },
      'shipped': { color: 'bg-purple-100 text-purple-800', text: 'Spedito' },
      'delivered': { color: 'bg-green-100 text-green-800', text: 'Consegnato' },
      'cancelled': { color: 'bg-red-100 text-red-800', text: 'Annullato' },
      'refunded': { color: 'bg-gray-100 text-gray-800', text: 'Rimborsato' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status }; // Default for unknown status
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getOrderItems = (orderId) => {
    return myOrderItems.filter(item => item.order_id === orderId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiche Rapide */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ordini Totali</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ricavi Totali</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Da Gestire</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista Ordini */}
      <Card className="bg-white border border-green-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                I Miei Ordini
              </CardTitle>
              <CardDescription>
                Gestisci gli ordini contenenti i tuoi vini
              </CardDescription>
            </div>
            <Button onClick={loadWineryOrders} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Aggiorna
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun ordine ancora</h3>
              <p className="text-gray-600">I tuoi ordini appariranno qui quando i clienti acquisteranno i tuoi vini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 10).map(order => {
                const orderItems = getOrderItems(order.id);
                const orderTotal = orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
                
                return (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">Ordine #{order.id.slice(-8)}</h4>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-600">{order.user_email}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_date).toLocaleDateString('it-IT')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">€{orderTotal.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{orderItems.length} {orderItems.length === 1 ? 'vino' : 'vini'}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h5 className="text-sm font-medium text-gray-700">I tuoi prodotti:</h5>
                          <div className="space-y-1">
                            {orderItems.map(item => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.wine_name} x{item.quantity}</span>
                                <span className="font-medium">€{item.subtotal?.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => { setSelectedOrder(order); setIsDetailsModalOpen(true); }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Dettagli
                          </Button>
                          {order.status === 'paid' && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => { setSelectedOrder(order); setIsShippingModalOpen(true); }}
                            >
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Spedisci
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Dettagli Ordine */}
      {selectedOrder && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Dettagli Ordine #{selectedOrder.id.slice(-8)}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Informazioni Cliente */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Email:</strong> {selectedOrder.user_email}</p>
                    <p><strong>Nome:</strong> {selectedOrder.shipping_address?.full_name || 'N/A'}</p>
                    <p><strong>Data Ordine:</strong> {new Date(selectedOrder.created_date).toLocaleDateString('it-IT')}</p>
                    <p className="flex items-center gap-2"><strong>Stato:</strong> {getStatusBadge(selectedOrder.status)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Indirizzo di Spedizione</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p>{selectedOrder.shipping_address?.street || 'N/A'}</p>
                    <p>{selectedOrder.shipping_address?.city || 'N/A'} {selectedOrder.shipping_address?.postal_code || ''}</p>
                    <p>{selectedOrder.shipping_address?.province || ''}, {selectedOrder.shipping_address?.country || ''}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Dettagli Spedizione se spedito */}
              {selectedOrder.status === 'shipped' && selectedOrder.shipping_details && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dettagli Spedizione</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Corriere:</strong> {selectedOrder.shipping_details.carrier || 'N/A'}</p>
                    <p><strong>Tracking:</strong> {selectedOrder.shipping_details.tracking_number || 'N/A'}</p>
                    <p><strong>Data Spedizione:</strong> {new Date(selectedOrder.shipping_details.shipped_date).toLocaleDateString('it-IT')}</p>
                  </CardContent>
                </Card>
              )}

              {/* I Miei Prodotti in questo Ordine */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">I Miei Vini in questo Ordine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getOrderItems(selectedOrder.id).length === 0 ? (
                      <p className="text-center text-gray-500">Nessun prodotto della tua cantina in questo ordine.</p>
                    ) : (
                      getOrderItems(selectedOrder.id).map(item => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{item.wine_name}</p>
                            <p className="text-sm">Quantità: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">€{item.subtotal?.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">€{item.price_per_item?.toFixed(2)} cad.</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Segna come Spedito */}
      {selectedOrder && (
        <Dialog open={isShippingModalOpen} onOpenChange={setIsShippingModalOpen}>
          <MarkAsShippedModal 
            order={selectedOrder} 
            onConfirm={handleMarkAsShipped} 
            onClose={() => setIsShippingModalOpen(false)} 
          />
        </Dialog>
      )}
    </div>
  );
}

// Componente Modal per segnare come spedito
function MarkAsShippedModal({ order, onConfirm, onClose }) {
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleConfirm = () => {
    if (!carrier.trim() || !trackingNumber.trim()) {
      alert("Per favore, inserisci sia il corriere che il numero di tracking.");
      return;
    }
    onConfirm(order.id, carrier.trim(), trackingNumber.trim());
  };
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Segna Ordine #{order.id.slice(-8)} come Spedito</DialogTitle>
        <DialogDescription>
          Inserisci i dettagli della spedizione. Il cliente verrà notificato.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="carrier">Corriere</Label>
          <Input 
            id="carrier" 
            value={carrier} 
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="Es. BRT, DHL, GLS, Poste Italiane"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trackingNumber">Numero di Tracking</Label>
          <Input 
            id="trackingNumber" 
            value={trackingNumber} 
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Numero di tracking del pacco"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Annulla</Button>
        <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          Conferma Spedizione
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
