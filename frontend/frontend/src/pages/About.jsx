import React, { useState } from 'react';
import { 
  FaUtensils, 
  FaLeaf, 
  FaAward, 
  FaHeart, 
  FaUsers, 
  FaStar, 
  FaSmile, 
  FaRocket,
  FaChevronDown,
  FaQuoteLeft,
  FaShoppingBag,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleOrderNow = () => {
    navigate('/home');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+62123456789';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@ZharfaFood.com';
  };

  const values = [
    {
      title: "Kualitas Terbaik",
      icon: <FaAward className="text-4xl" />,
      content: "Kami hanya bekerja dengan restoran terbaik yang telah melalui seleksi ketat untuk memastikan kualitas makanan."
    },
    {
      title: "Inovasi",
      icon: <FaRocket className="text-4xl" />,
      content: "Terus berinovasi untuk memberikan pengalaman pemesanan makanan yang lebih baik."
    },
    {
      title: "Pelayanan",
      icon: <FaHeart className="text-4xl" />,
      content: "Pelanggan adalah prioritas utama kami dalam setiap layanan yang kami berikan."
    }
  ];

  const stats = [
    { 
      title: "10.000+ Restoran", 
      icon: <FaUtensils className="text-4xl" />,
      color: "bg-orange-100",
      onClick: () => console.log("Restoran clicked")
    },
    { 
      title: "1Jt+ Pelanggan", 
      icon: <FaUsers className="text-4xl" />,
      color: "bg-blue-100",
      onClick: () => console.log("Pelanggan clicked")
    },
    { 
      title: "99% Kepuasan", 
      icon: <FaSmile className="text-4xl" />,
      color: "bg-green-100",
      onClick: () => console.log("Kepuasan clicked")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      {/* Animated Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white/10 cursor-pointer"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${Math.random() * 10 + 10}s infinite alternate`
              }}
              onClick={() => console.log("Bubble clicked", i)}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-bounce cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Tentang <span className="text-yellow-300">ZharfaFood</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto transform hover:scale-105 transition-transform cursor-pointer"
             onClick={() => navigate('/home')}>
            Menghubungkan Anda dengan pengalaman kuliner terbaik di Indonesia
          </p>
          <div className="mt-8 animate-bounce-slow cursor-pointer" 
               onClick={() => document.getElementById('stats-section').scrollIntoView({ behavior: 'smooth' })}>
            <FaChevronDown className="mx-auto text-2xl" />
          </div>
        </div>
      </section>

      {/* Floating Cards Section */}
      <div id="stats-section" className="container mx-auto px-4 py-12 max-w-6xl -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((item, index) => (
            <div 
              key={index}
              className={`${item.color} p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${
                hoveredCard === index ? 'ring-4 ring-orange-400 scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={item.onClick}
            >
              <div className="text-orange-500 mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-800">{item.title}</h3>
              <p className="text-center text-sm text-gray-600 mt-2">Klik untuk info lebih lanjut</p>
            </div>
          ))}
        </div>
      </div>

      {/* Animated About Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
              <div className="relative cursor-pointer" onClick={() => navigate('/home')}>
                <div className="w-64 h-64 rounded-full bg-orange-500/10 flex items-center justify-center animate-pulse-slow hover:animate-wiggle">
                  <div className="w-56 h-56 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-orange-500/30 flex items-center justify-center">
                      <FaUtensils className="text-6xl text-orange-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 cursor-pointer hover:text-orange-500 transition-colors"
                  onClick={() => navigate('/home')}>
                Cerita <span className="text-orange-500">Kami</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                RestoApp dimulai dari kecintaan terhadap kuliner Indonesia dan keinginan untuk memudahkan akses terhadap berbagai pilihan makanan berkualitas.
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg transform hover:scale-[1.01] transition-transform cursor-pointer"
                   onClick={() => navigate('/home')}>
                <FaQuoteLeft className="text-orange-300 text-2xl mb-2" />
                <p className="text-orange-700 italic font-medium">
                  "Misi kami sederhana: membuat setiap pengalaman makan menjadi lebih mudah, lebih cepat, dan lebih menyenangkan."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Accordion */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => setActiveAccordion(0)}>
          Nilai <span className="text-orange-500">Kami</span>
        </h2>
        
        <div className="max-w-2xl mx-auto space-y-4">
          {values.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg"
              onClick={() => toggleAccordion(index)}
            >
              <button
                className={`w-full p-6 text-left flex items-center justify-between ${
                  activeAccordion === index ? 'bg-orange-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="text-orange-500 mr-4">{item.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                </div>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    activeAccordion === index ? 'transform rotate-180 text-orange-500' : ''
                  }`}
                />
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  activeAccordion === index ? 'max-h-40 pb-6' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 pl-14">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Options */}
      <section className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Hubungi Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow"
               onClick={handlePhoneClick}>
            <FaPhone className="text-orange-500 text-2xl mr-4" />
            <div>
              <p className="font-semibold">Telepon</p>
              <p className="text-gray-600">+62 123 456 789</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow"
               onClick={handleEmailClick}>
            <FaEnvelope className="text-orange-500 text-2xl mr-4" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-600">info@restoapp.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated CTA */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-8 md:p-12 text-center overflow-hidden relative cursor-pointer hover:shadow-2xl transition-shadow"
             onClick={handleOrderNow}>
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white/10 animate-float cursor-pointer"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 20 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 transform hover:scale-105 transition-transform inline-block">
              Siap Memesan Makanan Favorit Anda?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan jutaan pelanggan yang telah mempercayai RestoApp
            </p>
            <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all transform hover:scale-110 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto">
              <FaShoppingBag className="mr-2" />
              Pesan Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.2); opacity: 0.05; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s infinite alternate;
        }
        .animate-wiggle {
          animation: wiggle 3s infinite;
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default About;