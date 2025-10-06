import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Film, Star, Play, Facebook, Instagram, Twitter, Youtube, BookPlus } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../ui/navbar";
import banner1 from '../../assets/banner1.webp';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpeg';
import banner4 from '../../assets/banner4.jpg';
import cm1 from '../../assets/cm1.jpg';
import cm2 from '../../assets/cm2.jpg';
import cm3 from '../../assets/cm3.webp';
import cm4 from '../../assets/cm4.jpeg';
import live1 from '../../assets/live1.webp';
import live2 from '../../assets/live2.jpg';
import live3 from '../../assets/live3.jpg';
import live4 from '../../assets/live4.webp';

// Mock data for movies
const nowPlayingMovies = [
  {
    id: 1,
    title: "(G)I-DLE World Tour [iDOL] IN CINEMAS",
    genre: "Music, Documentary",
    rating: 9.0,
    duration: "120 min",
    poster: live1
  },
  {
    id: 2,
    title: "Omniscient Reader: The Prophecy",
    genre: "Action, Fantasy, Thriller",
    rating: 8.6,
    duration: "137 min",
    poster: live2
  },
  {
    id: 3,
    title: "I, the Executioner",
    genre: "Crime, Thriller, Mystery",
    rating: 8.1,
    duration: "141 min",
    poster: live3
  },
  {
    id: 4,
    title: "Jumbo",
    genre: "Animation, Adventure, Family",
    rating: 7.9,
    duration: "105 min",
    poster: live4
  }
];

const comingSoonMovies = [
  {
    id: 5,
    title: "Kimetsu no Yaiba: Infinite Castle",
    genre: "Action, Fantasy, Adventure",
    releaseDate: "16 Dec 2024",
    duration: "192 min",
    poster: cm1
  },
  {
    id: 6,
    title: "One Piece Film: Red",
    genre: "Adventure, Fantasy, Music",
    releaseDate: "11 Nov 2024",
    duration: "161 min",
    poster: cm2
  },
  {
    id: 7,
    title: "K-Pop Demon Hunter",
    genre: "Action, Fantasy, Music",
    releaseDate: "16 Jun 2024",
    duration: "144 min",
    poster: cm3
  },
  {
    id: 8,
    title: "Suzume",
    genre: "Adventure, Fantasy, Drama",
    releaseDate: "20 Dec 2024",
    duration: "124 min",
    poster: cm4
  }
];

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
      <section className="relative h-screen overflow-hidden pt-32">
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
              href="/movies"
              className="flex items-center px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              <Calendar className="w-6 h-6 mr-3" />
              Movies
            </a>
            <a
              href="/bookings"
              className="flex items-center px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 rounded-xl font-semibold hover:border-[#FFA500] hover:text-[#FFA500] transition-colors shadow-lg"
            >
              < BookPlus className="w-6 h-6 mr-3" />
              Bookings
            </a>
             <a
              href="/studios"
              className="flex items-center px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 rounded-xl font-semibold hover:border-[#FFA500] hover:text-[#FFA500] transition-colors shadow-lg"
            >
              <Film className="w-6 h-6 mr-3" />
              Studios
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
    </div>
  );
}