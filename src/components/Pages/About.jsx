import React, { useEffect } from 'react';
import { Users, Award, MapPin, Clock } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../ui/MainNavbar";

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-80 sm:h-96 bg-gradient-to-r from-white to-[#C6E7FF] pt-48 sm:pt-56">
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-gray-600 text-center" data-aos="fade-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">About Nexus Cinema</h1>
              <p className="text-lg sm:text-xl text-gray-600">Your Ultimate Movie Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">Who We Are</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nexus Cinema is a leading entertainment destination that delivers the ultimate movie-watching experience with advanced 
              technology and premium comfort for the whole family.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
     <section className="py-12 sm:py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
      <div data-aos="fade-right">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Our Mission</h3>
        <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
          Providing an unforgettable movie-watching experience through cutting-edge technology, 
          high-quality service, and a comfortable atmosphere for everyone.
        </p>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          We are committed to continuously innovating to deliver the best entertainment 
          and to become the top choice for people seeking high-quality films.
        </p>
      </div>

      <div data-aos="fade-left">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Our Vision</h3>
        <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
          To become Indonesia’s leading cinema network, recognized for its international standards 
          and extraordinary movie-watching experience.
        </p>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          To build a strong community of movie enthusiasts and contribute to the growth 
          of Indonesia’s film industry.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Contact Info */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8 sm:mb-12" data-aos="fade-up">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div data-aos="fade-up" data-aos-delay="100">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Head Office</h4>
              <p className="text-gray-600 text-sm sm:text-base">Jl. Sudirman No. 123<br />Jakarta Pusat, 10220</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Contact</h4>
              <p className="text-gray-600 text-sm sm:text-base">Phone: (021) 123-4567<br />Email: info@nexuscinema.com</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Hours</h4>
              <p className="text-gray-600 text-sm sm:text-base">Mon - Sun: 10:00 - 22:00<br />Customer Service: 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}