import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaHistory } from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";
import { MdSpaceDashboard, MdReport, MdShoppingCart, MdRateReview } from "react-icons/md";
import { IoHome, IoRestaurant, IoInformationCircle, IoCall } from "react-icons/io5";
import React from "react";

export default function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role")?.toUpperCase();
  const username = localStorage.getItem("username");

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const goAdminLogin = () => navigate("/admin/login");

  return (
    <header className="bg-gradient-to-r from-red-500 to-orange-500 shadow-lg sticky top-0 z-50 font-['Poppins']">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => navigate(role === "ADMIN" ? "/admin" : "/home")}
        >
          <div className="text-white text-3xl font-bold mr-2">
            <IoRestaurant />
          </div>
          <h1 className="text-xl font-bold text-white">ZharfaFood</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 mx-6 flex justify-center gap-6">
          {role === "USER" && (
            <>
              <button className="text-white hover:text-yellow-200 font-medium flex items-center gap-1" onClick={() => navigate("/home")}>
                <IoHome className="text-lg" /> Home
              </button>
              <button className="text-white hover:text-yellow-200 font-medium flex items-center gap-1" onClick={() => navigate("/about")}>
                <IoInformationCircle className="text-lg" /> About
              </button>
              <button className="text-white hover:text-yellow-200 font-medium flex items-center gap-1" onClick={() => navigate("/contact")}>
                <IoCall className="text-lg" /> Contact
              </button>
              <button className="text-white hover:text-yellow-200 font-medium flex items-center gap-1" onClick={() => navigate("/riwayat")}>
                <FaHistory className="text-lg" /> Riwayat
              </button>
              <button className="text-white hover:text-yellow-200 font-medium flex items-center gap-1" onClick={() => navigate("/review")}>
                <MdRateReview className="text-lg" /> Review
              </button>
            </>
          )}

          {role === "ADMIN" && (
            <>
              <button className="text-white hover:text-yellow-200 font-medium flex items-center gap-1" onClick={() => navigate("/admin")}>
                <MdSpaceDashboard className="text-lg" /> Dashboard
              </button>
              <button className="text-white hover:text-yellow-200 font-medium flex items-center gap-1" onClick={() => navigate("/admin/pesanan")}>
                <MdShoppingCart className="text-lg" /> Kelola Pesanan
              </button>
              <button className="text-white hover:text-yellow-200 font-medium flex items-center gap-1" onClick={() => navigate("/admin/laporan")}>
                <MdReport className="text-lg" /> Laporan
              </button>
              <button className="text-white hover:text-yellow-200 font-medium flex items-center gap-1" onClick={() => navigate("/admin/review")}>
                <MdRateReview className="text-lg" /> Review
              </button>
            </>
          )}
        </div>

        {/* User/Admin Buttons */}
        <div className="flex items-center gap-3">
          {role ? (
            <>
              <div className="flex items-center text-white bg-white/20 py-1 px-3 rounded-full">
                <FaUserCircle className="text-lg mr-2" />
                Hi, {username}
              </div>
              {role === "USER" && (
                <button className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center gap-2" onClick={goAdminLogin}>
                  <GiChefToque className="text-sm" /> Admin
                </button>
              )}
              <button className="px-4 py-2 bg-white text-red-500 rounded-full flex items-center gap-2" onClick={logout}>
                <FaSignOutAlt className="text-sm" /> Logout
              </button>
            </>
          ) : (
            <button className="px-4 py-2 bg-white text-red-500 rounded-full flex items-center gap-2" onClick={() => navigate("/login")}>
              <FaSignInAlt className="text-sm" /> Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
