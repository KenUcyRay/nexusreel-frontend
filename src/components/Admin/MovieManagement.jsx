import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../utils/api';
import { Plus, Edit, Trash2, Eye, Search, Filter, Film, Settings } from 'lucide-react';
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
            let movies = [];
            
            // Handle different response structures
            if (Array.isArray(response.data)) {
                movies = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                movies = response.data.data;
            } else {
                console.warn('Unexpected API response structure:', response.data);
                movies = [];
            }
            
            setMovies(movies);
        } catch (error) {
            console.error('Failed to fetch movies:', error);
            setMovies([]);
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
        const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
        if (status === 'live_now') {
            return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
        }
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
    };

    const filteredMovies = Array.isArray(movies) ? movies.filter(movie => {
        const matchesSearch = movie && movie.name && movie.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || movie.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) : [];

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Movies Collection</h2>
                                <p className="text-gray-600">Manage your cinema's movie catalog</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search movies..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-3 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {/* Filter */}
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="live_now">Live Now</option>
                                        <option value="coming_soon">Coming Soon</option>
                                    </select>
                                </div>

                                {/* Add Movie Button */}
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className=" bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-lg hover:from-orange-400 hover:to-orange-400 flex items-center gap-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Movie
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Movie
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Genre
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Duration
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredMovies.map((movie, index) => (
                                    <tr key={movie.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-20 w-32">
                                                    <img
                                                        className="h-20 w-32 object-cover rounded-lg shadow-md border border-gray-200"
                                                        src={movie.image ? `http://localhost:8000/storage/${movie.image}` : '/placeholder-movie.jpg'}
                                                        alt={movie.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900 mb-1">
                                                        {movie.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {movie.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{movie.genre}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{formatDuration(movie.duration)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={getStatusBadge(movie.status)}>
                                                {movie.status === 'live_now' ? 'Live Now' : 'Coming Soon'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => setEditingMovie(movie)}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                    title="Edit Movie"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(movie.id)}
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                    title="Delete Movie"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredMovies.length === 0 && (
                            <div className="text-center py-12">
                                <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No movies found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
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