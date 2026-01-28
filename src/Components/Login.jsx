import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../config/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", formData);

      Swal.fire({
        icon: "success",
        title: "Login berhasil",
        timer: 1500,
        showConfirmButton: false,
      });

      localStorage.setItem("loginData", JSON.stringify(res.data));
      navigate("/Dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: "Email atau password salah",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-bold">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2 font-bold">
              Password
            </label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-400 pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[45px] cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 rounded-md font-bold hover:bg-pink-600"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
