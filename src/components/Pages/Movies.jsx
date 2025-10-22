import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Navbar from "../ui/MainNavbar";
import api from '../../utils/api';



export default function Movies() {
  const [activeTab, setActiveTab] = useState('nowPlaying');
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const response = await api.get('/api/movies');
      const movies = response.data;
      
      setNowPlayingMovies(movies.filter(movie => movie.status === 'live_now'));
      setComingSoonMovies(movies.filter(movie => movie.status === 'coming_soon'));
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Movies</h1>
          
          {/* Tabs */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="bg-white rounded-lg p-1 shadow-md w-full max-w-md">
              <button
                onClick={() => setActiveTab('nowPlaying')}
                className={`w-1/2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-semibold transition-colors text-sm sm:text-base ${
                  activeTab === 'nowPlaying'
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Now Playing
              </button>
              <button
                onClick={() => setActiveTab('comingSoon')}
                className={`w-1/2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-semibold transition-colors text-sm sm:text-base ${
                  activeTab === 'comingSoon'
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* Movies Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading movies...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {(activeTab === 'nowPlaying' ? nowPlayingMovies : comingSoonMovies).map((movie) => (
                <div key={movie.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={movie.image ? `http://localhost:8000/storage/${movie.image}` : '/placeholder-movie.jpg'}
                      alt={movie.name}
                      className="w-full h-64 sm:h-72 lg:h-80 object-cover"
                    />
                    {activeTab === 'nowPlaying' ? (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                        <span className="text-xs sm:text-sm font-semibold">{movie.rating || '8.0'}</span>
                      </div>
                    ) : (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg">
                        <span className="text-xs sm:text-sm font-semibold">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">{movie.name}</h3>
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">{movie.genre}</p>
                    <p className="text-gray-500 text-xs sm:text-sm mb-2">{formatDuration(movie.duration)}</p>
                    {movie.release_date && (
                      <p className="text-[#FFA500] font-semibold mb-4 text-sm sm:text-base">Release: {movie.release_date}</p>
                    )}
                    <button className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-opacity text-sm sm:text-base ${
                      activeTab === 'nowPlaying'
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white hover:opacity-90'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>
                      {activeTab === 'nowPlaying' ? 'Book Now' : 'Notify Me'}
                    </button>
                  </div>
                </div>
              ))}
              {(activeTab === 'nowPlaying' ? nowPlayingMovies : comingSoonMovies).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No {activeTab === 'nowPlaying' ? 'movies currently playing' : 'upcoming movies'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}