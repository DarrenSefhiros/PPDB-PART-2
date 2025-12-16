import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

function EditRekapPresensi() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nama: '',
    level: '',
    date: '',
    status: '',
    alasanIjin: '',
    jamMasuk: '',
    jamPulang: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const presensiList = JSON.parse(localStorage.getItem("presensiList") || "[]");
    const presensi = presensiList.find((p) => p.id === id);

    if (presensi) {
      setFormData({
        nama: presensi.nama || '',
        level: presensi.level || '',
        date: presensi.date || '',
        status: presensi.status || '',
        alasanIjin: presensi.alasanIjin || '',
        jamMasuk: presensi.jamMasuk || '',
        jamPulang: presensi.jamPulang || '',
      });
    } else {
      Swal.fire('Error', 'Data presensi tidak ditemukan!', 'error');
      navigate('/Rekappresensi');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.nama || !formData.level || !formData.date || !formData.status) {
      Swal.fire('Error', 'Nama, Level, Tanggal, dan Status wajib diisi!', 'error');
      setLoading(false);
      return;
    }

    try {
      const presensiList = JSON.parse(localStorage.getItem("presensiList") || "[]");
      const updatedList = presensiList.map((p) =>
        p.id === id ? { ...p, ...formData } : p
      );
      localStorage.setItem("presensiList", JSON.stringify(updatedList));

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data presensi berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/Rekappresensi');
    } catch (error) {
      console.error('Error saat update:', error);
      Swal.fire('Error', 'Gagal memperbarui data!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Rekap Presensi</h2>

        <form onSubmit={handleSubmit}>
          {/* Nama */}
          <div className="mb-4">
            <label className="block mb-1">Nama</label>
            <input
              name="nama"
              type="text"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Level */}
          <div className="mb-4">
            <label className="block mb-1">Level</label>
            <input
              name="level"
              type="text"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Tanggal */}
          <div className="mb-4">
            <label className="block mb-1">Tanggal</label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white"
              required
            >
              <option value="">Pilih Status</option>
              <option value="Hadir">Hadir</option>
              <option value="Ijin">Ijin</option>
              <option value="Sakit">Sakit</option>
              <option value="Alpha">Alpha</option>
            </select>
          </div>

          {/* Alasan Ijin */}
          <div className="mb-4">
            <label className="block mb-1">Alasan Ijin</label>
            <input
              name="alasanIjin"
              type="text"
              value={formData.alasanIjin}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Jam Masuk */}
          <div className="mb-4">
            <label className="block mb-1">Jam Masuk</label>
            <input
              name="jamMasuk"
              type="time"
              value={formData.jamMasuk}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Jam Pulang */}
          <div className="mb-4">
            <label className="block mb-1">Jam Pulang</label>
            <input
              name="jamPulang"
              type="time"
              value={formData.jamPulang}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-2 rounded-md font-bold"
            >
              {loading ? 'Memproses...' : 'Update'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/Rekappresensi')}
              className="bg-gray-500 text-white px-6 py-2 rounded-md font-bold"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRekapPresensi;
