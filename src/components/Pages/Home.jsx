import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Film, Star, Play, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from "../ui/Footer";
import Navbar from "../ui/navbar";

// Mock data for movies
const nowPlayingMovies = [
  {
    id: 1,
    title: "Spiderman: No Way Home",
    genre: "Action, Adventure",
    rating: 8.5,
    duration: "148 min",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=400&fit=crop"
  },
  {
    id: 2,
    title: "The Batman",
    genre: "Action, Crime",
    rating: 8.2,
    duration: "176 min",
    poster: "https://images.unsplash.com/photo-1509347528160-9329d33b2588?w=300&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Top Gun: Maverick",
    genre: "Action, Drama",
    rating: 8.7,
    duration: "130 min",
    poster: "https://images.unsplash.com/photo-1489599663989-1bb2b8b91ed5?w=300&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Doctor Strange 2",
    genre: "Action, Fantasy",
    rating: 7.8,
    duration: "126 min",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop"
  }
];

const comingSoonMovies = [
  {
    id: 5,
    title: "Avatar: The Way of Water",
    genre: "Adventure, Sci-Fi",
    releaseDate: "16 Dec 2024",
    duration: "192 min",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop"
  },
  {
    id: 6,
    title: "Black Panther 2",
    genre: "Action, Adventure",
    releaseDate: "11 Nov 2024",
    duration: "161 min",
    poster: "https://images.unsplash.com/photo-1594736797933-d0d6a7d80a68?w=300&h=400&fit=crop"
  },
  {
    id: 7,
    title: "The Flash",
    genre: "Action, Adventure",
    releaseDate: "16 Jun 2024",
    duration: "144 min",
    poster: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=300&h=400&fit=crop"
  },
  {
    id: 8,
    title: "Aquaman 2",
    genre: "Action, Adventure",
    releaseDate: "20 Dec 2024",
    duration: "124 min",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=400&fit=crop"
  }
];

const carouselMovies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    description: "Setelah peristiwa menghancurkan dari Avengers: Infinity War, alam semesta dalam kehancuran. Dengan bantuan dari sekutu yang tersisa, para Avengers berkumpul sekali lagi untuk membalikkan tindakan Thanos dan memulihkan keseimbangan alam semesta.",
    backdrop: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=1920&h=800&fit=crop",
    genre: "Action, Adventure, Drama"
  },
  {
    id: 2,
    title: "Dune: Part One",
    description: "Kisah epik tentang Paul Atreides, seorang pemuda brilian dan berbakat yang lahir untuk takdir besar di luar pemahamannya, yang harus melakukan perjalanan ke planet paling berbahaya di alam semesta.",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=800&fit=crop",
    genre: "Sci-Fi, Adventure, Drama"
  },
  {
    id: 3,
    title: "The Matrix Resurrections",
    description: "Neo hidup kehidupan yang tampaknya biasa di San Francisco di mana terapis Dr. Anderson meresepkan pil biru. Sampai Morpheus menawarkan pil merah dan membuka pikiran Neo sekali lagi.",
    backdrop: "https://images.unsplash.com/photo-1489599663989-1bb2b8b91ed5?w=1920&h=800&fit=crop",
    genre: "Action, Sci-Fi"
  }
];



export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    // Auto carousel
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselMovies.length);
    }, 4000); // Auto scroll setiap 4 detik
    
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselMovies.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselMovies.length) % carouselMovies.length);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
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
                      <h1 className="text-5xl md:text-7xl font-bold mb-4">{movie.title}</h1>
                      <p className="text-lg md:text-xl mb-2 text-gray-300">{movie.genre}</p>
                      <p className="text-lg mb-8 leading-relaxed">{movie.description}</p>
                      <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        <Play className="w-5 h-5 mr-2" />
                        Watch Trailer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
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

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8" data-aos="fade-up">
            <a
              href="/booking"
              className="flex items-center px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              <Calendar className="w-6 h-6 mr-3" />
              Booking
            </a>
            <a
              href="/movies"
              className="flex items-center px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 rounded-xl font-semibold hover:border-[#FFA500] hover:text-[#FFA500] transition-colors shadow-lg"
            >
              <Film className="w-6 h-6 mr-3" />
              Movies
            </a>
          </div>
        </div>
      </section>

      {/* Now Playing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12" data-aos="fade-up">Now Playing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nowPlayingMovies.map((movie, index) => (
              <div 
                key={movie.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-semibold">{movie.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{movie.title}</h3>
                  <p className="text-gray-600 mb-2">{movie.genre}</p>
                  <p className="text-gray-500 text-sm mb-4">{movie.duration}</p>
                  <button className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12" data-aos="fade-up">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {comingSoonMovies.map((movie, index) => (
              <div 
                key={movie.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg">
                    <span className="text-sm font-semibold">Coming Soon</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{movie.title}</h3>
                  <p className="text-gray-600 mb-2">{movie.genre}</p>
                  <p className="text-gray-500 text-sm mb-2">{movie.duration}</p>
                  <p className="text-[#FFA500] font-semibold mb-4">Release: {movie.releaseDate}</p>
                  <button className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    Notify Me
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8" data-aos="fade-up">Follow Us</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Ikuti akun media sosial kami untuk mendapatkan update film terbaru, promo menarik, dan berita terkini dari Nexus Cinema.
          </p>
          <div className="flex justify-center space-x-8" data-aos="fade-up" data-aos-delay="200">
            <a
              href="#"
              className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Facebook className="w-8 h-8" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-16 h-16 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors shadow-lg"
            >
              <Instagram className="w-8 h-8" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-16 h-16 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors shadow-lg"
            >
              <Twitter className="w-8 h-8" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
            >
              <Youtube className="w-8 h-8" />
            </a>
          </div>
        </div>
      </section>

      {/* Uncomment this when you have the Footer component */}
      {/* <Footer /> */}
    </div>
  );
}