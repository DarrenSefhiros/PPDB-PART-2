import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

function TambahData2() {
  const [formData, setFormData] = useState({
    level: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/Kategori", formData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kategori berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/KategoriData");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal menambahkan data", "error");
    }
  };

  return (
    <div className="flex">
      <div className="ml-30 p-6 w-full min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 my-14">
          <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">
            Tambah Kategori
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">
                Level
              </label>
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-pink-400 focus:outline-none"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-bold"
              >
                Tambah
              </button>
              <button
                type="button"
                onClick={() => navigate("/KategoriData")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TambahData2;
