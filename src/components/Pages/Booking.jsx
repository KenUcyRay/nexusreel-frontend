import React, { useState } from 'react';
import { Clock, MapPin, ArrowLeft } from 'lucide-react';
import Navbar from "../ui/MainNavbar";
import live1 from '../../assets/live1.webp';
import live2 from '../../assets/live2.jpg';
import live3 from '../../assets/live3.jpg';
import live4 from '../../assets/live4.webp';

const nowPlayingMovies = [
  {
    id: 1,
    title: "(G)I-DLE World Tour [iDOL] IN CINEMAS",
    genre: "Music, Documentary",
    duration: "120 min",
    poster: live1,
    studio: "Studio Premium 1",
    showtimes: ["14:50", "17:30", "20:00"]
  },
  {
    id: 2,
    title: "Omniscient Reader: The Prophecy",
    genre: "Action, Fantasy, Thriller",
    duration: "137 min",
    poster: live2,
    studio: "Studio Regular 2",
    showtimes: ["13:00", "16:00", "19:00"]
  },
  {
    id: 3,
    title: "I, the Executioner",
    genre: "Crime, Thriller, Mystery",
    duration: "141 min",
    poster: live3,
    studio: "Studio IMAX",
    showtimes: ["15:00", "18:00", "21:00"]
  },
  {
    id: 4,
    title: "Jumbo",
    genre: "Animation, Adventure, Family",
    duration: "105 min",
    poster: live4,
    studio: "Studio VIP",
    showtimes: ["12:00", "14:30", "17:00"]
  }
];

const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
  const seats = [];
  
  rows.forEach(row => {
    for (let i = 1; i <= 14; i++) {
      const seatId = `${row}${i}`;
      const isOccupied = Math.random() < 0.3; // 30% chance occupied
      seats.push({
        id: seatId,
        row,
        number: i,
        isOccupied,
        isSelected: false
      });
    }
  });
  
  return seats;
};

export default function Booking() {
  const [step, setStep] = useState('movies'); // 'movies', 'tickets', or 'seats'
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [seats, setSeats] = useState(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setStep('tickets');
  };

  const handleTicketConfirm = () => {
    setStep('seats');
  };

  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat.isOccupied) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const ticketPrice = 50000;
  const totalPrice = selectedSeats.length * ticketPrice;

  if (step === 'movies') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-40 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Select Movie</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {nowPlayingMovies.map((movie) => (
                <div key={movie.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img src={movie.poster} alt={movie.title} className="w-full h-80 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{movie.title}</h3>
                    <p className="text-gray-600 mb-2">{movie.genre}</p>
                    <p className="text-gray-500 text-sm mb-4">{movie.duration}</p>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {movie.studio}
                    </div>
                    <button
                      onClick={() => handleMovieSelect(movie)}
                      className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Book Now
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

  if (step === 'tickets') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-40 pb-16">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setStep('movies')}
              className="flex items-center text-gray-600 hover:text-[#FFA500] mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Movies
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <img src={selectedMovie.poster} alt={selectedMovie.title} className="w-24 h-32 object-cover rounded-lg mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedMovie.title}</h2>
                <div className="flex items-center justify-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedMovie.studio}
                </div>
                <p className="text-gray-600">{selectedMovie.genre} • {selectedMovie.duration}</p>
              </div>

              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-4 text-center">Select Showtime</label>
                <div className="grid grid-cols-3 gap-4">
                  {selectedMovie.showtimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                        selectedTime === time
                          ? 'bg-[#FFA500] text-orange-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-4 text-center">Number of Tickets</label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold text-gray-800 w-16 text-center">{ticketCount}</span>
                  <button
                    onClick={() => setTicketCount(Math.min(8, ticketCount + 1))}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <p className="text-center text-gray-600 mt-2">Maximum 8 tickets per booking</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-lg text-gray-600 mb-2">Total Price</div>
                <div className="text-3xl font-bold text-[#FFA500]">Rp {(ticketCount * ticketPrice).toLocaleString()}</div>
              </div>

              <button
                onClick={handleTicketConfirm}
                disabled={!selectedTime}
                className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Seat Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setStep('tickets')}
            className="flex items-center text-gray-600 hover:text-[#FFA500] mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Ticket Selection
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seat Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="bg-gray-200 rounded-lg py-2 px-4 inline-block mb-4">
                    <span className="text-gray-600 font-medium">Area Layar</span>
                  </div>
                </div>

                <div className="grid grid-cols-14 gap-1 mb-6">
                  {seats.map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat.id)}
                      disabled={seat.isOccupied}
                      className={`
                        w-8 h-8 text-xs font-medium rounded
                        ${seat.isOccupied 
                          ? 'bg-gray-400 text-orange-400 cursor-not-allowed' 
                          : selectedSeats.includes(seat.id)
                          ? 'bg-orange-500 text-green-500'
                          : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                        }
                      `}
                    >
                      {seat.id}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-teal-100 rounded mr-2"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                    <span>Occupied</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
                <div className="flex mb-4">
                  <img src={selectedMovie.poster} alt={selectedMovie.title} className="w-20 h-28 object-cover rounded-lg mr-4" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">{selectedMovie.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedMovie.studio}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Selected Time</div>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Clock className="w-4 h-4 inline mr-2" />
                    {selectedTime}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Number of Tickets</div>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    {ticketCount} ticket{ticketCount > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Selected Seats</h4>
                  {selectedSeats.length === 0 ? (
                    <p className="text-gray-500 text-sm">No seats selected</p>
                  ) : (
                    <p className="text-gray-700">{selectedSeats.join(', ')}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">{selectedSeats.length} of {ticketCount} seats selected</p>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per ticket</span>
                    <span className="font-medium">Rp {ticketPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#FFA500]">Rp {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  disabled={selectedSeats.length !== ticketCount || !selectedTime}
                  className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}