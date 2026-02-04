import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from '../config/api';

function Register() {
const [formData, setFormData] = useState({
  email: "",
  username: "",
  password: "",
  konfirmasi: "",
});


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 🔹 State baru
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.konfirmasi) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setError(""); // Clear error if validation passes
    setLoading(true);
    try {
await api.post(`/register`, {
  email: formData.email,
  username: formData.username,
  password: formData.password,
  konfirmasi: formData.konfirmasi,
});


      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data anda telah disimpan",
        showConfirmButton: false,
        timer: 1500
      });

      localStorage.setItem("loginData", JSON.stringify(formData));

      setFormData({
        email: "",
        username: "",
        password: "",
        konfirmasi: "",
      });

      navigate("/");
    } catch (error) {
      console.error("Axios error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2 font-bold">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Masukan Email anda"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2 font-bold">Username</label>
            <input
              id="username"
              name="username"
              type="username"
              placeholder="Masukan username anda"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 mb-2 font-bold">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukan Password anda"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[45px] text-gray-600 cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Konfirmasi Password */}
          <div className="mb-4 relative">
            <label htmlFor="konfirmasi" className="block text-gray-700 mb-2 font-bold">Konfirmasi Password</label>
            <input
              id="konfirmasi"
              name="konfirmasi"
              type={showConfirmPassword ? "text" : "password"} // ✅ diperbaiki
              placeholder="konfirmasi Password anda"
              value={formData.konfirmasi}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // ✅ icon terpisah
              className="absolute right-3 top-[45px] text-gray-600 cursor-pointer"
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Tombol Submit */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="w-full font-bold bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-200"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Daftar"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <span>Sudah punya akun?</span>
          <a href="/" className="text-blue-700 underline"> Login</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
