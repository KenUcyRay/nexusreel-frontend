import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';

export default function PrintTicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketData = location.state?.ticketData;

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No ticket data found</p>
          <button
            onClick={() => navigate('/kasir/dashboard')}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/kasir/dashboard')}
            className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Print Ticket</h1>
          <button
            onClick={handlePrint}
            className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 print:shadow-none print:rounded-none">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">NEXUS CINEMA</h2>
            <p className="text-lg text-gray-600">Movie Ticket</p>
          </div>

          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Movie Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Movie:</span> {ticketData.movie_name}</p>
                  <p><span className="font-medium">Studio:</span> {ticketData.studio_name}</p>
                  <p><span className="font-medium">Date:</span> {new Date(ticketData.show_date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {ticketData.show_time}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Ticket ID:</span> {ticketData.id}</p>
                  <p><span className="font-medium">Seats:</span> {ticketData.seats?.join(', ') || 'N/A'}</p>
                  <p><span className="font-medium">Total:</span> Rp {ticketData.total_amount?.toLocaleString()}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      Confirmed
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Please present this ticket at the entrance
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Printed on: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}