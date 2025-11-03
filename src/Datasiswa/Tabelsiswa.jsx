import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "../Components/Sidnav";
import { motion } from "framer-motion";

function TabelKategori() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/login");
        setData(res.data.reverse());
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Hapus data
  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (konfirmasi.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/login/${id}`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Berhasil!", "Data telah dihapus.", "success");
      } catch (err) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  return (
    <div className="flex">
      <Sidnav />
      <div className="ml-60 min-h-screen bg-pink-50 flex flex-col items-center p-5 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 w-full max-w-5xl"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-pink-700">Data Kategori</h2>
            <div className="text-pink-700 font-semibold">
              Total Data: {data.length}
            </div>
            <Link to="/TambahDataKategori">
              <button className="bg-pink-500 hover:bg-pink-600 rounded-md text-white font-bold py-2 px-4 transition hover:scale-[1.05]">
                + Tambah Data
              </button>
            </Link>
          </div>

          {/* Table */}
          <div className="w-full">
            {loading ? (
              <div className="text-center py-4 text-pink-600">
                Memuat data...
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-4 text-pink-600">
                Belum ada data kategori.
              </div>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md overflow-hidden text-sm">
                <thead className="bg-purple-200 text-purple-800">
                  <tr className="text-center">
                    <th className="px-3 py-2 w-10">No</th>
                    <th className="px-4 py-2 w-40 text-left">Nama</th>
                    <th className="px-4 py-2 w-52">Email</th>
                    <th className="px-4 py-2 w-32">Kategori</th>
                    <th className="px-4 py-2 w-32">Jabatan</th>
                    <th className="px-4 py-2 w-48">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-right">
                        {index + 1}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-left text-nowrap">
                        {item.Nama}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center text-nowrap">
                        {item.Email}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center text-nowrap">
                        {item.Kategori}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center text-nowrap">
                        {item.Jabatan}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center align-middle">
                        <div className="flex justify-center items-center gap-2">
                          <Link to={`/Edit/${item.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-10 h-8 flex items-center justify-center rounded-md transition-transform hover:scale-105">
                              ✏️
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold w-10 h-8 flex items-center justify-center rounded-md transition-transform hover:scale-105"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TabelKategori;
