import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "./sidnav";

function Tagihan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJenis, setSelectedJenis] = useState("all");

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

  // Fungsi untuk toggle status belum lunas/sudah lunas
  const handleToggleStatus = async (id) => {
    const itemToUpdate = data.find((item) => item.id === id);
    if (!itemToUpdate) return;

    // Tentukan status baru
    const newStatus =
      itemToUpdate.Status && itemToUpdate.Status.toLowerCase() === "sudah lunas"
        ? "Belum Lunas"
        : "Sudah Lunas";

    try {
      // Update data di backend
      await axios.patch(`http://localhost:5000/login/${id}`, {
        Status: newStatus,
      });

      // Update state lokal supaya UI langsung berubah
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, Status: newStatus } : item
        )
      );

      Swal.fire("Berhasil!", `Status diubah menjadi "${newStatus}"`, "success");
    } catch (err) {
      Swal.fire(
        "Error!",
        "Terjadi kesalahan saat mengubah status.",
        "error"
      );
      console.error(err);
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
        await axios.delete(`http://localhost:5000/login/${id}`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "Data anda telah dihapus", "success");
      } catch (err) {
        Swal.fire("Error!", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  const filteredData = (() => {
    switch (selectedJenis) {
      case "spp":
        return data.filter(
          (item) => item.Jenis?.trim().toLowerCase() === "tagihan spp"
        );
      case "uangGedung":
        return data.filter(
          (item) => item.Jenis?.trim().toLowerCase() === "uang gedung"
        );
      case "seragamSekolah":
        return data.filter(
          (item) => item.Jenis?.trim().toLowerCase() === "seragam sekolah"
        );
      default:
        return data;
    }
  })();

  return (
    <div className="flex">
      <Sidnav />
      <div className="ml-60 min-h-screen bg-pink-50 flex flex-col items-center p-4 w-full">
        <div className="p-8 w-full max-w-5xl">
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
                <option value="spp">Pembayaran SPP</option>
                <option value="uangGedung">Uang Gedung</option>
                <option value="seragamSekolah">Seragam Sekolah</option>
              </select>
            </div>

            <div className="text-pink-700 font-semibold">
              Total Data: {filteredData.length} orang
            </div>

            <div>
              <Link to="/TambahData">
                <button className="bg-pink-500 hover:bg-pink-600 rounded-md text-white font-bold py-2 px-4">
                  + Tambah Data
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-4 text-pink-600">Memuat data...</div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-4 text-pink-600">Belum ada data</div>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md overflow-hidden">
                <thead className="bg-purple-200 text-purple-800">
                  <tr>
                    <th className="px-2 py-2 text-right">No</th>
                    <th className="px-4 py-2 text-center">Nama</th>
                    <th className="px-4 py-2 text-center">Email</th>
                    <th className="px-4 py-2 text-center">Jenis</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Harga</th>
                    <th className="px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-right">
                        {index + 1}
                      </td>
                      <td className="border border-pink-200 px-4 py-2">{item.Nama}</td>
                      <td className="border border-pink-200 px-4 py-2">{item.Email}</td>
                      <td className="border border-pink-200 px-4 py-2">{item.Jenis}</td>
                      <td
                        className={`border border-pink-200 px-4 py-2 text-center font-semibold ${
                          item.Status === "Sudah Lunas"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {item.Status || "Belum Lunas"}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-right">
                        Rp {Number(item.Harga).toLocaleString("id-ID")}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link to={`/Edit/${item.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded my-10">
                              Edit
                            </button>
                          </Link>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded my-auto"
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
                          </button>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded my-auto h-9 text-nowrap"
                            onClick={() => handleToggleStatus(item.id)}
                          >
                            Ubah Status
                          </button>
                        </div>
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
