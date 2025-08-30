import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import React from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/register", { username, email, password });
      alert("Register berhasil, silakan login!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register gagal");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-orange-600">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Daftarkan diri Anda untuk mengakses aplikasi
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 border border-orange-200">
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="Masukkan username Anda"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Alamat Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleRegister}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Daftar
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
