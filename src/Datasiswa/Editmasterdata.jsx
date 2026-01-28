import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';

function EditMasterData() {
  const { id } = useParams();
  const [kategoriList, setKategoriList] = useState([]);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    jabatan: '',
    kategori: '',
    rfid: '', // ← TAMBAH RFID DI STATE
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await api.get('/Kategori');
        setKategoriList(res.data);
      } catch (error) {
        console.error('Gagal fetch kategori:', error);
      }
    };

    const fetchDataById = async () => {
      try {
        const res = await api.get(`/masterdata/${id}`);

        setFormData({
          nama: res.data.nama || '',
          email: res.data.email || '',
          jabatan: res.data.jabatan || '',
          kategori: res.data.kategori || '',
          rfid: res.data.rfid || '', // ← RFID DITAMPILKAN
        });
      } catch (error) {
        console.error('Gagal fetch data:', error);
        Swal.fire('Error', 'Data tidak ditemukan!', 'error');
        navigate('/MasterData');
      }
    };

    fetchKategori();
    fetchDataById();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.nama || !formData.email || !formData.kategori || !formData.jabatan || !formData.rfid) {
      Swal.fire('Error', 'Semua field wajib diisi termasuk RFID!', 'error');
      setLoading(false);
      return;
    }

    if (!isValidGmail(formData.email)) {
      Swal.fire('Error', 'Email harus valid!', 'error');
      setLoading(false);
      return;
    }

    try {
      await api.put(`/masterdata/${id}`, formData);

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/MasterData');
    } catch (error) {
      console.error('Error saat update:', error);
      Swal.fire('Error', 'Gagal memperbarui data!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Label dinamis
  let jabatanLabel = 'Jabatan';
  let jabatanPlaceholder = 'Masukkan Jabatan';
  if (formData.Kategori === 'Siswa') {
    jabatanLabel = 'Kelas';
    jabatanPlaceholder = 'Masukkan Kelas';
  } else if (formData.Kategori === 'Guru') {
    jabatanLabel = 'Mata Pelajaran';
    jabatanPlaceholder = 'Masukkan Mata Pelajaran';
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Master Data</h2>

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

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* RFID */}
          <div className="mb-4">
            <label className="block mb-1">RFID</label>
            <input
              name="Rfid"
              type="text"
              placeholder="Masukkan Rfid"
              value={formData.rfid}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Kategori */}
          <div className="mb-4">
            <label className="block mb-1">Kategori</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white"
              required
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map((item) => (
                <option key={item.id} value={item.level}>{item.level}</option>
              ))}
            </select>
          </div>

          {/* Jabatan / Kelas / Mapel */}
          <div className="mb-4">
            <label className="block mb-1">{jabatanLabel}</label>
            <input
              name="jabatan"
              type="text"
              placeholder={jabatanPlaceholder}
              value={formData.jabatan}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
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
              onClick={() => navigate('/MasterData')}
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

export default EditMasterData;
