
import React, { useState, useEffect } from 'react';
import { useCart } from '../components/cart/CartContext';
import { useUser } from '../components/auth/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Wallet, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Order, OrderItem } from '@/api/entities';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    street: '',
    city: '',
    postal_code: '',
    province: '',
    country: 'Italia',
    email: '',
    phone: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // Nuovo stato per il metodo di pagamento

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        ...user.address
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'paypal':
        return 'PayPal';
      case 'klarna':
        return 'Klarna';
      case 'card':
      default:
        return 'Carta di Credito';
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);

    try {
      // 1. Creare l'ordine principale
      const orderData = {
        user_id: user?.id,
        user_email: formData.email,
        total_amount: cartTotal,
        status: 'paid', // Simula pagamento avvenuto
        shipping_address: {
          full_name: formData.full_name,
          street: formData.street,
          city: formData.city,
          postal_code: formData.postal_code,
          province: formData.province,
          country: formData.country,
        },
        payment_details: {
          method: getPaymentMethodName(paymentMethod), // Usa il metodo di pagamento selezionato
          transaction_id: `txn_${Date.now()}`
        },
        notes: formData.notes
      };
      
      const newOrder = await Order.create(orderData);

      // 2. Creare gli articoli dell'ordine
      const orderItemsData = cartItems.map(item => ({
        order_id: newOrder.id,
        wine_id: item.id,
        winery_id: item.winery_id,
        wine_name: item.name,
        winery_name: item.winery_name,
        quantity: item.quantity,
        price_per_item: item.price,
        subtotal: item.price * item.quantity
      }));
      
      await OrderItem.bulkCreate(orderItemsData);

      // 3. Pulire il carrello e reindirizzare
      clearCart();
      navigate(createPageUrl(`OrderConfirmation?orderId=${newOrder.id}`));

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Si è verificato un errore durante la creazione dell'ordine. Riprova.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Modulo Indirizzo e Contatto */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dati di Spedizione e Contatto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input 
                  id="full_name" 
                  value={formData.full_name} 
                  onChange={handleInputChange}
                  required 
                  placeholder="Mario Rossi"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    required 
                    placeholder="mario.rossi@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleInputChange}
                    required 
                    placeholder="+39 333 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Indirizzo *</Label>
                <Input 
                  id="street" 
                  value={formData.street} 
                  onChange={handleInputChange}
                  required 
                  placeholder="Via Roma, 123"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Città *</Label>
                  <Input 
                    id="city" 
                    value={formData.city} 
                    onChange={handleInputChange}
                    required 
                    placeholder="Milano"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">CAP *</Label>
                  <Input 
                    id="postal_code" 
                    value={formData.postal_code} 
                    onChange={handleInputChange}
                    required 
                    placeholder="20100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provincia *</Label>
                  <Input 
                    id="province" 
                    value={formData.province} 
                    onChange={handleInputChange}
                    required 
                    placeholder="MI"
                  />
                </div>
              </div>

              {/* Note del Cliente */}
              <div className="space-y-2">
                <Label htmlFor="notes">Note per la Spedizione (Opzionale)</Label>
                <Textarea 
                  id="notes" 
                  value={formData.notes} 
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Es. Consegnare presso il portiere, citofono al secondo piano, non suonare prima delle 9:00..."
                  className="resize-none"
                />
                <p className="text-sm text-gray-500">
                  Inserisci eventuali istruzioni speciali per la consegna
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Metodo di Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle>Metodo di Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <Label
                  htmlFor="card"
                  className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-red-600 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="w-6 h-6 text-gray-700" />
                  <div className="flex-1">
                    <p className="font-semibold">Carta di Credito / Debito</p>
                    <p className="text-sm text-gray-500">Paga con Visa, Mastercard, AMEX</p>
                  </div>
                </Label>
                
                <Label
                  htmlFor="paypal"
                  className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'paypal' ? 'border-red-600 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Wallet className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-semibold">PayPal</p>
                    <p className="text-sm text-gray-500">Paga in sicurezza con il tuo account PayPal</p>
                  </div>
                </Label>

                <Label
                  htmlFor="klarna"
                  className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'klarna' ? 'border-red-600 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value="klarna" id="klarna" />
                  <Calendar className="w-6 h-6 text-pink-600" />
                  <div className="flex-1">
                    <p className="font-semibold">Klarna</p>
                    <p className="text-sm text-gray-500">Paga in 3 comode rate senza interessi</p>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>


        {/* Riepilogo Ordine */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riepilogo Ordine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name} <span className="text-sm font-normal">x{item.quantity}</span></p>
                    <p className="text-sm text-gray-500">{item.winery_name}</p>
                  </div>
                  <p>€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotale</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Spedizione</span>
                  <span className="text-green-600 font-semibold">Gratuita</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Totale</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Informazioni Spedizione</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Spedizione gratuita per ordini superiori a €50</li>
              <li>• Tempi di consegna: 3-5 giorni lavorativi</li>
              <li>• Riceverai un'email con il tracking appena il pacco sarà spedito</li>
            </ul>
          </div>

          <Button 
            size="lg" 
            className="w-full bg-red-800 hover:bg-red-900 text-white py-3" 
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0 || isProcessing || !formData.full_name || !formData.email || !formData.phone || !formData.street || !formData.city}
          >
            {isProcessing ? "Elaborazione..." : `Paga e Completa Ordine - €${cartTotal.toFixed(2)}`}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Cliccando "Completa Ordine" accetti i nostri Termini di Servizio e la Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
