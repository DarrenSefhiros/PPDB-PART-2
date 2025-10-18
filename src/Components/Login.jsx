import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';

function Login() {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/users?Email=${formData.Email}&Password=${formData.Password}`);
      if (res.data.length > 0) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Login berhasil",
          showConfirmButton: false,
          timer: 1500
        });
        localStorage.setItem("loginData", JSON.stringify(res.data[0]));

        setFormData({ Email: "", Password: "" });
        navigate("/Dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login gagal",
          text: "Email atau password salah"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="Email" className="block text-gray-700 mb-2">Email</label>
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
            <label htmlFor="Password" className="block text-gray-700 mb-2">Password</label>
            <input
              id="Password"
              name="Password"
              type="password"
              placeholder="Masukan Password anda"
              value={formData.Password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full font-bold bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-8">
          <a href="/Register" className="text-sm text-blue-700 hover:underline">
            Belum punya akun? Daftar dulu!
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
