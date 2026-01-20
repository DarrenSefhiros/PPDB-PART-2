import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../config/api";

function TambahData() {
  const [jenisTagihanList, setJenisTagihanList] = useState([]);
  const [masterDataList, setMasterDataList] = useState([]); // Ambil master data untuk Nama & Email
  const [formData, setFormData] = useState({
    Nama: '',
    Jenis: '',
    Tagihan: '',
    Tanggal: '',
    Email: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data Jenis Tagihan
    const fetchJenisTagihan = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/JenisTagihan`);
        setJenisTagihanList(res.data);
      } catch (error) {
        console.error('Gagal fetch jenis tagihan:', error);
      }
    };

    // Ambil Master Data (misal: Siswa/Guru)
    const fetchMasterData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/Kesiswaan`); // endpoint master data
        setMasterDataList(res.data);
      } catch (error) {
        console.error('Gagal fetch master data:', error);
      }
    };

    fetchJenisTagihan();
    fetchMasterData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Nama') {
      // Cari master data yang dipilih
      const selectedUser = masterDataList.find((item) => item.Nama === value);

      setFormData({
        ...formData,
        Nama: value,
        Email: selectedUser ? selectedUser.Email : '',
      });
    } else if (name === 'Jenis') {
      const selectedJenis = jenisTagihanList.find(
        (item) => item.JenisTagihan === value
      );
      setFormData({
        ...formData,
        Jenis: value,
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
      await axios.post(`${BASE_URL}/Keuangan`, formData);

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
        Tanggal: '',
        Email: '',
      });

      navigate('/Tagihan');
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
          {/* NAMA (dropdown dari master data) */}
    {/* NAMA (dropdown dari master data) */}
{/* NAMA (dropdown hanya untuk siswa) */}
<div className="mb-4">
  <label htmlFor="Nama" className="block text-gray-700 mb-2">
    Nama Siswa
  </label>
  <select
    id="Nama"
    name="Nama"
    value={formData.Nama}
    onChange={handleChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
    required
  >
    <option value="">Pilih Nama Siswa</option>
    {masterDataList
      .filter(item => item.Kategori === "Siswa" && item.Nama && item.Nama.trim() !== '') // filter siswa dan nama tidak kosong
      .map((item) => (
        <option key={item.id} value={item.Nama}>
          {item.Nama}
        </option>
      ))}
  </select>
</div>



          {/* Email otomatis dari master data */}
          <div className="mb-4">
            <label htmlFor="Email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="Email"
              name="Email"
              type="email"
              value={formData.Email}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
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

          {/* TOTAL TAGIHAN */}
          <div className="mb-4">
            <label htmlFor="Tagihan" className="block text-gray-700 mb-2">
              Total Tagihan
            </label>
            <input
              id="Tagihan"
              name="Tagihan"
              type="text"
              placeholder="Masukkan jenis tagihan"
              value={formData.Tagihan}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {formData.Tagihan && !isNaN(formData.Tagihan) && (
              <p className="text-sm text-gray-600 mt-1">Rp.{parseInt(formData.Tagihan).toLocaleString()}</p>
            )}
          </div>

          {/* TANGGAL TAGIHAN */}
          <div className="mb-4">
            <label htmlFor="Tanggal" className="block text-gray-700 mb-2">
              Tanggal Tagihan
            </label>
            <input
              id="Tanggal"
              name="Tanggal"
              type="date"
              value={formData.Tanggal}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

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
