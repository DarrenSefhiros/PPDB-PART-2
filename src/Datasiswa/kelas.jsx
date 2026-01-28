import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "../Components/Sidnav";
import { motion } from "framer-motion";
import api from "../config/api";

function Kelas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Ambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/Kelas");
        const reversedData = res.data.reverse();
        setData(reversedData);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan kelas dan nama, aman dari undefined
  const filteredData = data.filter((item) => {
    const kelasName = item?.Kelas?.toLowerCase() || "";
    const nama = item?.Nama?.toLowerCase() || "";
    const matchesKelas =
      selectedKelas === "all" ? true : kelasName === selectedKelas.toLowerCase();
    const matchesSearch = nama.includes(searchTerm.toLowerCase());
    return matchesKelas && matchesSearch;
  });

  // Hapus data
  const handleDelete = async (id) => {
    if (!id) return;

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
        await api.delete(`/Kelas/${id}`);
        setData((prev) => prev.filter((item) => item?.id !== id));
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
          className="p-8 w-full max-w-6xl"
        >
          <h2 className="text-2xl font-bold text-pink-700 mb-6">Data Kelas</h2>

          {/* Box putih berisi search dan dropdown */}
          <div className="bg-white p-5 rounded-md shadow-md mb-8 flex flex-wrap items-center gap-6 justify-between">
            <div className="flex flex-col">
              <label htmlFor="kelasFilter" className="mb-1 font-semibold text-pink-700">
                Filter Kelas
              </label>
              <select
                id="kelasFilter"
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="border border-pink-300 rounded-md p-2 w-48 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="all">Semua Data</option>
                {[...new Set(data.map((item) => item?.Kelas).filter(Boolean))].map(
                  (kelas, index) => (
                    <option key={index} value={kelas}>
                      {kelas}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="text-pink-700 font-semibold text-lg whitespace-nowrap text-center">
              Total Kelas: {filteredData.length} 
            </div>

            <div>
              <Link to="/TambahDataKelas">
                <button className="bg-pink-500 hover:bg-pink-600 rounded-md text-white font-bold py-2 px-4 transition hover:scale-[1.06]">
                  + Tambah Data
                </button>
              </Link>
            </div>
          </div>

          {/* Tabel utama */}
          <div className="overflow-x-auto w-full">
            {loading ? (
              <div className="text-center py-4 text-pink-600">Memuat data...</div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-4 text-pink-600">Data tidak ditemukan.</div>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md overflow-hidden text-sm">
                <thead className="bg-purple-200 text-purple-800">
                  <tr className="text-center">
                    <th className="px-3 py-2 w-10 font-bold">No</th>
                    <th className="px-4 py-2 w-52 font-bold">Kelas</th>
                    <th className="px-4 py-2 w-32 font-bold">Jurusan</th>
                    <th className="px-4 py-2 w-48 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <motion.tr
                      key={item?.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-center">{index + 1}</td>
                      <td className="border border-pink-200 px-4 py-2 text-center">{item?.kelas}</td>
                      <td className="border border-pink-200 px-4 py-2 text-center">{item?.jurusan}</td>
                      <td className="border border-pink-200 px-4 py-2 text-center align-middle">
                        <div className="flex justify-center items-center gap-2">
                          <Link to={`/EditKelas/${item?.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-10 h-8 flex items-center justify-center rounded-md transition-transform hover:scale-105">
                              ✏️
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(item?.id)}
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

export default Kelas;
