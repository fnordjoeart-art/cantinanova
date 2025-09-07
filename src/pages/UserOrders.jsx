
import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderItem } from '@/api/entities';
import { useUser } from '../components/auth/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Eye, ShoppingBag, RefreshCw } from 'lucide-react';

export default function UserOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserOrders = useCallback(async () => {
    if (!user?.id) {
      setLoading(false); // Set loading to false if no user to avoid infinite loading state
      return;
    }
    
    try {
      setLoading(true); // Set loading to true when starting to fetch
      const userOrders = await Order.filter({ user_id: user.id }, '-created_date');
      const allOrderItems = await OrderItem.list();
      
      setOrders(userOrders);
      setOrderItems(allOrderItems);
    } catch (error) {
      console.error("Error loading user orders:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false after fetch, regardless of success or error
    }
  }, [user]); // Dependency array for useCallback

  useEffect(() => {
    loadUserOrders();
  }, [loadUserOrders]); // Dependency array for useEffect

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
    return orderItems.filter(item => item.order_id === orderId);
  };

  const OrderDetailsModal = ({ order, items }) => (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Ordine #{order.id.slice(-8)}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">Data Ordine</p>
            <p className="font-medium">{new Date(order.created_date).toLocaleDateString('it-IT')}</p>
          </div>
          <div>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prodotti Ordinati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.wine_name}</p>
                    <p className="text-sm text-gray-600">{item.winery_name}</p>
                    <p className="text-sm">Quantità: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{item.subtotal?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 font-bold text-lg border-t">
                <span>Totale</span>
                <span>€{order.total_amount?.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Indirizzo di Spedizione</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p>{order.shipping_address?.full_name}</p>
            <p>{order.shipping_address?.street}</p>
            <p>{order.shipping_address?.city} {order.shipping_address?.postal_code}</p>
            <p>{order.shipping_address?.province}, {order.shipping_address?.country}</p>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Accesso Richiesto</h2>
        <p className="text-gray-600">Devi essere loggato per vedere i tuoi ordini.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">I Miei Ordini</h1>
          <p className="text-gray-600">Gestisci e tieni traccia dei tuoi acquisti</p>
        </div>
        <Button onClick={loadUserOrders} variant="outline" disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Aggiorna
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Caricamento ordini...</div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun ordine ancora</h3>
            <p className="text-gray-600 mb-4">Non hai ancora effettuato acquisti</p>
            <Button>Inizia a Esplorare</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const items = getOrderItems(order.id);
            return (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Ordine #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_date).toLocaleDateString('it-IT')} • {items.length} prodotti
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                      {getStatusBadge(order.status)}
                      <span className="font-semibold">€{order.total_amount?.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Spedito a: {order.shipping_address?.city}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Dettagli
                        </Button>
                      </DialogTrigger>
                      <OrderDetailsModal order={order} items={items} />
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
