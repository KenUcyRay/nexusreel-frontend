/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, ArrowLeft, Play, X } from 'lucide-react';
import { useAuthContext } from '../../../contexts/AuthContext';
import Navbar from '../../ui/MainNavbar';
import api from '../../../utils/api';


export default function DetailMovies() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
  const [movie, setMovie] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const [movieResponse, schedulesResponse] = await Promise.all([
        api.get(`/api/movies/${id}`),
        api.get(`/api/schedules/movie/${id}`)
      ]);
      
      const movieData = movieResponse.data.data || movieResponse.data;
      const schedulesData = schedulesResponse.data.data || [];
      
      setMovie(movieData);
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    // Handle different time formats
    try {
      // If it's already in HH:MM format
      if (timeString.match(/^\d{2}:\d{2}$/)) {
        return timeString;
      }
      
      // If it's a full datetime string, extract time
      if (timeString.includes('T')) {
        const time = timeString.split('T')[1].substring(0, 5);
        return time;
      }
      
      // Try parsing as date and extract time
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      return timeString;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString || 'N/A';
    }
  };

  const getRatingDescription = (rating) => {
    const ratings = {
      'G': 'General Audiences - All ages admitted',
      'PG': 'Parental Guidance - Some material may not be suitable for children',
      'PG-13': 'Parents Strongly Cautioned - Some material may be inappropriate for children under 13',
      'R': 'Restricted - Under 17 requires accompanying parent or adult guardian',
      'NC-17': 'Adults Only - No one 17 and under admitted'
    };
    return ratings[rating] || rating;
  };

  const handleWatchTrailer = () => {
    if (movie.trailer_type === 'url' && movie.trailer_url) {
      // Open YouTube/external link in new tab
      window.open(movie.trailer_url, '_blank');
    } else if (movie.trailer_type === 'upload' && movie.trailer_file) {
      // Show video modal for uploaded file
      setShowVideoModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF]">
        <Navbar />
        <div className="pt-32 flex justify-center items-center h-64">
          <div className="text-gray-500">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF]">
        <Navbar />
        <div className="pt-32 flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{error || 'Movie not found'}</p>
            <button 
              onClick={() => navigate('/movies')}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-2 rounded-lg"
            >
              Back to Movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF]">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/movies')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Movies
          </button>

          {/* Movie Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="md:flex">
              {/* Movie Poster */}
              <div className="md:w-1/3">
                <img
                  src={movie.image_url || '/placeholder-movie.jpg'}
                  alt={movie.name}
                  className="w-full h-96 md:h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-movie.jpg';
                  }}
                />
              </div>

              {/* Movie Info */}
              <div className="md:w-2/3 p-8">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{movie.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    movie.status === 'live_now' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {movie.status === 'live_now' ? 'Now Playing' : 'Coming Soon'}
                  </span>
                </div>

                <div className="flex items-center space-x-6 mb-6 text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="font-semibold">{movie.rating || '8.0'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres && movie.genres.length > 0 ? (
                      movie.genres.map(genre => (
                        <span key={genre.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {genre.name}
                        </span>
                      ))
                    ) : (
                      <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                        {movie.genre || 'No genre'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Synopsis</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {movie.description || 'No description available.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Director</h4>
                    <p className="text-gray-700">{movie.director || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Production</h4>
                    <p className="text-gray-700">{movie.production_team || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-1">Rating</h4>
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-800 text-white px-2 py-1 rounded text-sm font-bold">
                        {movie.rating || 'NR'}
                      </span>
                      <span className="text-gray-700 text-sm">
                        {getRatingDescription(movie.rating || 'NR')}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleWatchTrailer}
                  className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>

          {/* Showtimes */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Showtimes</h2>
            
            {schedules.length > 0 ? (
              <div className="grid gap-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="font-semibold text-gray-900">
                            {formatDate(schedule.show_date)}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Clock className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {formatTime(schedule.show_time)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {schedule.studio?.name || 'Studio N/A'} - {schedule.studio?.type || 'Regular'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          Rp {parseInt(schedule.price || 0).toLocaleString('id-ID')}
                        </div>
                        <button 
                          onClick={() => {
                            console.log('🔍 Book Now clicked - Auth check:', { user, isAuthenticated });
                            
                            if (!isAuthenticated || !user) {
                              alert('Please login first to book tickets');
                              navigate('/login');
                              return;
                            }
                            
                            console.log('✅ User authenticated, navigating to booking');
                            navigate(`/booking/${schedule.id}`);
                          }}
                          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Showtimes Available</h3>
                <p className="text-gray-500">
                  {movie.status === 'coming_soon' 
                    ? 'Showtimes will be available soon.' 
                    : 'Please check back later for available showtimes.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal for Uploaded Trailers */}
      {showVideoModal && movie.trailer_file && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="relative bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh]"
              src={`http://localhost:8000/storage/${movie.trailer_file}`}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}