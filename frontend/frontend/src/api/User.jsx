import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

/**
 * Fungsi untuk mendaftarkan user baru
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {Promise<Object>} Response dari server
 */
export const registerUser = async (username, email, password, confirmPassword) => {
  try {
    const res = await axios.post(`${API_URL}/register`, { 
      username, 
      email, 
      password, 
      confirmPassword 
    });
    
    // Handle response yang berhasil tetapi memiliki error message
    if (res.data.error) {
      throw new Error(res.data.error);
    }
    
    return {
      success: true,
      message: res.data.message || "Registrasi berhasil!",
      data: res.data
    };
    
  } catch (err) {
    // Handle berbagai jenis error
    let errorMessage = "Terjadi kesalahan saat registrasi";
    
    if (err.response) {
      // Error dari server (4xx/5xx)
      errorMessage = err.response.data?.message || 
                   err.response.data?.error ||
                   JSON.stringify(err.response.data);
    } else if (err.request) {
      // Request dibuat tetapi tidak ada response
      errorMessage = "Tidak ada respon dari server. Periksa koneksi Anda.";
    } else {
      // Error saat setup request
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Fungsi untuk login user
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>} Response dari server
 */
export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, {
      username,
      password 
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.data?.token) {
      throw new Error('Invalid server response - missing token');
    }

    // Store authentication data
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', username);
    if (res.data.user) {
      localStorage.setItem('userData', JSON.stringify(res.data.user));
    }

    return {
      success: true,
      message: "Login berhasil!",
      token: res.data.token,
      user: res.data.user || { username }
    };
  } catch (err) {
    let errorMessage = "Terjadi kesalahan saat login";
    
    if (err.response) {
      errorMessage = err.response.data?.message || 
                   err.response.data?.error ||
                   JSON.stringify(err.response.data);
    } else if (err.request) {
      errorMessage = "Tidak ada respon dari server. Periksa koneksi Anda.";
    } else {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Fungsi untuk logout
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("userData");
};