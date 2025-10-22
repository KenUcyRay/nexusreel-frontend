import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import api from '../../utils/api';
import FoodForm from './FoodForm';

const FoodManagement = () => {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFoods();
    }, []);

    useEffect(() => {
        filterFoods();
    }, [foods, searchTerm, categoryFilter, availabilityFilter]);

    const loadFoods = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/foods');
            setFoods(response.data);
        } catch (error) {
            console.error('Failed to load foods:', error);
            setFoods([]);
            showToast('Failed to load foods', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterFoods = () => {
        let filtered = foods;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(food => 
                food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter(food => food.category === categoryFilter);
        }

        // Availability filter
        if (availabilityFilter !== '') {
            filtered = filtered.filter(food => 
                availabilityFilter === '1' ? food.is_available : !food.is_available
            );
        }

        setFilteredFoods(filtered);
    };

    const getCategoryBadge = (category) => {
        const badges = {
            snack: 'bg-yellow-100 text-yellow-800',
            drink: 'bg-blue-100 text-blue-800',
            combo: 'bg-green-100 text-green-800'
        };
        return badges[category] || 'bg-gray-100 text-gray-800';
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleSave = () => {
        loadFoods();
    };

    const handleEdit = (food) => {
        setEditingFood(food);
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingFood(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this food item?')) {
            try {
                await api.delete(`/api/admin/foods/${id}`);
                showToast('Food item deleted successfully', 'success');
                await loadFoods();
            } catch (error) {
                console.error('Failed to delete food:', error);
                showToast('Failed to delete food item', 'error');
            }
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingFood(null);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Food Management</h2>
                <button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-[#FFA500] hover:to-[#FFD700] transition-all duration-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Food</span>
                </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-64">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search foods..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="min-w-48">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Categories</option>
                            <option value="snack">Snack</option>
                            <option value="drink">Drink</option>
                            <option value="combo">Combo</option>
                        </select>
                    </div>

                    {/* Availability Filter */}
                    <div className="min-w-48">
                        <select
                            value={availabilityFilter}
                            onChange={(e) => setAvailabilityFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="1">Available</option>
                            <option value="0">Unavailable</option>
                        </select>
                    </div>
                </div>
            </div>



            {/* Foods Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading foods...</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredFoods.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        {foods.length === 0 ? 'No foods found' : 'No foods match your filters'}
                                    </td>
                                </tr>
                            ) : (
                                filteredFoods.map((food) => (
                                    <tr key={food.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={food.image ? `http://localhost:8000/storage/${food.image}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkgzMlYzMkgxNlYxNloiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+'}
                                                alt={food.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkgzMlYzMkgxNlYxNloiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{food.name}</div>
                                            {food.description && (
                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                    {food.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(food.category)}`}>
                                                {food.category?.toUpperCase() || 'SNACK'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Rp {parseInt(food.price || 0).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                food.is_available 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {food.is_available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(food)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                                    title="Edit food"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(food.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                                    title="Delete food"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Food Form Modal */}
            {showForm && (
                <FoodForm
                    food={editingFood}
                    onClose={handleCloseForm}
                    onSave={handleSave}
                    showToast={showToast}
                />
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
                    toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default FoodManagement;