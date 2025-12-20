import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Sidnav from "../Components/Sidnav";
import { motion } from "framer-motion";

function RekapPresensi() {
  const [kesiswaan, setKesiswaan] = useState([]);
  const [presensiList, setPresensiList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FILTER STATE
  // ===============================
  const [filterMode, setFilterMode] = useState("harian");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // ===============================
  // FORMAT TANGGAL
  // ===============================
  const formatTanggalIndo = (d) =>
    new Date(d).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    });

  // ===============================
  // FETCH DATA KESISWAAN + PRESENSI
  // ===============================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/Kesiswaan");

        const cleaned = (res.data || [])
          .filter(Boolean)
          .filter((d) => d.Nama && d.Nama.trim() !== "");

        setKesiswaan(cleaned);

        // 🔥 Bentuk data presensi dari lastPresensi
        const presensi = cleaned
          .filter((u) => u.lastPresensi?.date)
          .map((u) => {
            let status = "—";
            if (u.lastPresensi.ijin) status = "ijin";
            else if (u.lastPresensi.jamPulang) status = "keluar";
            else if (u.lastPresensi.jamMasuk) status = "masuk";

            return {
              id: u.id,
              nama: u.Nama,
              rfid: u.RFID,
              level: u.Kategori,
              date: u.lastPresensi.date,
              status,
              alasanIjin: u.lastPresensi.ijin?.alasan || "-",
              jamMasuk: u.lastPresensi.jamMasuk || null,
              jamPulang: u.lastPresensi.jamPulang || null,
            };
          });

        setPresensiList(presensi);
      } catch (err) {
        Swal.fire("Error", "Gagal memuat data presensi", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ===============================
  // LIST BULAN & TAHUN OTOMATIS
  // ===============================
  const tahunList = Array.from(
    new Set(presensiList.map((p) => new Date(p.date).getFullYear()))
  ).sort((a, b) => b - a);

  const bulanList = Array.from(
    new Set(
      presensiList.map((p) => {
        const d = new Date(p.date);
        return `${d.getMonth() + 1}-${d.getFullYear()}`;
      })
    )
  );

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  useEffect(() => {
    if (filterMode === "bulanan" && bulanList.length > 0) {
      const [m, y] = bulanList[0].split("-");
      setSelectedMonth(m);
      setSelectedYear(y);
    }
    if (filterMode === "tahunan" && tahunList.length > 0) {
      setSelectedYear(tahunList[0]);
    }
  }, [filterMode, presensiList]);

  // ===============================
  // FILTER DATA
  // ===============================
  const presensiFiltered = presensiList.filter((p) => {
    const d = new Date(p.date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    if (filterMode === "harian") {
      const s = new Date(selectedDate);
      return (
        day === s.getDate() &&
        month === s.getMonth() + 1 &&
        year === s.getFullYear()
      );
    }

    if (filterMode === "bulanan") {
      return month === Number(selectedMonth) && year === Number(selectedYear);
    }

    if (filterMode === "tahunan") {
      return year === Number(selectedYear);
    }

    return true;
  });

  // ===============================
  // HAPUS PRESENSI
  // ===============================
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

    if (!konfirmasi.isConfirmed) return;

    try {
      // Hapus lastPresensi di backend
      const siswa = kesiswaan.find((k) => k.id === id);
      if (siswa) {
        await axios.put(`http://localhost:5000/Kesiswaan/${id}`, {
          ...siswa,
          lastPresensi: null,
        });
      }

      setPresensiList((prev) => prev.filter((p) => p.id !== id));
      Swal.fire("Terhapus!", "Data presensi telah dihapus", "success");
    } catch (err) {
      Swal.fire("Error", "Gagal menghapus presensi", "error");
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="flex">
      <Sidnav />
      <div className="ml-60 min-h-screen bg-pink-50 p-5 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-pink-700 mb-6">
            Rekap Presensi
          </h2>

          {/* FILTER */}
          <div className="bg-white p-5 rounded-md shadow mb-6 flex gap-6 flex-wrap">
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="border p-2 rounded-md"
            >
              <option value="harian">Harian</option>
              <option value="bulanan">Bulanan</option>
              <option value="tahunan">Tahunan</option>
            </select>

            {filterMode === "harian" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2 rounded-md"
              />
            )}

            {filterMode === "bulanan" && (
              <>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border p-2 rounded-md"
                >
                  {bulanList.map((b) => {
                    const [m] = b.split("-");
                    return (
                      <option key={b} value={m}>
                        {namaBulan[m - 1]}
                      </option>
                    );
                  })}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border p-2 rounded-md"
                >
                  {tahunList.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </>
            )}

            {filterMode === "tahunan" && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border p-2 rounded-md"
              >
                {tahunList.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            {loading ? (
              <div className="text-center py-4 text-pink-600">Memuat data...</div>
            ) : presensiFiltered.length === 0 ? (
              <div className="text-center py-4 text-pink-600">Tidak ada data presensi</div>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md overflow-hidden text-sm">
                <thead className="bg-purple-200 text-purple-800">
                  <tr className="text-center">
                    <th className="px-3  w-10 font-bold">No</th>
                    <th className="px-4  w-40 text-left font-bold">Nama</th>
                    <th className="px-4  w-52 font-bold">RFID</th>
                    <th className="px-4  w-36 font-bold">Level</th>
                    <th className="px-4  w-36 font-bold">Tanggal</th>
                    <th className="px-4  w-32 font-bold">Status</th>
                    <th className="px-4  w-40 font-bold">Alasan Ijin</th>
                    <th className="px-4  w-32 font-bold">Masuk</th>
                    <th className="px-4  w-32 font-bold">Pulang</th>
                    <th className="px-4  w-48 font-bold">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {presensiFiltered.map((p, i) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-center">
                        {i + 1}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-left text-nowrap align-middle">
                        {p.nama}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center text-nowrap align-middle">
                        {p.rfid || "—"}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center text-nowrap align-middle">
                        {p.level}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center text-nowrap align-middle">
                        {formatTanggalIndo(p.date)}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center font-semibold text-nowrap align-middle">
                        {p.status}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center text-nowrap align-middle">
                        {p.alasanIjin}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center text-nowrap align-middle">
                        {p.jamMasuk || "—"}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center text-nowrap align-middle">
                        {p.jamPulang || "—"}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-center align-middle">
                        <div className="flex justify-center items-center gap-2">
                          <Link to={`/EditRekapPresensi/${p.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-10 h-8 flex items-center justify-center rounded-md transition-transform hover:scale-105">
                              ✏️
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold w-12 h-8 flex items-center justify-center rounded-md transition-transform hover:scale-105"
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

export default RekapPresensi;
