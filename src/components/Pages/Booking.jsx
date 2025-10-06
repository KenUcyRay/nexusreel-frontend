import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Film } from 'lucide-react';
import Navbar from "../ui/MainNavbar";

const movies = [
  "(G)I-DLE World Tour [iDOL] IN CINEMAS",
  "Omniscient Reader: The Prophecy", 
  "I, the Executioner",
  "Jumbo"
];

const studios = [
  "Studio Premium 1",
  "Studio Premium 2", 
  "Studio Regular 1",
  "Studio Regular 2",
  "Studio IMAX",
  "Studio VIP"
];

const showtimes = [
  "10:00", "13:00", "16:00", "19:00", "22:00"
];

export default function Booking() {
  const [formData, setFormData] = useState({
    movie: '',
    studio: '',
    date: '',
    time: '',
    seats: 1,
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking data:', formData);
    alert('Booking submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-40 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Book Your Movie</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Movie Selection */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                  <Film className="w-5 h-5 mr-2 text-[#FFA500]" />
                  Select Movie
                </label>
                <select
                  name="movie"
                  value={formData.movie}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                >
                  <option value="">Choose a movie</option>
                  {movies.map((movie, index) => (
                    <option key={index} value={movie}>{movie}</option>
                  ))}
                </select>
              </div>

              {/* Studio Selection */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                  <MapPin className="w-5 h-5 mr-2 text-[#FFA500]" />
                  Select Studio
                </label>
                <select
                  name="studio"
                  value={formData.studio}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                >
                  <option value="">Choose a studio</option>
                  {studios.map((studio, index) => (
                    <option key={index} value={studio}>{studio}</option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                    <Calendar className="w-5 h-5 mr-2 text-[#FFA500]" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                    <Clock className="w-5 h-5 mr-2 text-[#FFA500]" />
                    Showtime
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    {showtimes.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Number of Seats */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Number of Seats
                </label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                />
              </div>

              {/* Personal Information */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}