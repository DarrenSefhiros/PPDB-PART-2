import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import api from "../config/api";

function Editkategori() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    kategori: "",
    jabatan: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data kategori yang mau diedit
        const res = await api.get(`/masterdata/${id}`);
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
      await api.put(`/masterdata/${id}`, formData);

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Data berhasil diperbarui",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/MasterData");
    } catch (error) {
      console.error("Gagal update:", error);
      Swal.fire("Error!", "Gagal menyimpan perubahan", "error");
    }
  };

    const jabatanLabel = formData.kategori === 'Siswa' ? 'Kelas' : 'Jabatan';
  const jabatanPlaceholder = formData.kategori === 'Siswa' 
    ? 'Masukan Kelas anda' 
    : 'Masukan Jabatan anda';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Kategori
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nama" className="block text-gray-700 mb-2">
              Nama
            </label>
            <input
              id="nama"
              name="nama"
              type="text"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="kategori" className="block text-gray-700 mb-2">
              Pilih Kategori
            </label>
            <select
              id="kategori"
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="Guru">Guru</option>
              <option value="Karyawan">Karyawan</option>
              <option value="Siswa">Siswa</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="jabatan" className="block text-gray-700 mb-2">
              {jabatanLabel}
            </label>
            <input
              id="jabatan"
              name="jabatan"
              type="text"
              placeholder={jabatanPlaceholder}
              value={formData.jabatan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
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
              onClick={() => navigate("/MasterData")}
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

export default Editkategori;
