import React from 'react';
import { useCart } from './CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CartTrigger() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
        <ShoppingCart className="w-6 h-6" />
      </Button>
      {cartCount > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 bg-red-700 text-white w-5 h-5 flex items-center justify-center p-0"
          onClick={() => setIsCartOpen(true)}
        >
          {cartCount}
        </Badge>
      )}
    </div>
  );
}