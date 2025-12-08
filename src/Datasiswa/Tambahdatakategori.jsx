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
    RFID: '', // <<< DITAMBAHKAN
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get('http://localhost:5000/Kategori');
        setKategoriList(res.data);
      } catch (error) {
        console.error('Gagal fetch kategori:', error);
      }
    };

    const fetchKelas = async () => {
      try {
        const res = await axios.get('http://localhost:5000/Kelas');
        setKelasList(res.data);
      } catch (error) {
        console.error('Gagal fetch kelas:', error);
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

    if (!formData.Nama || !formData.Email || !formData.Kategori || !formData.Jabatan || !formData.RFID) {
      Swal.fire('Error', 'Semua field wajib diisi!', 'error');
      setLoading(false);
      return;
    }

    if (!isValidGmail(formData.Email)) {
      Swal.fire('Error', 'Email harus Gmail valid!', 'error');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/Kesiswaan', formData);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil disimpan.',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/MasterData');
    } catch (error) {
      console.error('Error submit:', error);
      Swal.fire('Error', 'Gagal menyimpan data!', 'error');
    } finally {
      setLoading(false);
    }
  };

  let jabatanLabel = 'Jabatan';
  let jabatanInput = (
    <input
      id="Jabatan"
      name="Jabatan"
      type="text"
      placeholder="Masukkan Jabatan"
      value={formData.Jabatan}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md"
      required
    />
  );

  if (formData.Kategori === 'Siswa') {
    jabatanLabel = 'Kelas';
    jabatanInput = (
      <select
        id="Jabatan"
        name="Jabatan"
        value={formData.Jabatan}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
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
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Tambah Master Data</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nama</label>
            <input
              name="Nama"
              type="text"
              value={formData.Nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              name="Email"
              type="email"
              value={formData.Email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Kategori</label>
            <select
              name="Kategori"
              value={formData.Kategori}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white"
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

          <div className="mb-4">
            <label className="block mb-1">{jabatanLabel}</label>
            {jabatanInput}
          </div>

          {/* INPUT RFID MANUAL */}
          <div className="mb-4">
            <label className="block mb-1">RFID</label>
            <input
              name="RFID"
              type="text"
              placeholder="Masukkan RFID"
              value={formData.RFID}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-2 rounded-md font-bold"
            >
              {loading ? 'Memproses...' : 'Tambah'}
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

export default TambahDataKategori;
