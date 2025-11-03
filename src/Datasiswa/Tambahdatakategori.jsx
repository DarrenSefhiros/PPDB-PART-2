import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function TambahDataKategori() {
  const [jenisTagihanList, setJenisTagihanList] = useState([]);
  const [formData, setFormData] = useState({
    Nama: '',
    Email: '',
    Jabatan: '',
    Kategori: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Ambil data dari tabel Kesiswaan
    const fetchJenisTagihan = async () => {
      try {
        const res = await axios.get('http://localhost:5000/Kesiswaan');
        setJenisTagihanList(res.data);
      } catch (error) {
        console.error('Gagal fetch jenis tagihan:', error);
      }
    };

    fetchJenisTagihan();

    const loginData = JSON.parse(localStorage.getItem('loginData'));
    if (loginData?.Email) {
      setFormData((prev) => ({ ...prev, Email: loginData.Email }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 // Tambahkan helper function untuk validasi email
const isValidGmail = (email) => {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(email);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Validasi Email
  if (!formData.Email) {
    Swal.fire('Error', 'Email wajib diisi!', 'error');
    setLoading(false);
    return;
  }
  if (!isValidGmail(formData.Email)) {
    Swal.fire('Error', 'Email harus berupa Gmail yang valid!', 'error');
    setLoading(false);
    return;
  }

  try {
    // 🔹 Ganti endpoint POST agar tidak nabrak login
    await axios.post('http://localhost:5000/users', formData);

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data anda telah disimpan.',
      timer: 1500,
      showConfirmButton: false,
    });

    setFormData({
      Nama: '',
      Email: '',
      Jabatan: '',
      Kategori: '',
    });

    navigate('/KategoriData');
  } catch (error) {
    console.error('Error saat submit:', error);
    Swal.fire('Error', 'Gagal menyimpan data!', 'error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Tambah Data
        </h2>
        <form onSubmit={handleSubmit}>
          {/* NAMA */}
          <div className="mb-4">
            <label htmlFor="Nama" className="block text-gray-700 mb-2">
              Nama
            </label>
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

          {/* EMAIL */}
          <div className="mb-4">
            <label htmlFor="Email" className="block text-gray-700 mb-2">
              Email
            </label>
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

          {/* KATEGORI (Dropdown) */}
          <div className="mb-4">
            <label htmlFor="Kategori" className="block text-gray-700 mb-2">
              Kategori
            </label>
            <select
              id="Kategori"
              name="Kategori"
              value={formData.Kategori}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="Guru">Guru</option>
              <option value="Siswa">Siswa</option>
              <option value="Karyawan">Karyawan</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="Jabatan" className="block text-gray-700 mb-2">
              Jabatan
            </label>
            <input
              id="Jabatan"
              name="Jabatan"
              type="text"
              placeholder="Masukan Jabatan anda"
              value={formData.Jabatan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading ? 'Memproses...' : 'Tambah'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/Tagihan')}
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

export default TambahDataKategori;
