import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import api from '../../utils/api';
import UserForm from './UserForm';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get('/api/admin/users');
            const users = response.data.data || response.data || [];
            setUsers(Array.isArray(users) ? users : []);
        } catch (error) {
            console.error('Failed to load users:', error);
            setUsers([]);
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleSave = () => {
        loadUsers();
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingUser(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/api/admin/users/${id}`);
                showToast('User deleted successfully', 'success');
                await loadUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
                showToast('Failed to delete user', 'error');
            }
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingUser(null);
    };

    const getRoleBadge = (role) => {
        const colors = {
            admin: 'bg-red-100 text-red-700 border-red-200',
            owner: 'bg-purple-100 text-purple-700 border-purple-200',
            kasir: 'bg-blue-100 text-blue-700 border-blue-200',
            user: 'bg-green-100 text-green-700 border-green-200'
        };
        
        return `px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${colors[role] || colors.user}`;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h2>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-orange-400 hover:to-orange-500 transition-all duration-200 text-sm sm:text-base"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(users) && users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-xs sm:text-sm">
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-2 sm:ml-3">
                                                <div className="text-xs sm:text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="sm:hidden text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                        <span className={getRoleBadge(user.role)}>
                                            {user.role?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 sm:space-x-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                        >
                                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                        >
                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!Array.isArray(users) || users.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                        No users found
                    </div>
                )}
            </div>

            {/* User Form Modal */}
            {showForm && (
                <UserForm
                    user={editingUser}
                    onClose={handleCloseForm}
                    onSave={handleSave}
                    showToast={showToast}
                />
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 text-sm sm:text-base ${
                    toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default UserManagement;