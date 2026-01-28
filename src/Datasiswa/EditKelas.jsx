import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import api from "../config/api";

function EditKelas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    kelas: "",
    jurusan: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data kategori yang mau diedit
        const res = await api.get(`/Kelas/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };
    fetchData();
  }, [id]);

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
      // Update data kategori
      await api.put(`/Kelas/${id}`, formData);

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Data berhasil diperbarui",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/Kelas");
    } catch (error) {
      console.error("Gagal update:", error);
      Swal.fire("Error!", "Gagal menyimpan perubahan", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Kelas    
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label htmlFor="kelas" className="block text-gray-700 mb-2">
              Kelas
            </label>
            <input
              id="kelas"
              name="kelas"
              type="kelas"
              value={formData.kelas}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="jurusan" className="block text-gray-700 mb-2">
              Jurusan
            </label>
            <input
              id="jurusan"
              name="jurusan"
              type="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/Kelas   ")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditKelas;
