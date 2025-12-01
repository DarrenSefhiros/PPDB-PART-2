import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function TambahDataKategori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [formData, setFormData] = useState({
    Nama: '',
    Email: '',
    Jabatan: '',
    Kategori: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
  const fetchKategori = async () => {
    try {
      const res = await axios.get('http://localhost:5000/Kategori');
      setKategoriList(res.data);
    } catch (error) {
      console.error('Gagal fetch data kategori:', error);
    }
  };


  const fetchKelas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/Kelas');
      setKelasList(res.data);
    } catch (error) {
      console.error('Gagal fetch data kelas:', error);
    }
  };

  fetchKategori();
  fetchKelas();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await axios.post('http://localhost:5000/Kesiswaan', formData);

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

      navigate('/MasterData');
    } catch (error) {
      console.error('Error saat submit:', error);
      Swal.fire('Error', 'Gagal menyimpan data!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Label dan placeholder / type dinamis
  let jabatanLabel = 'Jabatan';
  let jabatanInput = (
    <input
      id="Jabatan"
      name="Jabatan"
      type="text"
      placeholder="Masukkan Jabatan"
      value={formData.Jabatan}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
      required
    />
  );

  if (formData.Kategori === 'Siswa') {
    jabatanLabel = 'Kelas';
    // Gunakan select dropdown untuk kelas
    jabatanInput = (
      <select
        id="Jabatan"
        name="Jabatan"
        value={formData.Jabatan}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
        required
      >
        <option value="">Pilih Kelas</option>
        {kelasList.map((item) => (
          <option key={item.id} value={item.Kelas}>
            {item.Kelas}
          </option>
        ))}
      </select>
    );
  } else if (formData.Kategori === 'Guru') {
    jabatanLabel = 'Mata Pelajaran';
    jabatanInput = (
      <input
        id="Jabatan"
        name="Jabatan"
        type="text"
        placeholder="Masukkan Mata Pelajaran anda"
        value={formData.Jabatan}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        required
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Tambah Master Data
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
              <option value="">Pilih Kategori</option>
              {kategoriList.map((item) => (
                <option key={item.id} value={item.Level}>
                  {item.Level}
                </option>
              ))}
            </select>
          </div>

          {/* JABATAN / KELAS / MAPEL */}
          <div className="mb-4">
            <label htmlFor="Jabatan" className="block text-gray-700 mb-2">
              {jabatanLabel}
            </label>
            {jabatanInput}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Memproses...' : 'Tambah'}
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

export default TambahDataKategori;
