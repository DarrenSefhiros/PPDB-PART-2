import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import api from "../config/api";

function EditJenisTagihan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jenisTagihan: "",
    keterangan: "",
    tagihan: "",
    jatuhTempo: "", // simpan di state dengan format yyyy-MM-dd
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/jenistagihan/${id}`);

        // backend kirim dd-MM-yyyy → konversi ke yyyy-MM-dd untuk input <date>
        const convertToInputFormat = (dateStr) => {
          if (!dateStr) return "";
          const [day, month, year] = dateStr.split("-");
          return `${year}-${month}-${day}`;
        };

        setFormData({
          jenisTagihan: res.data.jenisTagihan,
          keterangan: res.data.keterangan,
          tagihan: res.data.tagihan.toString(),
          jatuhTempo: convertToInputFormat(res.data.jatuhTempo),
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

    if (name === "tagihan") {
      value = value.replace(/[^0-9]/g, ""); // hanya angka
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // konversi yyyy-MM-dd → dd-MM-yyyy untuk backend
    const convertToBackendFormat = (dateStr) => {
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    };

    const payload = {
      jenisTagihan: formData.jenisTagihan,
      keterangan: formData.keterangan,
      tagihan: parseInt(formData.tagihan),
      jatuhTempo: convertToBackendFormat(formData.jatuhTempo),
    };

    try {
      await api.put(`/jenistagihan/${id}`, payload);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data jenis tagihan berhasil diperbarui.",
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
                htmlFor="jenisTagihan"
                className="block text-pink-700 font-semibold mb-2"
              >
                Jenis Tagihan
              </label>
              <input
                type="text"
                id="jenisTagihan"
                name="jenisTagihan"
                value={formData.jenisTagihan}
                onChange={handleChange}
                required
                className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="keterangan"
                className="block text-pink-700 font-semibold mb-2"
              >
                Keterangan
              </label>
              <textarea
                id="keterangan"
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                rows="3"
                className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="tagihan"
                className="block text-pink-700 font-semibold mb-2"
              >
                Nominal Tagihan (Rp)
              </label>
              <input
                type="text"
                id="tagihan"
                name="tagihan"
                value={formData.tagihan}
                onChange={handleChange}
                placeholder="Masukkan nominal (contoh: 500000)"
                required
                className="w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label
                htmlFor="jatuhTempo"
                className="block text-pink-700 font-semibold mb-2"
              >
                Jatuh Tempo
              </label>
              <input
                type="date"
                id="jatuhTempo"
                name="jatuhTempo"
                value={formData.jatuhTempo}
                onChange={handleChange}
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
