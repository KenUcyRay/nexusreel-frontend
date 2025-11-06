import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SimpleLogout from '../SimpleLogout';
import api from '../../utils/api';

const CashierDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('schedules');
    
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch schedules
            const schedulesResponse = await api.get('/api/schedules');
            setSchedules(schedulesResponse.data.data || []);
            
            // Fetch food items
            const foodResponse = await api.get('/api/foods');
            const foods = foodResponse.data.data || [];
            setFoodItems(foods.filter(item => item.is_active));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const formatTime = (timeString) => {
        return timeString.slice(0, 5);
    };

    const addToCart = (item, quantity = 1) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map(cartItem => 
                cartItem.id === item.id 
                    ? { ...cartItem, quantity: cartItem.quantity + quantity }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity }]);
        }
    };

    const updateCartQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            setCart(cart.filter(item => item.id !== itemId));
            return;
        }
        setCart(cart.map(cartItem => 
            cartItem.id === itemId 
                ? { ...cartItem, quantity: newQuantity }
                : cartItem
        ));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleBooking = (schedule) => {
        navigate(`/booking/${schedule.id}`);
    };

    const handleFoodCheckout = () => {
        if (cart.length === 0) return;
        
        const orderData = {
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalPrice: getTotalPrice()
        };
        
        navigate('/food-payment', { state: orderData });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Cashier Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {user?.name || 'Cashier'}</span>
                            <SimpleLogout />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6 max-w-md">
                    <button
                        onClick={() => setActiveTab('schedules')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'schedules'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Movie Schedules
                    </button>
                    <button
                        onClick={() => setActiveTab('food')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'food'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Food & Drinks
                    </button>
                </div>

                {activeTab === 'schedules' ? (
                    /* Schedules Tab */
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Schedules</h2>
                        <div className="grid gap-4">
                            {schedules.map((schedule) => (
                                <div key={schedule.id} className="bg-white rounded-lg shadow p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {schedule.movie?.title || 'Unknown Movie'}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {formatDate(schedule.show_date)}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {formatTime(schedule.show_time)}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {schedule.studio?.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-gray-900 mb-2">
                                                Rp {parseInt(schedule.price || 0).toLocaleString('id-ID')}
                                            </div>
                                            <button
                                                onClick={() => handleBooking(schedule)}
                                                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Food Tab */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Food & Beverages</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {foodItems.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg shadow p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                                <p className="text-xl font-bold text-gray-900">Rp{parseInt(item.price || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        
                                        {cart.find(cartItem => cartItem.id === item.id) ? (
                                            <div className="flex items-center justify-between bg-gray-50 rounded-full p-2">
                                                <button
                                                    onClick={() => updateCartQuantity(item.id, cart.find(cartItem => cartItem.id === item.id).quantity - 1)}
                                                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="mx-4 font-semibold">
                                                    {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                                </span>
                                                <button
                                                    onClick={() => updateCartQuantity(item.id, cart.find(cartItem => cartItem.id === item.id).quantity + 1)}
                                                    className="w-8 h-8 rounded-full bg-[#FFA500] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-full py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                                <div className="flex items-center mb-4">
                                    <ShoppingCart className="w-5 h-5 text-gray-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Cart</h3>
                                </div>

                                {cart.length === 0 ? (
                                    <div className="text-center py-8">
                                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">Cart is empty</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3 mb-4">
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-lg font-semibold">Total</span>
                                                <span className="text-xl font-bold text-[#FFA500]">Rp {getTotalPrice().toLocaleString()}</span>
                                            </div>
                                            
                                            <button
                                                onClick={handleFoodCheckout}
                                                className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashierDashboard;