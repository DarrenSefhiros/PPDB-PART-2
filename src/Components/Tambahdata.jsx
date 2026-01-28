import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from "../config/api";

function TambahData() {
  const [jenisTagihanList, setJenisTagihanList] = useState([]);
  const [masterDataList, setMasterDataList] = useState([]);
  const [formData, setFormData] = useState({
    nama: '',
    jenis: '',
    tagihan: '',
    tanggal: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJenisTagihan = async () => {
      try {
        const res = await api.get(`/jenistagihan`);
        setJenisTagihanList(res.data);
      } catch (error) {
        console.error('Gagal fetch jenis tagihan:', error);
      }
    };

    const fetchMasterData = async () => {
      try {
        const res = await api.get(`/masterdata`);
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

    if (name === 'nama') {
      const selectedUser = masterDataList.find((item) => item.nama === value);
      setFormData({
        ...formData,
        nama: value,
        email: selectedUser ? selectedUser.email : '',
      });
    } else if (name === 'jenis') {
      const selectedJenis = jenisTagihanList.find(
        (item) => item.jenisTagihan === value
      );
      setFormData({
        ...formData,
        jenis: value,
        tagihan: selectedJenis ? selectedJenis.tagihan || '' : '',
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
      await api.post(`/Keuangan`, {
        nama: formData.nama,
        email: formData.email,
        jenis: formData.jenis,
        status: "Belum Bayar", // default status
        tagihan: parseFloat(formData.tagihan),
        tanggal: formData.tanggal, // yyyy-MM-dd dari input <date>
      });

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data anda telah disimpan.',
        timer: 1500,
        showConfirmButton: false,
      });

      setFormData({
        nama: '',
        jenis: '',
        tagihan: '',
        tanggal: '',
        email: '',
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
          {/* Nama */}
          <div className="mb-4">
            <label htmlFor="nama" className="block text-gray-700 mb-2">
              Nama Siswa
            </label>
            <select
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value="">Pilih Nama Siswa</option>
              {masterDataList
                .filter(item => item.kategori === "Siswa" && item.nama)
                .map((item) => (
                  <option key={item.id} value={item.nama}>
                    {item.nama}
                  </option>
                ))}
            </select>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Jenis Tagihan */}
          <div className="mb-4">
            <label htmlFor="jenis" className="block text-gray-700 mb-2">
              Jenis Tagihan
            </label>
            <select
              id="jenis"
              name="jenis"
              value={formData.jenis}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value="">Pilih Jenis Tagihan</option>
              {jenisTagihanList.map((jenis) => (
                <option key={jenis.id} value={jenis.jenisTagihan}>
                  {jenis.jenisTagihan}
                </option>
              ))}
            </select>
          </div>

          {/* Total Tagihan */}
          <div className="mb-4">
            <label htmlFor="tagihan" className="block text-gray-700 mb-2">
              Total Tagihan
            </label>
            <input
              id="tagihan"
              name="tagihan"
              type="text"
              value={formData.tagihan}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {formData.tagihan && !isNaN(formData.tagihan) && (
              <p className="text-sm text-gray-600 mt-1">
                Rp.{parseInt(formData.tagihan).toLocaleString()}
              </p>
            )}
          </div>

          {/* Tanggal Tagihan */}
          <div className="mb-4">
            <label htmlFor="tanggal" className="block text-gray-700 mb-2">
              Tanggal Tagihan
            </label>
            <input
              id="tanggal"
              name="tanggal"
              type="date"
              value={formData.tanggal}
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
