import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "./sidnav";

function Tagihan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJenis, setSelectedJenis] = useState("all"); // pilihan dropdown

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/login");
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
    Swal.fire({
      title: "Serius Kamu?",
      text: "Data tidak akan bisa dikembalikan jika telah dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus data",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/login/${id}`);
          setData((prev) => prev.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Data anda telah dihapus", "success");
        } catch (err) {
          console.error("Gagal menghapus data:", err);
          Swal.fire("Error!", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };
  
  const filteredData = (() => {
    switch (selectedJenis) {
      case "spp":
        return data.filter((item) => item.Jenis.toLowerCase() === "spp");
      case "uangGedung":
        return data.filter((item) => item.Jenis.toLowerCase() === "uang gedung");
      case "seragamSekolah":
        return data.filter((item) => item.Jenis.toLowerCase() === "seragam sekolah");
      default:
        return data;
    }
  })();

  return (
    <div className="flex">
      <Sidnav />
      <div className="ml-60 min-h-screen bg-pink-50 flex flex-col items-center p-4 w-full">
        <div className="p-8 w-full max-w-5xl">
          <div className="flex justify-end mb-1">
            <Link to="/TambahData">
              <button className="bg-pink-500 hover:bg-pink-600 rounded-md text-white font-bold py-2 px-6">
                + Tambah Data
              </button>
            </Link>
          </div>
          <div className="mb-1 w-60">
            <label htmlFor="jenisPembayaran" className="block mb-0.5 font-semibold text-pink-700">
              Jenis Pembayaran
            </label>
            <select
              id="jenisPembayaran"
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="w-full p-1.5 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">Semua Data</option>
              <option value="spp">Pembayaran SPP</option>
              <option value="uangGedung">Uang Gedung</option>
              <option value="seragamSekolah">Seragam Sekolah</option>
            </select>
          </div>
          <h3 className="text-xl font-semibold text-pink-700 mb-0">
            Total Data: {filteredData.length} orang
          </h3>

          <div className="overflow-x-auto mt-1">
            {loading ? (
              <div className="text-center py-4 text-pink-600">Memuat data...</div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-4 text-pink-600">Belum ada data</div>
            ) : selectedJenis === "all" ? (
              <table className="min-w-full border border-pink-200 rounded-md overflow-hidden">
                <thead className="bg-purple-200 text-purple-800">
                  <tr>
                    <th className="px-2 py-2 text-right">No</th>
                    <th className="px-4 py-2 text-center">Nama</th>
                    <th className="px-4 py-2 text-center">Email</th>
                    <th className="px-4 py-2 text-center">Jenis</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Harga</th>
                    <th className="px-4 py-2 text-center">Ubah</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-right w-12">
                        {index + 1}
                      </td>
                      <td className="border border-pink-200 px-4 py-2">{item.Nama}</td>
                      <td className="border border-pink-200 px-4 py-2">{item.Email}</td>
                      <td className="border border-pink-200 px-4 py-2">{item.Jenis}</td>
                      <td className="border border-pink-200 px-4 py-2 text-center">
                        {item.Status}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-left">
                        Rp {Number(item.Harga).toLocaleString("id-ID")}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link to={`/Edit/${item.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                              Edit
                            </button>
                          </Link>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md overflow-hidden">
                <thead className="bg-purple-200 text-purple-800">
                  <tr>
                    <th className="px-2 py-2 text-right">No</th>
                    <th className="px-4 py-2 text-center">Nama</th>
                    <th className="px-4 py-2 text-center">Email</th>
                    <th className="px-4 py-2 text-center">Jenis Pembayaran</th>
                    <th className="px-4 py-2 text-center">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-right w-12">
                        {index + 1}
                      </td>
                      <td className="border border-pink-200 px-4 py-2">{item.Nama}</td>
                      <td className="border border-pink-200 px-4 py-2">{item.Email}</td>
                      <td className="border border-pink-200 px-4 py-2">{item.Jenis}</td>
                      <td className="border border-pink-200 px-4 py-2 text-left">
                        Rp {Number(item.Harga).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tagihan;
