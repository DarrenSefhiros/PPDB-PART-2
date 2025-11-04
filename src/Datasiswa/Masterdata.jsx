import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "../Components/Sidnav";
import { motion } from "framer-motion";

function Masterdata() {
  const [data, setData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]); // untuk dropdown kategori
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Ambil data utama dan daftar kategori unik dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Kesiswaan");
        const reversedData = res.data.reverse();
        setData(reversedData);

        // Ambil kategori unik dari data langsung
        const uniqueKategori = [
          ...new Set(reversedData.map((item) => item.Kategori)),
        ];
        setKategoriList(uniqueKategori);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan kategori dan searchTerm
  const filteredData = data.filter((item) => {
    const matchesKategori =
      selectedKategori === "all" ? true : item.Kategori === selectedKategori;
    const matchesSearch = item.Nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesKategori && matchesSearch;
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
        await axios.delete(`http://localhost:5000/Kesiswaan/${id}`);
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
          className="p-8 w-full max-w-6xl"
        >
          <h2 className="text-2xl font-bold text-pink-700 mb-6">Master Data</h2>

          {/* Box putih berisi search dan dropdown */}
          <div className="bg-white p-5 rounded-md shadow-md mb-8 flex flex-wrap items-center gap-6 justify-between">
            <div className="flex flex-col">
              <label htmlFor="searchNama" className="mb-1 font-semibold text-pink-700">
                Cari Nama
              </label>
              <input
                type="text"
                id="searchNama"
                placeholder="Cari berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-pink-300 rounded-md p-2 w-64 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="text-pink-700 font-semibold text-lg whitespace-nowrap">
              Total Data: {filteredData.length} orang
            </div>
          </div>

          {/* Tabel utama */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-4 text-pink-600">Memuat data...</div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-4 text-pink-600">Data tidak ditemukan.</div>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md overflow-hidden text-sm">
                <thead className="bg-purple-200 text-purple-800">
                  <tr className="text-center">
                    <th className="px-3 py-2 w-10">No</th>
                    <th className="px-4 py-2 w-40 text-left">Nama</th>
                    <th className="px-4 py-2 w-52">Email</th>
                    <th className="px-4 py-2 w-32">Kategori</th>
                    <th className="px-4 py-2 w-32">Jabatan</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-right">
                        {index + 1}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-left">
                        {item.Nama}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center">
                        {item.Email}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center">
                        {item.Kategori}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center">
                        {item.Jabatan}
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

export default Masterdata;
