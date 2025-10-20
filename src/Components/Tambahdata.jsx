import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';

function Tambahdata() {
  const [formData, setFormData] = useState({
    Nama: '',
    Jenis: '',
    Tagihan: '',
    Email: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    if (loginData && loginData.Email) {
      setFormData((prev) => ({
        ...prev,
        Email: loginData.Email
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Jenis") {
      let Tagihan = "";
      if (value === "Tagihan SPP") Tagihan = "390000";
      else if (value === "Uang Gedung") Tagihan = "2000000";
      else if (value === "Seragam Sekolah") Tagihan = "30000";

      setFormData({
        ...formData,
        Jenis: value,
        Tagihan: Tagihan,
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

    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      console.log("Respon server:", response.data);

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Data anda telah disimpan",
        showConfirmButton: false,
        timer: 1500,
      });

      localStorage.setItem("loginData", JSON.stringify(formData));

      setFormData({
        Nama: "",
        Jenis: "",
        Tagihan: "",
        Email: "",
      });

      navigate("/Dashboard");
    } catch (error) {
      console.error("Axios error:", error);

      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Tambah data</h2>
        <form onSubmit={handleSubmit}>
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
              <option value="" disabled>Pilih Jenis Tagihan</option>
              <option value="Tagihan SPP">Tagihan SPP</option>
              <option value="Uang Gedung">Uang Gedung</option>
              <option value="Seragam Sekolah">Seragam Sekolah</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="Tagihan" className="block text-gray-700 mb-2">Tagihan</label>
            <input
              id="Tagihan"
              name="Tagihan"
              type="text"
              placeholder="Total tagihan"
              value={formData.Tagihan}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              className={`bg-sky-600 hover:bg-sky-800 rounded focus:outline-none py-2 px-5 text-white font-bold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Tambah"}
            </button>
            <a href="/Dashboard" className="bg-gray-500 hover:bg-gray-800 rounded py-2 px-5 text-white font-bold text-center">
              Kembali
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Tambahdata;
