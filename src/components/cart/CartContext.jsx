import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Carica il carrello da localStorage all'avvio
    try {
      const localData = localStorage.getItem('cantinanova_cart');
      if (localData) {
        setCartItems(JSON.parse(localData));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      localStorage.removeItem('cantinanova_cart');
    }
  }, []);

  useEffect(() => {
    // Salva il carrello in localStorage ad ogni modifica
    localStorage.setItem('cantinanova_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (wine, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === wine.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === wine.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...wine, quantity }];
    });
    setIsCartOpen(true); // Apre il carrello quando si aggiunge un articolo
  };

  const removeFromCart = (wineId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== wineId));
  };

  const updateQuantity = (wineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(wineId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === wineId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cantinanova_cart');
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};