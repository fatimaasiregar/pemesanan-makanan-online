import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-orange-500">Hubungi</span> Kami
          </h1>
          <p className="text-xl text-gray-600">
            Kami siap membantu Anda kapan saja
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Phone Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start">
            <div className="bg-orange-100 p-4 rounded-full mr-6">
              <FaPhone className="text-2xl text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Telepon</h3>
              <p className="text-gray-600 mb-1">(021) 1234-5678</p>
              <p className="text-gray-600">+62 812 3456 7890</p>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start">
            <div className="bg-orange-100 p-4 rounded-full mr-6">
              <FaEnvelope className="text-2xl text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Email</h3>
              <p className="text-gray-600 mb-1">support@ZharfaFood.com</p>
              <p className="text-gray-600">marketing@ZharfaFood.com</p>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start">
            <div className="bg-orange-100 p-4 rounded-full mr-6">
              <FaMapMarkerAlt className="text-2xl text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Alamat</h3>
              <p className="text-gray-600 mb-1">Jl. Sudirman No. 1</p>
              <p className="text-gray-600">Jakarta Pusat, 10210</p>
            </div>
          </div>

          {/* Hours Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start">
            <div className="bg-orange-100 p-4 rounded-full mr-6">
              <FaClock className="text-2xl text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Jam Operasional</h3>
              <p className="text-gray-600 mb-1">Senin - Jumat: 08.00 - 17.00</p>
              <p className="text-gray-600">Sabtu: 09.00 - 15.00</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Ikuti Kami di Media Sosial</h3>
          <div className="flex justify-center space-x-6">
            <a href="#" className="bg-blue-100 p-4 rounded-full text-blue-600 hover:bg-blue-200 transition-colors duration-300">
              <FaFacebook className="text-2xl" />
            </a>
            <a href="#" className="bg-sky-100 p-4 rounded-full text-sky-500 hover:bg-sky-200 transition-colors duration-300">
              <FaTwitter className="text-2xl" />
            </a>
            <a href="#" className="bg-pink-100 p-4 rounded-full text-pink-600 hover:bg-pink-200 transition-colors duration-300">
              <FaInstagram className="text-2xl" />
            </a>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-200 flex items-center justify-center flex-col">
            <FaMapMarkerAlt className="text-4xl text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Lokasi Kami</h3>
            <p className="text-gray-600">Jl. Sudirman No. 1, Jakarta</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;