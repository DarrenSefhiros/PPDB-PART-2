import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

function TambahDataKategori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    jabatan: '',
    kategori: '',
    rfid: '', // <<< DITAMBAHKAN
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

    const fetchKelas = async () => {
      try {
        const res = await api.get('/Kelas');
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

    if (!formData.nama || !formData.email || !formData.jabatan || !formData.kategori || !formData.rfid) {
      Swal.fire('Error', 'Semua field wajib diisi!', 'error');
      setLoading(false);
      return;
    }

    if (!isValidGmail(formData.email)) {
      Swal.fire('Error', 'Email harus valid!', 'error');
      setLoading(false);
      return;
    }

    try {
      await api.post('/masterdata', formData);

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

  let jabatanLabel = 'jabatan';
  let jabatanInput = (
    <input
      id="jabatan"
      name="jabatan"
      type="text"
      placeholder="Masukkan Jabatan"
      value={formData.jabatan}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md"
      required
    />
  );

  if (formData.kategori === 'Siswa') {
    jabatanLabel = 'Kelas';
    jabatanInput = (
      <select
        id="jabatan"
        name="jabatan"
        value={formData.jabatan}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
        required
      >
        <option value="">Pilih Kelas</option>
        {kelasList.map((item) => (
          <option key={item.id} value={item.kelas}>
            {item.kelas}
          </option>
        ))}
      </select>
    );
  } else if (formData.kategori === 'Guru') {
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
              name="nama"
              type="text"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

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
                <option key={item.id} value={item.level}>
                  {item.level}
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
              name="rfid"
              type="text"
              placeholder="Masukkan RFID"
              value={formData.rfid}
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
