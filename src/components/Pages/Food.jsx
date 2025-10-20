import React, { useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Navbar from "../ui/MainNavbar";

const foodItems = [
  {
    id: 1,
    name: "Paket 121.000",
    description: "1 Popcorn Mix (M) + Soft Drink (L) / XXI Java Tea Special (L)",
    price: 121000,
    image: "/api/placeholder/150/120"
  },
  {
    id: 2,
    name: "Combo A Special",
    description: "1 Popcorn Salt Small + 1 Soft Drink/XXI Java Tea Small + 1 Extra Lychee Jelly",
    price: 50000,
    image: "/api/placeholder/150/120"
  },
  {
    id: 3,
    name: "Combo A",
    description: "Popcorn Small Salt + XXI Java Tea/Soft Drink Small",
    price: 45000,
    image: "/api/placeholder/150/120"
  },
  {
    id: 4,
    name: "Combo B Special",
    description: "1 Popcorn Sweet Glaze Small + 1 Soft Drink/XXI Java Tea Small + 1 Extra Lychee Jelly",
    price: 55000,
    image: "/api/placeholder/150/120"
  },
  {
    id: 5,
    name: "Combo B",
    description: "Popcorn Sweet Glaze Small + Soft Drink Small",
    price: 48000,
    image: "/api/placeholder/150/120"
  },
  {
    id: 6,
    name: "Combo C Special",
    description: "1 Popcorn Caramel Small + 1 Soft Drink Small + 1 Extra Lychee Jelly",
    price: 52000,
    image: "/api/placeholder/150/120"
  }
];

export default function Food() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Food Items */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Food & Beverages</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {foodItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                        <p className="text-2xl font-bold text-gray-800 mb-4">Rp{item.price.toLocaleString()}</p>
                      </div>
                      <div className="w-24 h-20 bg-gray-200 rounded-lg ml-4 flex items-center justify-center">
                        <div className="text-xs text-gray-500 text-center">Food Image</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-[#FFA500] hover:text-[#FFA500] transition-colors"
                    >
                      Tambah
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
                <div className="flex items-center mb-6">
                  <ShoppingCart className="w-6 h-6 text-gray-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-800">Keranjang Saya</h2>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Yuk, isi keranjangmu!</h3>
                    <p className="text-gray-600 text-sm">Tambah cemilan yang mau dipesan, nanti akan muncul di sini.</p>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium text-gray-800">Rp{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">{getTotalItems()} item dipilih</span>
                    <span className="text-2xl font-bold text-gray-800">Rp {getTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <button
                    disabled={cart.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}