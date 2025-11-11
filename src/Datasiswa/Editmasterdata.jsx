import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

function EditMasterData() {
  const { id } = useParams(); // Ambil ID dari route
  const [kategoriList, setKategoriList] = useState([]);
  const [formData, setFormData] = useState({
    Nama: '',
    Email: '',
    Jabatan: '',
    Kategori: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil data kategori dan data awal form
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get('http://localhost:5000/Kategori');
        setKategoriList(res.data);
      } catch (error) {
        console.error('Gagal fetch data kategori:', error);
      }
    };

    const fetchDataById = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/Kesiswaan/${id}`);
        setFormData({
          Nama: res.data.Nama || '',
          Email: res.data.Email || '',
          Jabatan: res.data.Jabatan || '',
          Kategori: res.data.Kategori || '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.Nama || !formData.Email || !formData.Kategori || !formData.Jabatan) {
      Swal.fire('Error', 'Semua field wajib diisi!', 'error');
      setLoading(false);
      return;
    }

    if (!isValidGmail(formData.Email)) {
      Swal.fire('Error', 'Email harus menggunakan Gmail yang valid!', 'error');
      setLoading(false);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/Kesiswaan/${id}`, formData);

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data anda telah diperbarui.',
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

  // Label dan placeholder dinamis sesuai kategori
  let jabatanLabel = 'Jabatan';
  let jabatanPlaceholder = 'Masukkan Jabatan anda';
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Master Data
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Nama */}
          <div className="mb-4">
            <label htmlFor="Nama" className="block text-gray-700 mb-2">Nama</label>
            <input
              id="Nama"
              name="Nama"
              type="text"
              placeholder="Masukkan Nama"
              value={formData.Nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="Email" className="block text-gray-700 mb-2">Email</label>
            <input
              id="Email"
              name="Email"
              type="email"
              placeholder="Masukkan Email"
              value={formData.Email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Kategori */}
          <div className="mb-4">
            <label htmlFor="Kategori" className="block text-gray-700 mb-2">Kategori</label>
            <select
              id="Kategori"
              name="Kategori"
              value={formData.Kategori}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map((item) => (
                <option key={item.id} value={item.Level}>{item.Level}</option>
              ))}
            </select>
          </div>

          {/* Jabatan/Kelas/Mapel */}
          <div className="mb-4">
            <label htmlFor="Jabatan" className="block text-gray-700 mb-2">{jabatanLabel}</label>
            <input
              id="Jabatan"
              name="Jabatan"
              type="text"
              placeholder={jabatanPlaceholder}
              value={formData.Jabatan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Memproses...' : 'Update'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/MasterData')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
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
