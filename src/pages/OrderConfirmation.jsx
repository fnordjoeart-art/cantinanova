
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Order, OrderItem } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createPageUrl } from '@/utils';
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderDetails = useCallback(async () => {
    if (!orderId) {
      setLoading(false); // Ensure loading is set to false if no orderId
      return;
    }
    try {
      const orderData = await Order.filter({ id: orderId });
      const itemsData = await OrderItem.filter({ order_id: orderId });
      
      if (orderData.length > 0) {
        setOrder(orderData[0]);
        setOrderItems(itemsData);
      } else {
        setOrder(null); // Explicitly set order to null if not found
        setOrderItems([]);
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      setOrder(null); // Handle error case by setting order to null
      setOrderItems([]);
    }
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Caricamento dettagli ordine...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ordine non trovato</h1>
        <Link to={createPageUrl("Home")}>
          <Button>Torna alla Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header di conferma */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ordine Confermato!</h1>
        <p className="text-lg text-gray-600 mb-2">
          Grazie per il tuo acquisto. Il tuo ordine è stato elaborato con successo.
        </p>
        <p className="text-sm text-gray-500">
          Numero ordine: <span className="font-mono font-semibold">#{order.id.slice(-8).toUpperCase()}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Dettagli ordine */}
        <Card>
          <CardHeader>
            <CardTitle>Dettagli Ordine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b">
                <div>
                  <p className="font-semibold">{item.wine_name}</p>
                  <p className="text-sm text-gray-500">{item.winery_name}</p>
                  <p className="text-sm text-gray-500">Quantità: {item.quantity}</p>
                </div>
                <p className="font-semibold">€{item.subtotal.toFixed(2)}</p>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Totale</span>
                <span>€{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indirizzo di spedizione */}
        <Card>
          <CardHeader>
            <CardTitle>Indirizzo di Spedizione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-semibold">{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.street}</p>
              <p>
                {order.shipping_address.postal_code} {order.shipping_address.city} ({order.shipping_address.province})
              </p>
              <p>{order.shipping_address.country}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline di spedizione */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Stato Spedizione
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold">Confermato</p>
              <p className="text-xs text-gray-500">Oggi</p>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-semibold">Preparazione</p>
              <p className="text-xs text-gray-500">1-2 giorni</p>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                <Truck className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-semibold">Spedizione</p>
              <p className="text-xs text-gray-500">2-3 giorni</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">📦 Il tuo ordine sarà preparato entro 24-48 ore</span>
            </p>
            <p className="text-blue-700 text-sm mt-1">
              Riceverai una email con i dettagli di tracciamento non appena il pacco sarà spedito.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Azioni */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={createPageUrl("Profile")}>
          <Button variant="outline" size="lg">
            Visualizza I Miei Ordini
          </Button>
        </Link>
        <Link to={createPageUrl("Wines")}>
          <Button size="lg" className="bg-red-800 hover:bg-red-900">
            Continua a Comprare
          </Button>
        </Link>
      </div>
    </div>
  );
}
