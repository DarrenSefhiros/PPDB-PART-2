import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function TambahDataKelas() {
  const [jenisTagihanList, setJenisTagihanList] = useState([]);
  const [formData, setFormData] = useState({
    Nama: '',
    Kelas: '',
    Jurusan: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Ambil data dari tabel Kesiswaan
    const fetchJenisTagihan = async () => {
      try {
        const res = await axios.get('http://localhost:5000/Kelas');
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
    await axios.post('http://localhost:5000/Kelas', formData);

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data anda telah disimpan.',
      timer: 1500,
      showConfirmButton: false,
    });

    setFormData({
      Nama: '',
      Kelas: '',
      Jurusan: '',
    });

    navigate('/Kelas');
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

           <div className="mb-4">
            <label htmlFor="Kelas" className="block text-gray-700 mb-2">
              Kelas
            </label>
            <select
              id="Kelas"
              name="Kelas"
              value={formData.Kelas}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value="">-- Pilih Kelas --</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>
          </div>

           <div className="mb-4">
            <label htmlFor="Jurusan" className="block text-gray-700 mb-2">
              Jurusan
            </label>
            <select
              id="Jurusan"
              name="Jurusan"
              value={formData.Jurusan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            >
              <option value="">-- Pilih Jurusan --</option>
              <option value="TKJ">TKJ</option>
              <option value="DPB">DPB</option>
              <option value="AKL">AKL</option>
              <option value="TSM">TSM</option>
            </select>
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
              onClick={() => navigate('/Kelas')}
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

export default TambahDataKelas;
