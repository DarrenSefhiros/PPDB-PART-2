import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "../Components/Sidnav";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

function Presensi() {
  const [kesiswaan, setKesiswaan] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [presensiList, setPresensiList] = useState(() => {
    const saved = localStorage.getItem("presensiList");
    return saved ? JSON.parse(saved) : [];
  });

  const nowWIB = () => {
    const d = new Date();
    const time = d.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Jakarta",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const date = d.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
    return { time, date };
  };

  // Simpan otomatis ke localStorage
  useEffect(() => {
    localStorage.setItem("presensiList", JSON.stringify(presensiList));
  }, [presensiList]);

  // Ambil data Kesiswaan
  const loadKesiswaan = async () => {
    const res = await api.get("/masterdata");

    const cleaned = (res.data || [])
      .filter(Boolean)
      .filter((d) => d.Nama && d.Nama.trim() !== "");

    setKesiswaan(cleaned);
  };

  useEffect(() => {
    loadKesiswaan();
    setLoading(false);
  }, []);

  // ===============================
  // SYNC otomatis dari lastPresensi
  // ===============================
  useEffect(() => {
    if (!kesiswaan.length) return;

    const newEntries = [];

    kesiswaan.forEach((s) => {
      if (!s.lastPresensi) return;

      const tanggalLengkap = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const uniqueId = `${s.id}-${s.lastPresensi.date}`;

      const sudahAda = presensiList.some((p) => p.id.startsWith(uniqueId));
      if (sudahAda) return;

      // TENTUKAN STATUS
      let status = "—";
if (s.status === "ijin") status = "ijin";
else if (s.lastPresensi?.jamPulang) status = "pulang";
else if (s.lastPresensi?.jamMasuk) status = "masuk";


      newEntries.push({
        id: `${uniqueId}-${Date.now()}`,
        kesiswaanId: s.id,
        nama: s.Nama,
        level: s.Kategori,
        jamMasuk: s.lastPresensi.jamMasuk || null,
        jamPulang: s.lastPresensi.jamPulang || null,
        alasanIjin: s.lastPresensi.ijin?.alasan || "",
        date: s.lastPresensi.date,
        tanggalLengkap,
        status,
      });
    });

    if (newEntries.length > 0) {
      setPresensiList((prev) => [...newEntries, ...prev]);
    }
  }, [kesiswaan]);

  // Hapus row presensi
  const handleHapus = async (entryId) => {
    const entry = presensiList.find((p) => p.id === entryId);
    if (!entry) return;

    const confirm = await Swal.fire({
      title: "Hapus?",
      text: `Hapus presensi ${entry.nama}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (!confirm.isConfirmed) return;

    await api.put(`/masterdata/${entry.kesiswaanId}`, {
      ...kesiswaan.find((k) => k.id === entry.kesiswaanId),
      lastPresensi: null,
    });

    setPresensiList((prev) => prev.filter((p) => p.id !== entryId));
    Swal.fire("Berhasil", "Entry dihapus", "success");

    loadKesiswaan();
  };

  return (
    <div className="flex">
      <div className="ml- min-h-screen bg-pink-50 p-5 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 w-full max-w-6xl mx-auto"
        >
          <h2 className="text-5xl font-bold text-pink-700 mb-6 text-center">
            Presensi
          </h2>

          {/* 3 Tombol */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

            <div
              onClick={() => navigate("/Ijin")}
              className="cursor-pointer bg-pink-300 hover:bg-pink-400 text-pink-900 font-semibold py-4 rounded-xl text-center shadow-md transition"
            >
              Presensi Ijin
            </div>

            <div
              onClick={() => navigate("/Absensi")}
              className="cursor-pointer bg-pink-300 hover:bg-pink-400 text-pink-900 font-semibold py-4 rounded-xl text-center shadow-md transition"
            >
              Presensi Masuk
            </div>

            <div
              onClick={() => navigate("/AbsensiKeluar")}
              className="cursor-pointer bg-pink-300 hover:bg-pink-400 text-pink-900 font-semibold py-4 rounded-xl text-center shadow-md transition"
            >
              Presensi Keluar
            </div>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white p-4 rounded-md shadow-md">
            {presensiList.length === 0 ? (
              <div className="text-center py-8 text-pink-600">
                Belum ada presensi tersimpan.
              </div>
            ) : (
              <table className="min-w-full border border-pink-200 rounded-md text-sm">
                <thead className="bg-purple-200 text-purple-800">
                  <tr className="text-center">
                    <th>No</th>
                    <th className="text-left">Nama</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Jam Masuk</th>
                    <th>Jam Pulang</th>
                    <th>Waktu</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {presensiList.map((p, idx) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-pink-100 hover:bg-pink-200"
                    >
                      <td className="border text-center">{idx + 1}</td>
                      <td className="border px-4 py-2">{p.nama}</td>
                      <td className="border text-center">{p.level}</td>

                      <td className="border text-center font-semibold">
                        {p.status === "ijin"
                          ? `Ijin (${p.alasanIjin})`
                          : p.status === "masuk"
                          ? "Masuk"
                          : p.status === "keluar"
                          ? "Pulang"
                          : "—"}
                      </td>

                      <td className="border text-center">
                        {p.jamMasuk || "—"}
                      </td>

                      <td className="border text-center">
                        {p.jamPulang || "—"}
                      </td>

                      <td className="border text-center">
                        {p.tanggalLengkap}
                      </td>

                      <td className="border text-center">
                        <button
                          onClick={() => handleHapus(p.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                        >
                          🗑
                        </button>
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

export default Presensi;
