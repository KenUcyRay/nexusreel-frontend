import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food, quantity = 1) => {
    console.log('🛒 Adding to cart:', food.name, 'x', quantity);
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === food.id);
      if (existing) {
        const updated = prev.map(item => 
          item.id === food.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        console.log('🛒 Updated existing item in cart');
        return updated;
      }
      
      const newCart = [...prev, { ...food, quantity }];
      console.log('🛒 Added new item to cart, total items:', newCart.length);
      return newCart;
    });
  };

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === foodId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (foodId) => {
    console.log('🗑️ Removing from cart:', foodId);
    setCartItems(prev => prev.filter(item => item.id !== foodId));
  };

  const clearCart = () => {
    console.log('🧹 Clearing cart');
    setCartItems([]);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;