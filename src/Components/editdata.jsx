import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../config/api";

function EditData() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Email: "",
    Nama: "",
    Jenis: "",
    Tagihan: "",
    Status: "Belum Lunas",
  });

  // 🔧 Tambahkan ini
  const [jenisTagihanList, setJenisTagihanList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data tagihan yang mau diedit
        const res = await axios.get(`${BASE_URL}/Keuangan${id}`);
        setFormData(res.data);

        // Ambil semua jenis tagihan
        const jenisRes = await axios.get(`${BASE_URL}/JenisTagihan`);
        setJenisTagihanList(jenisRes.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, [id]);

  // 🔧 Saat jenis dipilih, otomatis ubah nominal Tagihan sesuai data dari backend
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Jenis") {
      const selectedJenis = jenisTagihanList.find(
        (item) => item.JenisTagihan === value
      );

      setFormData({
        ...formData,
        Jenis: value,
        Tagihan: selectedJenis ? selectedJenis.Tagihan || "" : "",
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

    try {
      await axios.put(`http://localhost:5000/login/${id}`, formData);

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "Data berhasil diperbarui",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/Tagihan");
    } catch (error) {
      console.error("Gagal update:", error);
      Swal.fire("Error!", "Gagal menyimpan perubahan", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Data
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="Nama" className="block text-gray-700 mb-2">
              Nama
            </label>
            <input
              id="Nama"
              name="Nama"
              type="text"
              value={formData.Nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

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

          <div className="mb-4">
            <label htmlFor="Tagihan" className="block text-gray-700 mb-2">
              Tagihan
            </label>
            <input
              id="Tagihan"
              name="Tagihan"
              type="text"
              value={formData.Tagihan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/Tagihan")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditData;
