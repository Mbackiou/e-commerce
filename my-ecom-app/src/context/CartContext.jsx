import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('hackire_cart');
    const initialData = [
      { id: 1, name: "Grand Boubou Basin Riche", price: 65000, category: "Cérémonie", image: "https://images.unsplash.com/photo-1572495631021-26413a69602e?w=800", quantity: 1 },
      { id: 2, name: "Robe Wax Haute Couture", price: 35000, category: "Soirée", image: "https://images.unsplash.com/photo-1584273010389-9a29633e1443?w=800", quantity: 2 }
    ];
    return savedCart && JSON.parse(savedCart).length > 0 ? JSON.parse(savedCart) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('hackire_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const item = prev.find(i => i.id === productId);
      if (item.quantity > 1) return prev.map(i => i.id === productId ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter((i) => i.id !== productId);
    });
  };

  const clearCart = () => setCart([]);
  const getItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getItemCount, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);