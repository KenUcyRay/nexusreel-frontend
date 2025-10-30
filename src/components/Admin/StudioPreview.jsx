import { useState } from 'react';

const StudioPreview = ({ studio }) => {
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [occupiedSeats] = useState(new Set()); // No occupied seats by default

  const generateSeatId = (row, col) => {
    const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
    return `${rowLetter}${col + 1}`;
  };

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.has(seatId)) return;
    
    const newSelected = new Set(selectedSeats);
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
    }
    setSelectedSeats(newSelected);
  };

  const getSeatStatus = (seatId) => {
    if (occupiedSeats.has(seatId)) return 'occupied';
    if (selectedSeats.has(seatId)) return 'selected';
    return 'available';
  };

  const getSeatColor = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-gray-400 cursor-not-allowed';
      case 'selected':
        return 'bg-orange-500 cursor-pointer hover:bg-orange-600';
      case 'available':
      default:
        return 'bg-teal-200 cursor-pointer hover:bg-teal-300';
    }
  };

  if (!studio) return null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg">{studio.name}</h3>
        <p className="text-sm text-gray-600">{studio.type} Studio</p>
      </div>

      {/* Screen */}
      <div className="text-center mb-6">
        <div className="bg-gray-300 rounded-lg py-2 px-4 inline-block">
          <span className="text-sm font-medium text-gray-700">Area Layar</span>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {Array.from({ length: studio.rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center mb-2">
              {/* Row Label */}
              <div className="w-8 text-center font-medium text-sm">
                {String.fromCharCode(65 + rowIndex)}
              </div>
              
              {/* Seats */}
              <div className="flex space-x-1">
                {Array.from({ length: studio.columns }, (_, colIndex) => {
                  const seatId = generateSeatId(rowIndex, colIndex);
                  const status = getSeatStatus(seatId);
                  
                  return (
                    <button
                      key={colIndex}
                      onClick={() => handleSeatClick(seatId)}
                      className={`
                        w-8 h-8 rounded text-xs font-medium text-white
                        ${getSeatColor(status)}
                        transition-colors duration-200
                      `}
                      disabled={status === 'occupied'}
                      title={`Seat ${seatId} - ${status}`}
                    >
                      {colIndex + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-teal-200 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>Occupied</span>
        </div>
      </div>

      {/* Studio Info */}
      <div className="bg-gray-50 p-3 rounded text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>Rows: {studio.rows}</div>
          <div>Columns: {studio.columns}</div>
          <div>Total Seats: {studio.total_seats}</div>
          <div>Selected: {selectedSeats.size}</div>
        </div>
      </div>
    </div>
  );
};

export default StudioPreview;