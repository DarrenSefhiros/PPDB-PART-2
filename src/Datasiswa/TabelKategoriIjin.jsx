import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Sidnav from "../Components/Sidnav";

function TabelKategoriIjin() {
  const [kategoriIjinList, setKategoriIjinList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKategoriIjin();
  }, []);

  const loadKategoriIjin = async () => {
    try {
      const res = await axios.get("http://localhost:5000/KategoriIjin");
      setKategoriIjinList(res.data);
    } catch (err) {
      console.error("Gagal mengambil data kategori ijin:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Kategori Ijin?",
      text: "Data ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/KategoriIjin/${id}`);
        Swal.fire("Berhasil!", "Kategori ijin berhasil dihapus.", "success");
        loadKategoriIjin();
      } catch (err) {
        console.error("Gagal menghapus kategori ijin:", err);
        Swal.fire("Error", "Gagal menghapus kategori ijin!", "error");
      }
    }
  };

  return (
    <div className="flex">
      <Sidnav />
      <div className="ml-60 min-h-screen bg-pink-50 p-5 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 w-full max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-pink-700">
              Kategori Ijin
            </h2>
            <Link
              to="/TambahKategoriIjin"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow"
            >
              + Tambah Kategori Ijin
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-pink-600">Memuat data...</div>
          ) : kategoriIjinList.length === 0 ? (
            <div className="text-center py-8 text-pink-600">
              Belum ada kategori ijin.
            </div>
          ) : (
            <table className="min-w-full border border-pink-200 rounded-md text-sm">
              <thead className="bg-purple-200 text-purple-800">
                <tr className="text-center">
                  <th>No</th>
                  <th>Nama Kategori Ijin</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kategoriIjinList.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="bg-pink-100 hover:bg-pink-200"
                  >
                    <td className="border text-center">{idx + 1}</td>
                    <td className="border px-4 py-2">{item.KategoriIjin}</td>
                    <td className="border text-center">
                      <Link
                        to={`/EditKategoriIjin/${item.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2 inline-block"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleHapus(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                      >
                        🗑️
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default TabelKategoriIjin;
