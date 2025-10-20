import React, { useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../ui/MainNavbar";

const ticketHistory = [
  {
    id: 1,
    movie: "Demon Slayer: Infinite Castle",
    date: "2024-01-15",
    time: "19:30",
    cinema: "Nexus Cinema Mall",
    seats: "A12, A13",
    price: "Rp 85,000",
    status: "Completed"
  },
  {
    id: 2,
    movie: "One Piece Film: Red",
    date: "2024-01-10",
    time: "16:00",
    cinema: "Nexus Cinema Plaza",
    seats: "B5, B6",
    price: "Rp 75,000",
    status: "Completed"
  },
  {
    id: 3,
    movie: "K-Pop Demon Hunter",
    date: "2024-01-05",
    time: "21:15",
    cinema: "Nexus Cinema Mall",
    seats: "C8",
    price: "Rp 65,000",
    status: "Completed"
  }
];

export default function History() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-80 sm:h-96 bg-gradient-to-r from-gray-900 to-gray-700 pt-28 sm:pt-40">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-white text-center" data-aos="fade-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">Ticket History</h1>
              <p className="text-lg sm:text-xl text-gray-300">Your Movie Experience Journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Content */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {ticketHistory.map((ticket, index) => (
              <div 
                key={ticket.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <Ticket className="w-6 h-6 text-[#FFA500]" />
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{ticket.movie}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                          {ticket.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-[#FFA500]" />
                          <span className="text-sm">{ticket.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-[#FFA500]" />
                          <span className="text-sm">{ticket.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-[#FFA500]" />
                          <span className="text-sm">{ticket.cinema}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold">Seats: {ticket.seats}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                      <p className="text-2xl font-bold text-[#FFA500] mb-2">{ticket.price}</p>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ticketHistory.length === 0 && (
            <div className="text-center py-12" data-aos="fade-up">
              <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Ticket History</h3>
              <p className="text-gray-500 mb-6">You haven't purchased any tickets yet.</p>
              <a
                href="/movies"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Browse Movies
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}