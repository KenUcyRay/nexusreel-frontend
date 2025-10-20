import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import Toast from '../ui/Toast';
import MovieForm from './MovieForm';

const MovieManagement = ({ onMovieChange }) => {
    const { user, logout } = useAuthContext();
    const { toast, showToast, hideToast } = useToast();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await api.get('/api/admin/movies');
            setMovies(response.data);
        } catch (error) {
            showToast('Failed to fetch movies', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            try {
                await api.delete(`/api/admin/movies/${id}`);
                setMovies(movies.filter(movie => movie.id !== id));
                showToast('Movie deleted successfully', 'success');
                onMovieChange?.(); // Notify parent of change
            } catch (error) {
                showToast('Failed to delete movie', 'error');
            }
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (status === 'live_now') {
            return `${baseClasses} bg-green-100 text-green-800`;
        }
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    };

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || movie.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Movie Management</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                                <option value="all">All Status</option>
                                <option value="live_now">Live Now</option>
                                <option value="coming_soon">Coming Soon</option>
                            </select>
                        </div>
                    </div>

                    {/* Add Movie Button */}
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Movie
                    </button>
                </div>

                {/* Movies Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Movie
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Genre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMovies.map((movie) => (
                                <tr key={movie.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-16 w-24">
                                                <img
                                                    className="h-16 w-24 object-cover rounded"
                                                    src={movie.image ? `http://localhost:8000/storage/${movie.image}` : '/placeholder-movie.jpg'}
                                                    alt={movie.name}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {movie.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {movie.genre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDuration(movie.duration)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={getStatusBadge(movie.status)}>
                                            {movie.status === 'live_now' ? 'Live Now' : 'Coming Soon'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingMovie(movie)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(movie.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredMovies.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No movies found
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Movie Modal */}
            {(showCreateForm || editingMovie) && (
                <MovieForm
                    movie={editingMovie}
                    onClose={() => {
                        setShowCreateForm(false);
                        setEditingMovie(null);
                    }}
                    onSave={(savedMovie) => {
                        if (editingMovie) {
                            setMovies(movies.map(m => m.id === savedMovie.id ? savedMovie : m));
                        } else {
                            setMovies([...movies, savedMovie]);
                        }
                        onMovieChange?.(); // Notify parent of change
                    }}
                    showToast={showToast}
                />
            )}
            
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
};

export default MovieManagement;