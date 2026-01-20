import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BASE_URL } from '../config/api';

function Register() {
const [formData, setFormData] = useState({
  email: "",
  username: "",
  password: "",
});


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 🔹 State baru
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setLoading(true);
    try {
await axios.post(`${BASE_URL}/register`, {
  email: formData.Email,
  username: formData.Username,
  password: formData.Password
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
        Email: "",
        Username: "",
        Password: "",
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
            <label htmlFor="Email" className="block text-gray-700 mb-2 font-bold">Email</label>
            <input
              id="Email"
              name="Email"
              type="email"
              placeholder="Masukan Email anda"
              value={formData.Email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Username" className="block text-gray-700 mb-2 font-bold">Username</label>
            <input
              id="Username"
              name="Username"
              type="Username"
              placeholder="Masukan Username anda"
              value={formData.Username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label htmlFor="Password" className="block text-gray-700 mb-2 font-bold">Password</label>
            <input
              id="Password"
              name="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukan Password anda"
              value={formData.Password}
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
            <label htmlFor="Konfirmasi" className="block text-gray-700 mb-2 font-bold">Konfirmasi Password</label>
            <input
              id="Konfirmasi"
              name="Konfirmasi"
              type={showConfirmPassword ? "text" : "password"} // ✅ diperbaiki
              placeholder="Konfirmasi Password anda"
              value={formData.Konfirmasi}
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
