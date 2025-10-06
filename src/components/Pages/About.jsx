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
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-700 pt-32">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-white text-center" data-aos="fade-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">About Nexus Cinema</h1>
              <p className="text-xl text-gray-300">Your Ultimate Movie Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Who We Are</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nexus Cinema adalah destinasi hiburan terdepan yang menghadirkan pengalaman menonton film terbaik 
              dengan teknologi canggih dan kenyamanan premium untuk seluruh keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">10M+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">50+</h3>
              <p className="text-gray-600">Awards Won</p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">25+</h3>
              <p className="text-gray-600">Locations</p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="400">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">15+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div data-aos="fade-right">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Memberikan pengalaman menonton film yang tak terlupakan melalui teknologi terdepan, 
                layanan berkualitas tinggi, dan suasana yang nyaman untuk semua kalangan.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kami berkomitmen untuk terus berinovasi dalam menghadirkan hiburan terbaik 
                dan menjadi pilihan utama masyarakat untuk menikmati film-film berkualitas.
              </p>
            </div>

            <div data-aos="fade-left">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Menjadi jaringan bioskop terdepan di Indonesia yang dikenal dengan standar 
                kualitas internasional dan pengalaman menonton yang luar biasa.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Menciptakan komunitas pecinta film yang solid dan berkontribusi dalam 
                perkembangan industri perfilman Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12" data-aos="fade-up">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-aos="fade-up" data-aos-delay="100">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Head Office</h4>
              <p className="text-gray-600">Jl. Sudirman No. 123<br />Jakarta Pusat, 10220</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Contact</h4>
              <p className="text-gray-600">Phone: (021) 123-4567<br />Email: info@nexuscinema.com</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Hours</h4>
              <p className="text-gray-600">Mon - Sun: 10:00 - 22:00<br />Customer Service: 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}