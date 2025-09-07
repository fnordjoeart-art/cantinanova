
import React, { useState, useEffect, useCallback } from "react";
import { Order, OrderItem } from "@/api/entities";
import { useUser } from "../components/auth/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Package, RefreshCw, Truck, DollarSign, ShoppingBag, MoreHorizontal } from 'lucide-react';
import RoleGuard from "../components/auth/RoleGuard.js";

function MarkAsShippedModal({ order, onConfirm, onClose }) {
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleConfirm = () => {
    if (!carrier || !trackingNumber) {
      alert("Per favore, inserisci sia il corriere che il numero di tracking.");
      return;
    }
    onConfirm(order.id, carrier, trackingNumber);
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
              placeholder="Es. BRT, DHL, GLS"
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
            <Truck className="w-4 h-4 mr-2" />
            Conferma Spedizione
          </Button>
        </DialogFooter>
      </DialogContent>
  );
}

export default function WineryOrders() {
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
      setLoading(false); // Ensure loading is false if no winery_id
      return;
    }
    
    try {
      // Carica tutti gli ordini e i loro items
      const allOrders = await Order.list('-created_date');
      const allOrderItems = await OrderItem.list();
      
      // Filtra gli order items che appartengono alla mia cantina
      // Usiamo il codice cantina per filtrare (dal winery_id che in realtà è il codice)
      const myItems = allOrderItems.filter(item => {
        // Confronta usando il codice cantina
        return item.winery_id === user.winery_id || 
               item.winery_name?.includes('Mock') // Fallback per dati demo
      });
      
      // Trova gli ordini che contengono i miei prodotti
      const myOrderIds = [...new Set(myItems.map(item => item.order_id))];
      const myOrders = allOrders.filter(order => myOrderIds.includes(order.id));
      
      setOrders(myOrders);
      setMyOrderItems(myItems);
      
      // Calcola le statistiche
      const totalRevenue = myItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      const pendingOrders = myOrders.filter(order => order.status === 'paid').length; // Only 'paid' orders are pending shipment from winery perspective
      
      setStats({
        totalOrders: myOrders.length,
        totalRevenue,
        pendingOrders
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
      await Order.update(orderId, {
        status: 'shipped',
        shipping_details: {
          carrier,
          tracking_number: trackingNumber,
          shipped_date: new Date().toISOString()
        }
      });
      loadWineryOrders();
      setIsShippingModalOpen(false);
    } catch (error) {
      console.error("Error marking order as shipped:", error);
      alert("Si è verificato un errore durante l'aggiornamento dell'ordine.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending_payment': { color: 'bg-yellow-100 text-yellow-800', text: 'In Attesa Pagamento' },
      'paid': { color: 'bg-blue-100 text-blue-800', text: 'Pagato' },
      'shipped': { color: 'bg-purple-100 text-purple-800', text: 'Spedito' },
      'delivered': { color: 'bg-green-100 text-green-800', text: 'Consegnato' },
      'cancelled': { color: 'bg-red-100 text-red-800', text: 'Annullato' },
      'refunded': { color: 'bg-gray-100 text-gray-800', text: 'Rimborsato' }
    };
    
    const config = statusConfig[status] || statusConfig['pending_payment'];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getOrderItems = (orderId) => {
    return myOrderItems.filter(item => item.order_id === orderId);
  };

  const OrderDetailsModal = ({ order, items }) => (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Dettagli Ordine #{order.id.slice(-8)}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Informazioni Cliente */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Email:</strong> {order.user_email}</p>
              <p><strong>Nome:</strong> {order.shipping_address?.full_name}</p>
              <p><strong>Data Ordine:</strong> {new Date(order.created_date).toLocaleDateString('it-IT')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Indirizzo di Spedizione</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p>{order.shipping_address?.street}</p>
              <p>{order.shipping_address?.city} {order.shipping_address?.postal_code}</p>
              <p>{order.shipping_address?.province}, {order.shipping_address?.country}</p>
              {order.shipping_details?.carrier && (
                <p><strong>Corriere:</strong> {order.shipping_details.carrier}</p>
              )}
              {order.shipping_details?.tracking_number && (
                <p><strong>Tracking:</strong> {order.shipping_details.tracking_number}</p>
              )}
              {order.shipping_details?.shipped_date && (
                <p><strong>Data Spedizione:</strong> {new Date(order.shipping_details.shipped_date).toLocaleDateString('it-IT')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* I Miei Prodotti in questo Ordine */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">I Miei Vini in questo Ordine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.wine_name}</p>
                    <p className="text-sm">Quantità: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{item.subtotal?.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">€{item.price_per_item?.toFixed(2)} cad.</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );

  return (
    <RoleGuard allow={["winery_owner", "winery_manager", "winery_editor"]}>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">I Miei Ordini</h1>
            <p className="text-gray-600">Gestisci gli ordini dei tuoi vini</p>
          </div>
          <Button onClick={loadWineryOrders} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
        </div>

        {/* Statistiche Rapide */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ordini Totali</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fatturato Totale</p>
                  <p className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Da Spedire</p>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                </div>
                <Package className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabella Ordini */}
        <Card>
          <CardHeader>
            <CardTitle>Elenco Ordini</CardTitle>
            <CardDescription>
              Ordini che includono i vini della tua cantina
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Caricamento ordini...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun ordine ancora</h3>
                <p className="text-gray-600">Gli ordini dei tuoi vini appariranno qui</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>ID Ordine</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>I Miei Prodotti</TableHead>
                      <TableHead>Mio Guadagno</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead className="text-center">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(order => {
                      const orderItems = getOrderItems(order.id);
                      const myRevenue = orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
                      
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono">#{order.id.slice(-8)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.shipping_address?.full_name}</p>
                              <p className="text-sm text-gray-600">{order.user_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(order.created_date).toLocaleDateString('it-IT')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{orderItems.length} vini</Badge>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">€{myRevenue.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => { setSelectedOrder(order); setIsDetailsModalOpen(true); }}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Vedi Dettagli
                                </DropdownMenuItem>
                                {order.status === 'paid' && (
                                  <DropdownMenuItem onSelect={() => { setSelectedOrder(order); setIsShippingModalOpen(true); }}>
                                    <Truck className="w-4 h-4 mr-2 text-green-600" />
                                    Segna come Spedito
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {selectedOrder && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <OrderDetailsModal order={selectedOrder} items={getOrderItems(selectedOrder.id)} />
        </Dialog>
      )}

      {selectedOrder && (
        <Dialog open={isShippingModalOpen} onOpenChange={setIsShippingModalOpen}>
          <MarkAsShippedModal order={selectedOrder} onConfirm={handleMarkAsShipped} onClose={() => setIsShippingModalOpen(false)} />
        </Dialog>
      )}
    </RoleGuard>
  );
}
