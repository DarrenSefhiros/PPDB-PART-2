import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function TambahData() {
  const [jenisTagihanList, setJenisTagihanList] = useState([]);
  const [formData, setFormData] = useState({
    Nama: '',
    Jenis: '',
    Tagihan: '',
    Email: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Ambil data dari tabel JenisTagihan
    const fetchJenisTagihan = async () => {
      try {
        const res = await axios.get('http://localhost:5000/jenistagihan');
        setJenisTagihanList(res.data);
      } catch (error) {
        console.error('Gagal fetch jenis tagihan:', error);
      }
    };

    fetchJenisTagihan();

    // 🔹 Ambil Email dari localStorage (jangan diubah)
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    if (loginData?.Email) {
      setFormData((prev) => ({ ...prev, Email: loginData.Email }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Jenis') {
      // 🔹 Cari data jenis yang dipilih
      const selectedJenis = jenisTagihanList.find(
        (item) => item.JenisTagihan === value
      );

      setFormData({
        ...formData,
        Jenis: value,
        // 🔹 Isi otomatis nominal tagihan
        Tagihan: selectedJenis ? selectedJenis.Tagihan || '' : '',
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
      await axios.post('http://localhost:5000/login', formData);

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data anda telah disimpan.',
        timer: 1500,
        showConfirmButton: false,
      });

      setFormData({
        Nama: '',
        Jenis: '',
        Tagihan: '',
        Email: formData.Email, // tetap simpan email
      });

      navigate('/Dashboard');
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

          {/* JENIS TAGIHAN */}
          <div className="mb-4">
            <label htmlFor="Jenis" className="block text-gray-700 mb-2">
              Jenis Tagihan
            </label>
            <select
              id="Jenis"
              name="Jenis"
              value={formData.Jenis}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value="">Pilih Jenis Tagihan</option>
              {jenisTagihanList.map((jenis) => (
                <option key={jenis.id} value={jenis.JenisTagihan}>
                  {jenis.JenisTagihan}
                </option>
              ))}
            </select>
          </div>

          {/* TOTAL TAGIHAN (otomatis muncul) */}
          <div className="mb-4">
            <label htmlFor="Tagihan" className="block text-gray-700 mb-2">
              Total Tagihan
            </label>
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
          <input type="hidden" name="Email" value={formData.Email} />
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

export default TambahData;
