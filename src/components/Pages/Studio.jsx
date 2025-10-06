import React from 'react';
import { MapPin, Users, Volume2, Wifi } from 'lucide-react';
import Navbar from "../ui/navbar";

const studios = [
  {
    id: 1,
    name: "Studio Premium 1",
    capacity: "50 seats",
    features: ["Dolby Atmos", "4K Projection", "Reclining Seats", "Air Conditioning"],
    price: "Rp 45,000",
    image: "https://images.unsplash.com/photo-1489599663989-1bb2b8b91ed5?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    name: "Studio Premium 2",
    capacity: "45 seats",
    features: ["Surround Sound", "HD Projection", "Comfortable Seats", "Air Conditioning"],
    price: "Rp 40,000",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    name: "Studio Regular 1",
    capacity: "80 seats",
    features: ["Standard Sound", "HD Projection", "Standard Seats", "Air Conditioning"],
    price: "Rp 25,000",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    name: "Studio Regular 2",
    capacity: "75 seats",
    features: ["Standard Sound", "HD Projection", "Standard Seats", "Air Conditioning"],
    price: "Rp 25,000",
    image: "https://images.unsplash.com/photo-1594736797933-d0d6a7d80a68?w=400&h=250&fit=crop"
  },
  {
    id: 5,
    name: "Studio IMAX",
    capacity: "120 seats",
    features: ["IMAX Sound", "IMAX Projection", "Premium Seats", "Climate Control"],
    price: "Rp 65,000",
    image: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400&h=250&fit=crop"
  },
  {
    id: 6,
    name: "Studio VIP",
    capacity: "20 seats",
    features: ["Premium Sound", "4K Projection", "Luxury Recliners", "Personal Service"],
    price: "Rp 85,000",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=250&fit=crop"
  }
];

export default function Studio() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Our Studios</h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose from our variety of studios, each designed to provide the best movie experience with state-of-the-art technology and comfortable seating.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studios.map((studio) => (
              <div key={studio.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={studio.image}
                    alt={studio.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#FFA500] text-white px-3 py-1 rounded-lg">
                    <span className="text-sm font-semibold">{studio.price}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{studio.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">{studio.capacity}</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    {studio.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-[#FFA500] rounded-full mr-3"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Select Studio
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