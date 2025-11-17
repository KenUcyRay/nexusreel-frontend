import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Percent, DollarSign, Search, Filter } from 'lucide-react';
import api from '../../utils/api';

export default function DiscountManagement() {
  const [discounts, setDiscounts] = useState([]);
  const [movies, setMovies] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage',
    amount: '',
    min_purchase: '',
    valid_start: '',
    valid_end: '',
    is_active: true
  });

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [discountsRes, moviesRes, schedulesRes] = await Promise.all([
        api.get('/api/admin/discounts'),
        api.get('/api/movies'),
        api.get('/api/schedules')
      ]);
      
      setDiscounts(discountsRes.data.data || []);
      setMovies(moviesRes.data.data || []);
      setSchedules(schedulesRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : null
      };

      if (editingDiscount) {
        await api.put(`/api/admin/discounts/${editingDiscount.id}`, payload);
      } else {
        await api.post('/api/admin/discounts', payload);
      }

      fetchData();
      resetForm();
    } catch (error) {
      console.error('Failed to save discount:', error);
      alert('Failed to save discount');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      try {
        await api.delete(`/api/admin/discounts/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete discount:', error);
        alert('Failed to delete discount');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'percentage',
      amount: '',
      min_purchase: '',
      valid_start: '',
      valid_end: '',
      is_active: true
    });
    setEditingDiscount(null);
    setShowModal(false);
  };

  const handleEdit = (discount) => {
    setFormData({
      name: discount.name,
      type: discount.type,
      amount: discount.amount.toString(),
      min_purchase: discount.min_purchase?.toString() || '',
      valid_start: discount.valid_start.split('T')[0],
      valid_end: discount.valid_end.split('T')[0],
      is_active: discount.is_active
    });
    setEditingDiscount(discount);
    setShowModal(true);
  };

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && discount.is_active) ||
                         (statusFilter === 'inactive' && !discount.is_active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF] p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl border border-white/20 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Discount Management</h2>
              <p className="text-sm sm:text-base text-gray-600">Manage promotional discounts and offers</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search discounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-8 sm:pl-10 pr-6 sm:pr-8 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[120px] sm:min-w-[140px] text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Add Discount Button */}
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-orange-400 hover:to-orange-400 flex items-center gap-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Discount</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-gradient-to-br from-white to-[#C6E7FF] shadow-xl rounded-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Valid Period</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredDiscounts.map((discount, index) => (
                <tr key={discount.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{discount.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {discount.type === 'percentage' ? <Percent className="w-4 h-4 mr-2 text-blue-500" /> : <DollarSign className="w-4 h-4 mr-2 text-green-500" />}
                      <span className="text-sm font-medium capitalize">{discount.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {discount.type === 'percentage' ? `${discount.amount}%` : `Rp ${discount.amount.toLocaleString()}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(discount.valid_start).toLocaleDateString()} - {new Date(discount.valid_end).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      discount.is_active 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {discount.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(discount)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Discount"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(discount.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Discount"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredDiscounts.map((discount) => (
          <div key={discount.id} className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-lg border border-white/20 p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{discount.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  {discount.type === 'percentage' ? <Percent className="w-4 h-4 text-blue-500" /> : <DollarSign className="w-4 h-4 text-green-500" />}
                  <span className="text-sm text-gray-600 capitalize">{discount.type}</span>
                  <span className="text-lg font-bold text-gray-900">
                    {discount.type === 'percentage' ? `${discount.amount}%` : `Rp ${discount.amount.toLocaleString()}`}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                discount.is_active 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-red-100 text-red-700 border-red-200'
              }`}>
                {discount.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min Purchase:</span>
                <span className="font-medium">{discount.min_purchase ? `Rp ${discount.min_purchase.toLocaleString()}` : 'No minimum'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valid Period:</span>
                <span className="font-medium text-right">
                  {new Date(discount.valid_start).toLocaleDateString()} - {new Date(discount.valid_end).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => handleEdit(discount)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button
                onClick={() => handleDelete(discount.id)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDiscounts.length === 0 && (
        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-lg border border-white/20 text-center py-12">
          <Percent className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No discounts found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showModal && (
       <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-2xl border border-white/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{editingDiscount ? 'Edit' : 'Add'} Discount</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="nominal">Nominal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount {formData.type === 'percentage' ? '(%)' : '(Rp)'}
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Min Purchase (Rp)</label>
                  <input
                    type="number"
                    value={formData.min_purchase}
                    onChange={(e) => setFormData({...formData, min_purchase: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valid Start</label>
                  <input
                    type="date"
                    value={formData.valid_start}
                    onChange={(e) => setFormData({...formData, valid_start: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Valid End</label>
                  <input
                    type="date"
                    value={formData.valid_end}
                    onChange={(e) => setFormData({...formData, valid_end: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>



              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active Discount
                </label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg hover:from-orange-400 hover:to-orange-400 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  {editingDiscount ? 'Update Discount' : 'Create Discount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}