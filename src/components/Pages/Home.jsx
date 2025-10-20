import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Film, Star, Play, Facebook, Instagram, Twitter, Youtube, BookPlus, Hamburger } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../ui/MainNavbar";
import api from '../../utils/api';
import banner1 from '../../assets/banner1.webp';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpeg';
import banner4 from '../../assets/banner4.jpg';



const carouselMovies = [
  {
    id: 1,
    title: "Demon Slayer: Infinite Castle",
    description: "The final battle begins as Tanjiro and the Hashira infiltrate the Infinity Castle, filled with deadly traps and powerful demons, to face Muzan Kibutsuji once and for all.",
    backdrop: banner1,
    genre: "Action, Fantasy, Adventure"
  },
  {
    id: 2,
    title: "One Piece Film: Red",
    description: "Luffy and the Straw Hat crew attend the concert of world-famous diva Uta, but shocking secrets about her past and her connection to Shanks soon come to light.",
    backdrop: banner2,
    genre: "Adventure, Fantasy, Music"
  },
  {
    id: 3,
    title: "K-Pop Demon Hunter",
    description: "In a world where music fights darkness, a secret girl group of K-pop idols battles demons while keeping their true identities hidden from the public.",
    backdrop: banner3,
    genre: "Action, Fantasy, Music"
  },
  {
    id: 4,
    title: "Suzume",
    description: "A young girl named Suzume discovers a mysterious door that brings disasters across Japan. With the help of a strange traveler, she sets out to close all the doors before chaos spreads.",
    backdrop: banner4,
    genre: "Adventure, Fantasy, Drama"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
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
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    fetchMovies();

    // Auto carousel
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselMovies.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselMovies.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselMovies.length) % carouselMovies.length);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden pt-28 sm:pt-40">
        <div className="relative h-full">
          {carouselMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${movie.backdrop})` }}
              >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl text-white" data-aos="fade-up">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 leading-tight">{movie.title}</h1>
                      <p className="text-base sm:text-lg md:text-xl mb-2 text-gray-300">{movie.genre}</p>
                      <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">{movie.description}</p>
                      <button className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Watch Trailer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>
      {/* Now Playing Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12" data-aos="fade-up">Now Playing</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading movies...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {nowPlayingMovies.map((movie, index) => (
                <div 
                  key={movie.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative">
                    <img
                      src={movie.image ? `http://localhost:8000/storage/${movie.image}` : '/placeholder-movie.jpg'}
                      alt={movie.name}
                      className="w-full h-64 sm:h-72 lg:h-80 object-cover"
                    />
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                      <span className="text-xs sm:text-sm font-semibold">{movie.rating || '8.0'}</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">{movie.name}</h3>
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">{movie.genre}</p>
                    <p className="text-gray-500 text-xs sm:text-sm mb-4">{formatDuration(movie.duration)}</p>
                    <button className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
              {nowPlayingMovies.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No movies currently playing
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12" data-aos="fade-up">Coming Soon</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading movies...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {comingSoonMovies.map((movie, index) => (
                <div 
                  key={movie.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative">
                    <img
                      src={movie.image ? `http://localhost:8000/storage/${movie.image}` : '/placeholder-movie.jpg'}
                      alt={movie.name}
                      className="w-full h-64 sm:h-72 lg:h-80 object-cover"
                    />
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg">
                      <span className="text-xs sm:text-sm font-semibold">Coming Soon</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">{movie.name}</h3>
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">{movie.genre}</p>
                    <p className="text-gray-500 text-xs sm:text-sm mb-2">{formatDuration(movie.duration)}</p>
                    <p className="text-[#FFA500] font-semibold mb-4 text-sm sm:text-base">Release: {movie.release_date || 'TBA'}</p>
                    <button className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base">
                      Watch Trailer
                    </button>
                  </div>
                </div>
              ))}
              {comingSoonMovies.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No upcoming movies
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8" data-aos="fade-up">Follow Us</h2>
          <p className="text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base" data-aos="fade-up" data-aos-delay="100">
           Follow our social media accounts to get the latest movie updates, exciting promotions, and the newest news from Nexus Cinema.
          </p>
          <div className="flex justify-center space-x-4 sm:space-x-6 lg:space-x-8" data-aos="fade-up" data-aos-delay="200">
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Facebook className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors shadow-lg"
            >
              <Instagram className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors shadow-lg"
            >
              <Twitter className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
            >
              <Youtube className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}