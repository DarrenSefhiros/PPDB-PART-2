import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';

function Register() {
  const [formData, setFormData] = useState({
    Nama: '',
    Email: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    });

    navigate("/Login");
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
          <div className="mb-4">
            <label htmlFor="Email" className="block text-gray-700 mb-2">Email</label>
            <input
              id="Email"
              name="Email"
              type="Email"
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
              type="Nama"
              placeholder="Masukan Nama anda"
              value={formData.Nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>
<div className="flex justify-between mt-6">
  <button
    className="bg-sky-600 hover:bg-sky-800 rounded focus:outline-none py-2 px-5 text-white font-bold"
    type="submit"
  >
    Masuk
  </button>
  <a href="/" className="bg-gray-500 hover:bg-gray-800 rounded py-2 px-5 text-white font-bold text-center">
    Kembali
  </a>
</div>
        </form>
      </div>
    </div>
  );
}

export default Register;
