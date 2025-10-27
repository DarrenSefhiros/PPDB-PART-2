import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function EditJenisTagihan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    JenisTagihan: "",
    Keterangan: "",
    Tagihan: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/jenistagihan/${id}`);
        setFormData({
          JenisTagihan: res.data.JenisTagihan,
          Keterangan: res.data.Keterangan,
          Tagihan: res.data.Tagihan,
        });
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        Swal.fire("Error!", "Gagal mengambil data dari server", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "Tagihan") {
      value = value.replace(/[^0-9]/g, ""); // hanya angka
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update Jenis Tagihan
      await axios.put(`http://localhost:5000/jenistagihan/${id}`, formData);

      // Update semua siswa yang memakai jenis tagihan ini
      const siswaRes = await axios.get(
        `http://localhost:5000/login?Jenis=${formData.JenisTagihan}`
      );

      for (const siswa of siswaRes.data) {
        await axios.patch(`http://localhost:5000/login/${siswa.id}`, {
          Tagihan: formData.Tagihan,
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data jenis tagihan dan nominal siswa telah diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/JenisTagihan");
    } catch (error) {
      console.error("Gagal update:", error);
      Swal.fire("Error!", "Gagal menyimpan perubahan", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-pink-600">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="ml-30 min-h-screen bg-gradient-to-br from-pink-400 to-purple-600 flex flex-col items-center p-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg my-12"
        >
          <h2 className="text-3xl font-bold text-pink-800 mb-6 text-center">
            Edit Jenis Tagihan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="JenisTagihan"
                className="block text-pink-700 font-semibold mb-2"
              >
                Jenis Tagihan
              </label>
              <input
                type="text"
                id="JenisTagihan"
                name="JenisTagihan"
                value={formData.JenisTagihan}
                onChange={handleChange}
                required
                className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="Keterangan"
                className="block text-pink-700 font-semibold mb-2"
              >
                Keterangan
              </label>
              <textarea
                id="Keterangan"
                name="Keterangan"
                value={formData.Keterangan}
                onChange={handleChange}
                rows="3"
                className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="Tagihan"
                className="block text-pink-700 font-semibold mb-2"
              >
                Nominal Tagihan (Rp)
              </label>
              <input
                type="text"
                id="Tagihan"
                name="Tagihan"
                value={formData.Tagihan}
                onChange={handleChange}
                placeholder="Masukkan nominal (contoh: 500000)"
                required
                className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => navigate("/JenisTagihan")}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
              >
                Kembali
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default EditJenisTagihan;
