import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';

function Login() {
  const [formData, setFormData] = useState({
    Email: '',
    Nama: '',
    Jenis: '',
    Harga: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Jenis") {
      let harga = "";
      if (value === "Tagihan SPP") harga = "390000";
      else if (value === "Uang Gedung") harga = "2000000";
      else if (value === "Seragam Sekolah") harga = "30000";

      setFormData({
        ...formData,
        Jenis: value,
        Harga: harga,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submit form with:", formData);
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      console.log("Respon server:", response.data);

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
        Nama: "",
        Jenis: "",
        Harga: ""
      });

      navigate("/Dashboard");
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
            <label htmlFor="Nama" className="block text-gray-700 mb-2">Nama</label>
            <input
              id="Nama"
              name="Nama"
              type="text"
              placeholder="Masukan Nama anda"
              value={formData.Nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Jenis" className="block text-gray-700 mb-2">Jenis</label>
            <select
              id="Jenis"
              name="Jenis"
              value={formData.Jenis}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value="" disabled>Pilih Jenis Pembayaran</option>
              <option value="Tagihan SPP">Tagihan SPP</option>
              <option value="Uang Gedung">Uang Gedung</option>
              <option value="Seragam Sekolah">Seragam Sekolah</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="Harga" className="block text-gray-700 mb-2">Harga</label>
            <input
              id="Harga"
              name="Harga"
              type="text"
              placeholder="Harga akan muncul otomatis"
              value={formData.Harga}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
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
