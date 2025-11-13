import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "../Components/Sidnav";
import { motion } from "framer-motion";

function EditKategoriData() {
  const { id } = useParams(); // ambil ID dari URL
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Level: "",
    Keterangan: "",
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data kategori berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/Kategori/${id}`);
        console.log("Data kategori untuk edit:", res.data);
        setForm({
          Level: res.data.Level || res.data.Status || "",
          Keterangan: res.data.Keterangan || "",
        });
      } catch (err) {
        console.error("Gagal mengambil data kategori:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.message || "Tidak dapat memuat data kategori.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Tangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Submit perubahan data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Level || !form.Keterangan) {
      Swal.fire({
        icon: "warning",
        title: "Form belum lengkap",
        text: "Harap isi semua kolom!",
      });
      return;
    }

    try {
      await axios.put(`http://localhost:5000/Kategori/${id}`, form);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data kategori telah diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/KategoriData"); // kembali ke tabel
    } catch (err) {
      console.error("Gagal memperbarui kategori:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui",
        text: err.message || "Terjadi kesalahan saat memperbarui data.",
      });
    }
  };

  return (
    <div className="flex">
      <div className="ml-50 min-h-screen bg-gradient-to-br from-pink-400 to-purple-600 flex flex-col items-center p-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl mt-6"
        >
          <h2 className="text-3xl font-bold text-pink-800 mb-6 text-center">
            ✍ Edit Kategori
          </h2>

          {loading ? (
            <div className="text-center text-pink-600">Memuat data...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-pink-700 font-semibold mb-2">
                  Level / Status
                </label>
                <input
                  type="text"
                  name="Level"
                  value={form.Level}
                  onChange={handleChange}
                  className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Masukkan Level / Status"
                />
              </div>
              <div className="flex justify-between mt-6">
                <Link to="/KategoriData ">
                  <button
                    type="button"
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Kembali
                  </button>
                </Link>
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition hover:scale-[1.05]"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default EditKategoriData;
