import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Navbar from "../ui/navbar";
import live1 from '../../assets/live1.webp';
import live2 from '../../assets/live2.jpg';
import live3 from '../../assets/live3.jpg';
import live4 from '../../assets/live4.webp';
import cm1 from '../../assets/cm1.jpg';
import cm2 from '../../assets/cm2.jpg';
import cm3 from '../../assets/cm3.webp';
import cm4 from '../../assets/cm4.jpeg';

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

export default function Movies() {
  const [activeTab, setActiveTab] = useState('nowPlaying');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Movies</h1>
          
          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveTab('nowPlaying')}
                className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                  activeTab === 'nowPlaying'
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Now Playing
              </button>
              <button
                onClick={() => setActiveTab('comingSoon')}
                className={`px-6 py-3 rounded-md font-semibold transition-colors ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(activeTab === 'nowPlaying' ? nowPlayingMovies : comingSoonMovies).map((movie) => (
              <div key={movie.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                  {activeTab === 'nowPlaying' ? (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{movie.rating}</span>
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg">
                      <span className="text-sm font-semibold">Coming Soon</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{movie.title}</h3>
                  <p className="text-gray-600 mb-2">{movie.genre}</p>
                  <p className="text-gray-500 text-sm mb-2">{movie.duration}</p>
                  {movie.releaseDate && (
                    <p className="text-[#FFA500] font-semibold mb-4">Release: {movie.releaseDate}</p>
                  )}
                  <button className={`w-full py-3 rounded-lg font-semibold transition-opacity ${
                    activeTab === 'nowPlaying'
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white hover:opacity-90'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}>
                    {activeTab === 'nowPlaying' ? 'Book Now' : 'Notify Me'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}