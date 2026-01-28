import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Sidnav from "./Sidnav";
import { motion } from "framer-motion";
import api from "../config/api";

function Tagihan() {
  const [data, setData] = useState([]);
  const [jenisTagihan, setJenisTagihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJenis, setSelectedJenis] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/keuangan`);
        setData(res.data.reverse());

        const jenisRes = await api.get(`/jenistagihan`);
        setJenisTagihan(jenisRes.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleStatus = async (id) => {
    const itemToUpdate = data.find((item) => item.id === id);
    if (!itemToUpdate) return;

    const newStatus =
      itemToUpdate.status?.toLowerCase() === "sudah lunas"
        ? "Belum Lunas"
        : "Sudah Lunas";

    const konfirmasi = await Swal.fire({
      title: "Ubah Status Pembayaran?",
      text: `Status akan diubah menjadi: ${newStatus}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, ubah",
      cancelButtonText: "Batal",
    });

    if (konfirmasi.isConfirmed) {
      try {
        await api.patch(`/keuangan/${id}`, { status: newStatus });

        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );

        Swal.fire({
          title: "Berhasil!",
          text: `Status berhasil diubah ke "${newStatus}"`,
          icon: "success",
        });
      } catch (err) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat mengubah status.", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Serius Kamu?",
      text: "Data tidak akan bisa dikembalikan jika telah dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus data",
    });

    if (konfirmasi.isConfirmed) {
      try {
        await api.delete(`/keuangan/${id}`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Terhapus!", "Data anda telah dihapus", "success");
      } catch (err) {
        Swal.fire("Error!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  // Format tanggal ke dd/MM/yyyy
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // Filter data berdasarkan jenis
  const filteredData =
    selectedJenis === "all"
      ? data
      : data.filter(
          (item) =>
            item.jenis?.trim().toLowerCase() === selectedJenis.toLowerCase()
        );

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
          <div className="flex flex-wrap items-end justify-between mb-4 gap-2">
            <div>
              <label
                htmlFor="jenisPembayaran"
                className="block mb-1 font-semibold text-pink-700"
              >
                Jenis Tagihan
              </label>

              <select
                id="jenisPembayaran"
                value={selectedJenis}
                onChange={(e) => setSelectedJenis(e.target.value)}
                className="w-48 p-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="all">Semua Data</option>
                {jenisTagihan.map((jenis) => (
                  <option key={jenis.id} value={jenis.jenisTagihan}>
                    {jenis.jenisTagihan}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-pink-700 font-semibold">
              Total Data: {filteredData.length} orang
            </div>

            <div>
              <Link to="/TambahData">
                <button className="bg-pink-500 hover:bg-pink-600 rounded-md text-white font-bold py-2 px-4 transition hover:scale-[1.06]">
                  + Tambah Data
                </button>
              </Link>
            </div>
          </div>

          <div>
            {loading ? (
              <div className="text-center py-4 text-pink-600">Memuat data...</div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-4 text-pink-600">Belum ada data</div>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md overflow-hidden text-sm">
                <thead className="bg-purple-200 text-purple-800">
                  <tr className="text-center">
                    <th className="px-3 py-2 w-10 font-bold">No</th>
                    <th className="px-4 py-2 w-40 text-left font-bold">Nama</th>
                    <th className="px-4 py-2 w-52 font-bold">Email</th>
                    <th className="px-4 py-2 w-36 font-bold">Jenis</th>
                    <th className="px-4 py-2 w-32 font-bold">Tagihan</th>
                    <th className="px-4 py-2 w-36 font-bold">Tanggal</th>
                    <th className="px-4 py-2 w-32 font-bold">Status</th>
                    <th className="px-4 py-2 w-48 font-bold">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-left align-middle">
                        {item.nama}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center align-middle">
                        {item.email}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center align-middle">
                        {item.jenis}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-right align-middle">
                        Rp {Number(item.tagihan || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center align-middle">
                        {formatDate(item.tanggal)}
                      </td>
                      <td
                        className={`border border-pink-200 px-4 py-2 text-center font-semibold align-middle ${
                          item.status === "Sudah Lunas"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {item.status || "Belum Lunas"}
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
                            className="bg-red-500 hover:bg-red-600 text-white font-bold w-12 h-8 flex items-center justify-center rounded-md transition-transform hover:scale-105"
                          >
                            🗑️
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className="bg-green-500 hover:bg-green-600 text-white text-nowrap font-bold text-xs py-2 px-3 font-sans text-2xl rounded-md transition-transform hover:scale-105"
                          >
                            Ubah Status
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

export default Tagihan  