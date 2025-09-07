import React from 'react';
import { useCart } from './CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';

export default function CartFlyout() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setIsCartOpen(false)}>
      <div 
        className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center">
            <ShoppingCart className="w-6 h-6 mr-3 text-red-800" />
            Il Mio Carrello ({cartCount})
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Lista Articoli */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Il tuo carrello è vuoto</h3>
            <p className="text-gray-500">Inizia ad esplorare i nostri vini!</p>
            <Button onClick={() => setIsCartOpen(false)} className="mt-6">Continua lo shopping</Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-start space-x-4">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-contain border rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.winery_name}</p>
                  <p className="font-bold text-red-800 mt-1">€{item.price.toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-full">
                      <Button size="icon" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-4 h-4" /></Button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <Button size="icon" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Subtotale</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500">Spedizione e tasse verranno calcolate al checkout.</p>
            <Link to={createPageUrl("Checkout")} onClick={() => setIsCartOpen(false)} className="block">
              <Button size="lg" className="w-full bg-red-800 hover:bg-red-900 text-white">
                Vai al Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}