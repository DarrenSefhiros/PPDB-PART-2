  import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import axios from "axios";
  import Swal from "sweetalert2";
  import Sidnav from "./Sidnav";
  import { motion } from "framer-motion";

 function Rekaptagihan() {
  const [data, setData] = useState([]);
  const [jenisTagihan, setJenisTagihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJenis, setSelectedJenis] = useState("all");

  // Pindahkan fungsi formatDate ke sini
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // bulan mulai dari 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/login");
        setData(res.data.reverse());

        const jenisRes = await axios.get("http://localhost:5000/jenistagihan");
        setJenisTagihan(jenisRes.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        await axios.delete(`http://localhost:5000/login/${id}`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Terhapus!", "Data anda telah dihapus", "success");
      } catch (err) {
        Swal.fire("Error!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  // ...sisa kode tetap sama


    // ✅ Filter berdasarkan jenis tagihan yang dipilih
    const filteredData =
      selectedJenis === "all"
        ? data
        : data.filter(
            (item) =>
              item.Jenis?.trim().toLowerCase() === selectedJenis.toLowerCase()
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
                    <option key={jenis.id} value={jenis.JenisTagihan}>
                      {jenis.JenisTagihan}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-pink-700 font-semibold">
                Total Data: {filteredData.length} orang
              </div>

            </div>

            <div className="overflow-x-auto">
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
          <td className="border border-pink-200 px-4 py-2 text-left text-nowrap align-middle">
            {item.Nama}
          </td>
          <td className="border border-pink-200 px-4 py-2 text-center text-nowrap align-middle">
            {item.Email}
          </td>
          <td className="border border-pink-200 px-4 py-2 text-center text-nowrap align-middle">
            {item.Jenis}
          </td>
          <td className="border border-pink-200 px-4 py-2 text-right text-nowrap align-middle">
            Rp{" "}
            {Number(String(item.Tagihan).replace(/\./g, "") || 0).toLocaleString(
              "id-ID"
            )}
          </td>
          <td className="border border-pink-200 px-4 py-2 text-center text-nowrap align-middle">
            {formatDate(item.Tanggal)}
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

  export default Rekaptagihan;
