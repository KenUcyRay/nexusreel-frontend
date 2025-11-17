import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, X, Zap, Search } from 'lucide-react';
import api from '../../utils/api';

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanning(true);
      setError('');
    } catch (err) {
      setError('Camera access denied or not available');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  const handleScanResult = async (ticketCode, isDemo = false) => {
    try {
      // Mock data only for demo buttons, not manual entry
      if (isDemo && (ticketCode.startsWith('DEMO') || ticketCode.startsWith('TEST') || ticketCode.startsWith('SAMPLE'))) {
        const mockTicket = {
          id: ticketCode,
          movie_name: 'Avengers: Endgame',
          studio_name: 'Studio 1',
          show_date: '2024-01-20',
          show_time: '19:00',
          seats: ['A1', 'A2'],
          total_amount: 50000
        };
        
        stopCamera();
        navigate('/kasir/print-ticket', { 
          state: { ticketData: mockTicket } 
        });
        return;
      }
      
      const response = await api.get(`/api/cashier/scan-ticket/${ticketCode}`);
      if (response.data.success) {
        stopCamera();
        navigate('/kasir/print-ticket', { 
          state: { ticketData: response.data.ticket } 
        });
      } else {
        setError(response.data.message || 'Invalid ticket');
      }
    } catch (error) {
      setError('Failed to verify ticket');
    }
  };

  const handleManualScan = () => {
    const code = ticketCode.trim();
    if (code) {
      handleScanResult(code);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF] p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/kasir/dashboard')}
            className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {!scanning ? (
            <div className="text-center space-y-4">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="space-y-3">
                <button
                  onClick={startCamera}
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  Start Camera
                </button>
                <button
                  onClick={() => handleScanResult('DEMO-TICKET-001', true)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Demo Scan (Test Mode)
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={stopCamera}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Manual Entry</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter ticket code"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
            />
            <button
              onClick={handleManualScan}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Pindai
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}