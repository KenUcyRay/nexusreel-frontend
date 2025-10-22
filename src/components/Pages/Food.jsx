import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Navbar from "../ui/MainNavbar";
import api from '../../utils/api';

export default function Food() {
  const [cart, setCart] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await api.get('/api/foods');
      // Handle both array response and object with data property
      const foods = Array.isArray(response.data) ? response.data : response.data.data || [];
      // Filter only available items
      setFoodItems(foods.filter(item => item.is_available));
    } catch (error) {
      console.error('Failed to fetch food items:', error);
      setFoodItems([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      const transactionData = {
        customer_name: "Guest User", // In real app, get from auth
        customer_email: "guest@example.com", // In real app, get from auth
        items: cart.map(item => ({
          food_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      const response = await api.post('/api/transactions/food', transactionData);
      
      if (response.data.success) {
        setCart([]);
        alert('Order placed successfully!');
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
      alert('Failed to place order. Please try again.');
    }
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
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading food items...</p>
                </div>
              ) : foodItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No food items available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {foodItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                          {item.category && (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              item.category === 'snack' ? 'bg-yellow-100 text-yellow-800' :
                              item.category === 'drink' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.category.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                        <p className="text-2xl font-bold text-gray-800 mb-4">Rp{parseInt(item.price || 0).toLocaleString()}</p>
                      </div>
                      <div className="w-24 h-20 rounded-lg ml-4 overflow-hidden bg-gray-200 flex items-center justify-center">
                        {item.image ? (
                          <img 
                            src={`http://localhost:8000/storage/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA5NiA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNiAzMkg2MFY0OEgzNlYzMloiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                            }}
                          />
                        ) : (
                          <div className="text-xs text-gray-500 text-center">No Image</div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.is_available}
                      className={`w-full py-3 rounded-full font-semibold transition-colors ${
                        item.is_available 
                          ? 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#FFA500] hover:text-[#FFA500]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {item.is_available ? 'Tambah' : 'Tidak Tersedia'}
                    </button>
                  </div>
                  ))}
                </div>
              )}
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
                    onClick={handleCheckout}
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