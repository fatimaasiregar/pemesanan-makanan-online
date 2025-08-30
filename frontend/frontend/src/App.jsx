import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import KelolaPesanan from "./pages/KelolaPesanan";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Riwayat from './pages/Riwayat';
import Laporan from './pages/Laporan';
import ReviewUser from "./pages/ReviewUser";
import ReviewAdmin from "./pages/ReviewAdmin";
import React, { useState, useEffect } from "react";

function App() {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    loading: true
  });

  // Load token & role dari localStorage saat mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setAuth({ token, role, loading: false });
  }, []);

  // Tampilkan loading sementara
  if (auth.loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700 font-bold text-xl">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Login User */}
        <Route path="/login" element={
          auth.token && auth.role === "USER" ? (
            <Navigate to="/home" replace />
          ) : (
            <Login setAuth={setAuth} />
          )
        } />

        {/* Login Admin */}
        <Route path="/admin/login" element={
          auth.token && auth.role === "ADMIN" ? (
            <Navigate to="/admin" replace />
          ) : (
            <AdminLogin setAuth={setAuth} />
          )
        } />

        <Route path="/register" element={<Register />} />

        {/* Halaman User */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<><Header /><Home /><Footer /></>} />
        <Route path="/riwayat" element={<><Header /><Riwayat /><Footer /></>} />
        <Route path="/about" element={<><Header /><About /><Footer /></>} />
        <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
        <Route path="/review" element={<><Header /><ReviewUser /><Footer /></>} />

        {/* Halaman Admin */}
        <Route path="/admin" element={
          auth.role === "ADMIN" ? (
            <><Header /><Admin /><Footer /></>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } />
        <Route path="/admin/pesanan" element={
          auth.role === "ADMIN" ? (
            <><Header /><KelolaPesanan /><Footer /></>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } />
        <Route path="/admin/laporan" element={
          auth.role === "ADMIN" ? (
            <><Header /><Laporan /><Footer /></>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } />
        <Route path="/admin/review" element={
          auth.role === "ADMIN" ? (
            <><Header /><ReviewAdmin /><Footer /></>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } />

        {/* Default Redirect */}
        <Route path="*" element={
          auth.token ? (
            auth.role === "ADMIN" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
