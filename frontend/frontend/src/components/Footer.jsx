import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaUtensils, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { IoHome, IoInformationCircle, IoCall } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-orange-500 text-white p-3 rounded-full mr-3">
                <FaUtensils className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">FoodExpress</h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Menyediakan makanan enak dan berkualitas dengan layanan terbaik untuk memenuhi kebutuhan kuliner Anda.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-700 hover:bg-orange-500 text-white p-3 rounded-full transition-colors duration-300">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-orange-500 text-white p-3 rounded-full transition-colors duration-300">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-orange-500 text-white p-3 rounded-full transition-colors duration-300">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-orange-500 text-white p-3 rounded-full transition-colors duration-300">
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white border-b-2 border-orange-500 pb-2">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => navigate("/home")}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 group"
                >
                  <IoHome className="text-orange-500 group-hover:scale-110 transition-transform" />
                  <span>Beranda</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/about")}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 group"
                >
                  <IoInformationCircle className="text-orange-500 group-hover:scale-110 transition-transform" />
                  <span>Tentang Kami</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/contact")}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 group"
                >
                  <IoCall className="text-orange-500 group-hover:scale-110 transition-transform" />
                  <span>Kontak</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/riwayat")}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center gap-3 group"
                >
                  <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">R</span>
                  <span>Riwayat Pesanan</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white border-b-2 border-orange-500 pb-2">Kontak Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-orange-500 mt-1 text-lg" />
                <span className="text-gray-300">Jl. Makanan Enak No. 123, Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-orange-500 text-lg" />
                <span className="text-gray-300">(021) 1234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-orange-500 text-lg" />
                <span className="text-gray-300">info@ZharfaFood.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white border-b-2 border-orange-500 pb-2">Berlangganan</h3>
            <p className="text-gray-300 mb-4">
              Dapatkan promo dan menu terbaru dari kami dengan berlangganan newsletter.
            </p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Email Anda"
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105">
                Berlangganan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              &copy; 2025 FoodExpress. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">Kebijakan Privasi</a>
              <a href="#" className="hover:text-orange-400 transition-colors duration-300">FAQ</a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
      </div>
    </footer>
  );
}