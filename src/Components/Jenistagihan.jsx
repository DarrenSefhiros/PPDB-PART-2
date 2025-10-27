import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./sidnav";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function JenisTagihan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/jenistagihan");
        setData(res.data);
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
      cancelButtonText: "Batal", 
    });

    if (konfirmasi.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/jenistagihan/${id}`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Terhapus!", "Data anda telah dihapus", "success");
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Terjadi kesalahan saat menghapus data.";
        Swal.fire("Error!", errorMessage, "error");
      }
    }
  };

  return (
    <div className="flex">
      <Sidnav />
      <div className="ml-60 min-h-screen bg-pink-50 flex flex-col items-center p-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 w-full max-w-5xl"
        >
          <h1 className="text-3xl font-bold text-pink-800 mb-6">Kelola Jenis Tagihan</h1>
          
          <div className="flex justify-between items-center mb-4 gap-2">
            <div className="text-pink-700 font-semibold">
              Total Jenis Tagihan: {data.length}
            </div>
            <div>
              <Link to="/TambahJenisTagihan">
                <button className="bg-pink-500 hover:bg-pink-600 rounded-md text-white font-bold py-2 px-4 transition hover:scale-[1.06]">
                  + Tambah Jenis Tagihan
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto shadow-lg">
            {loading ? (
              <div className="text-center py-4 text-pink-600">Memuat data...</div>
            ) : data.length === 0 ? (
              <div className="text-center py-4 text-pink-600">Belum ada data</div>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md overflow-hidden">
                <thead className="bg-purple-200 text-purple-800">
                  <tr>
                    <th className="px-2 py-2 text-right">No</th>
                    <th className="px-4 py-2 text-center">Jenis Tagihan</th>
                    <th className="px-4 py-2 text-center">Keterangan</th>
                    <th className="px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-right">
                        {index + 1}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center">
                        {item.JenisTagihan}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center">
                        {item.Keterangan}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link to={`/EditJenisTagihan/${item.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded transition hover:scale-[1.09]">
                              ✍ Edit
                            </button>
                          </Link>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition hover:scale-[1.09]"
                            onClick={() => handleDelete(item.id)}
                          >
                            🗑 Hapus
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

export default JenisTagihan;