import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EditData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: "",
    Nama: "",
    Jenis: "",
    Harga: "",
    Status: "Belum Lunas",
  });

  const jenisHargaMap = {
    "Tagihan SPP": "390000",
    "Uang Gedung": "2000000",
    "Seragam Sekolah": "30000",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/login/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Jenis") {
      setFormData({
        ...formData,
        Jenis: value,
        Harga: jenisHargaMap[value] || "",
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="Email" className="block text-gray-700 mb-2">Email</label>
            <input
              id="Email"
              name="Email"
              type="email"
              value={formData.Email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="Nama" className="block text-gray-700 mb-2">Nama</label>
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
            <label htmlFor="Jenis" className="block text-gray-700 mb-2">Jenis Pembayaran</label>
            <select
              id="Jenis"
              name="Jenis"
              value={formData.Jenis}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Pilih Jenis</option>
              <option value="Tagihan SPP">Tagihan SPP</option>
              <option value="Uang Gedung">Uang Gedung</option>
              <option value="Seragam Sekolah">Seragam Sekolah</option>
            </select>
          </div>
          <input
            id="Harga"
            name="Harga"
            type="text"
            value={formData.Harga}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
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
