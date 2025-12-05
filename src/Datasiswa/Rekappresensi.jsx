import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "../Components/Sidnav";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function RekapPresensi() {
  const [kesiswaan, setKesiswaan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [presensiList, setPresensiList] = useState(() => {
    const saved = localStorage.getItem("presensiList");
    return saved ? JSON.parse(saved) : [];
  });

  // Filter mode
  const [filterMode, setFilterMode] = useState("harian");

  // Sub filters
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Format tanggal Indonesia
  const formatTanggalIndo = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    });
  };

  // Fetch kesiswaan
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/Kesiswaan");
        const cleaned = (res.data || [])
          .filter(Boolean)
          .filter((d) => d.Nama && d.Nama.trim() !== "");
        setKesiswaan(cleaned);
      } catch {
        Swal.fire("Error", "Gagal memuat data kesiswaan", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Generate tahun + bulan otomatis dari presensi
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
  ).sort((a, b) => {
    const [m1, y1] = a.split("-").map(Number);
    const [m2, y2] = b.split("-").map(Number);
    return y2 - y1 || m2 - m1;
  });

  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Default bulan & tahun otomatis
  useEffect(() => {
    if (bulanList.length > 0 && filterMode === "bulanan") {
      const [m, y] = bulanList[0].split("-");
      setSelectedMonth(m);
      setSelectedYear(y);
    } else if (tahunList.length > 0 && filterMode === "tahunan") {
      setSelectedYear(tahunList[0]);
    }
  }, [presensiList, filterMode]);

  // Filtering presensi
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

  return (
    <div className="flex">
      <Sidnav />
      <div className="ml-60 min-h-screen bg-pink-50 p-5 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 w-full max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-pink-700 mb-6">
            Rekap Presensi
          </h2>

          {/* FILTER PANEL */}
          <div className="bg-white p-5 rounded-md shadow-md mb-6 flex gap-6 items-end flex-wrap">

            {/* Filter */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-pink-700">Filter</label>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="border border-pink-300 rounded-md p-2 w-56"
              >
                <option value="harian">Harian</option>
                <option value="bulanan">Bulanan</option>
                <option value="tahunan">Tahunan</option>
              </select>
            </div>

            {/* Harian */}
            {filterMode === "harian" && (
              <div className="flex flex-col">
                <label className="mb-1 font-semibold text-pink-700">
                  Pilih Tanggal
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-pink-300 rounded-md p-2"
                />
              </div>
            )}

            {/* Bulanan */}
            {filterMode === "bulanan" && bulanList.length > 0 && (
              <>
                <div className="flex flex-col">
                  <label className="mb-1 font-semibold text-pink-700">Bulan</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-pink-300 rounded-md p-2"
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
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-semibold text-pink-700">Tahun</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border border-pink-300 rounded-md p-2"
                  >
                    {tahunList.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Tahunan */}
            {filterMode === "tahunan" && tahunList.length > 0 && (
              <div className="flex flex-col">
                <label className="mb-1 font-semibold text-pink-700">Tahun</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border border-pink-300 rounded-md p-2"
                >
                  {tahunList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* TABEL */}
          <div className="overflow-x-auto bg-white p-4 rounded-md shadow-md">
            {presensiFiltered.length === 0 ? (
              <div className="text-center py-8 text-pink-600">
                Tidak ada data presensi.
              </div>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md text-sm">
                <thead className="bg-purple-200 text-purple-800">
                  <tr className="text-center">
                    <th>No</th>
                    <th>Nama</th>
                    <th>RFID</th> {/* BARU */}
                    <th>Level</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Alasan Ijin</th>
                    <th>Masuk</th>
                    <th>Pulang</th>
                  </tr>
                </thead>

                <tbody>
                  {presensiFiltered.map((p, idx) => {
                    const status = p.status || "-";
                    const alasan = p.alasanIjin || "-";

                    // 🔥 Ambil RFID dari master data berdasarkan nama
                    const findRFID = kesiswaan.find((k) => k.Nama === p.nama);
                    const rfid = findRFID ? findRFID.RFID : "-";

                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="bg-pink-100 hover:bg-pink-200"
                      >
                        <td className="border text-center">{idx + 1}</td>
                        <td className="border px-4 py-2">{p.nama}</td>
                        <td className="border text-center">{rfid}</td> {/* BARU */}
                        <td className="border text-center">{p.level}</td>
                        <td className="border text-center">
                          {formatTanggalIndo(p.date)}
                        </td>

                        <td className="border text-center font-bold">
                          {status}
                        </td>

                        <td className="border text-center">{alasan}</td>
                        <td className="border text-center">{p.jamMasuk || "—"}</td>
                        <td className="border text-center">{p.jamPulang || "—"}</td>
                      </motion.tr>
                    );
                  })}
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
