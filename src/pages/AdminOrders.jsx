import React, { useState, useEffect } from 'react';
import { Order, OrderItem } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Search, Eye, Package, Truck, CheckCircle, XCircle, RefreshCw, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import RoleGuard from "../components/auth/RoleGuard.js";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersData = await Order.list('-created_date');
      const itemsData = await OrderItem.list();
      setOrders(ordersData);
      setOrderItems(itemsData);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await Order.update(orderId, { status: newStatus });
      loadOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
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
    return orderItems.filter(item => item.order_id === orderId);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const OrderDetailsModal = ({ order, items }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <p><strong>Stato:</strong> {getStatusBadge(order.status)}</p>
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
            </CardContent>
          </Card>
        </div>

        {/* Prodotti Ordinati */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prodotti Ordinati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.wine_name}</p>
                    <p className="text-sm text-gray-600">{item.winery_name}</p>
                    <p className="text-sm">Quantità: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{item.subtotal?.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">€{item.price_per_item?.toFixed(2)} cad.</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 font-bold text-lg">
                <span>Totale</span>
                <span>€{order.total_amount?.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Azioni */}
        <div className="flex flex-wrap gap-3">
          <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending_payment">In Attesa Pagamento</SelectItem>
              <SelectItem value="paid">Pagato</SelectItem>
              <SelectItem value="shipped">Spedito</SelectItem>
              <SelectItem value="delivered">Consegnato</SelectItem>
              <SelectItem value="cancelled">Annullato</SelectItem>
              <SelectItem value="refunded">Rimborsato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <RoleGuard allow={["admin"]}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Link to={createPageUrl("AdminDashboard")} className="mb-6 inline-block">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Dashboard
            </Button>
          </Link>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestione Ordini</h1>
            <p className="text-gray-600 mt-1">
              Visualizza e gestisci tutti gli ordini della piattaforma.
            </p>
          </header>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Elenco Ordini</CardTitle>
                  <CardDescription>
                    {filteredOrders.length} ordini trovati
                  </CardDescription>
                </div>
                <Button onClick={loadOrders} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Aggiorna
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Filtri */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cerca per email, nome cliente o ID ordine..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli stati</SelectItem>
                    <SelectItem value="pending_payment">In Attesa Pagamento</SelectItem>
                    <SelectItem value="paid">Pagato</SelectItem>
                    <SelectItem value="shipped">Spedito</SelectItem>
                    <SelectItem value="delivered">Consegnato</SelectItem>
                    <SelectItem value="cancelled">Annullato</SelectItem>
                    <SelectItem value="refunded">Rimborsato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabella Ordini */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>ID Ordine</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Totale</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Caricamento ordini...
                        </TableCell>
                      </TableRow>
                    ) : filteredOrders.length > 0 ? (
                      filteredOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono">#{order.id.slice(-8)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.shipping_address?.full_name}</p>
                              <p className="text-sm text-gray-600">{order.user_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(order.created_date).toLocaleDateString('it-IT')}</TableCell>
                          <TableCell className="font-medium">€{order.total_amount?.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Dettagli
                                </Button>
                              </DialogTrigger>
                              <OrderDetailsModal order={order} items={getOrderItems(order.id)} />
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Nessun ordine trovato.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}