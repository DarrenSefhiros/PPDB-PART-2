import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "../Components/Sidnav";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function Presensi() {
  const [kesiswaan, setKesiswaan] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [presensiList, setPresensiList] = useState(() => {
    const saved = localStorage.getItem("presensiList");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedNamaId, setSelectedNamaId] = useState("");

  // Waktu WIB
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

  // Fetch data master
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:5000/Kesiswaan");

        const cleaned = (res.data || [])
          .filter(Boolean)
          .filter((d) => d.Nama && d.Nama.trim() !== "");

        setKesiswaan(cleaned);

        const uniqueKategori = [
          ...new Set(cleaned.map((d) => d.Kategori).filter(Boolean)),
        ];
        setKategoriList(uniqueKategori);
      } catch (err) {
        Swal.fire("Error", "Gagal memuat master data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Simpan ke localStorage
  useEffect(() => {
    localStorage.setItem("presensiList", JSON.stringify(presensiList));
  }, [presensiList]);

  // Dropdown NAMA (KOSONG jika level = all)
  const namaOptions =
    selectedLevel === "all"
      ? [] // <<< FIX: KOSONGKAN
      : kesiswaan.filter((k) => k.Kategori === selectedLevel);

  // Merge update aman
  const updateSafe = async (id, dataUpdate) => {
    const old = await axios.get(`http://localhost:5000/Kesiswaan/${id}`);
    const merged = { ...old.data, ...dataUpdate };
    await axios.put(`http://localhost:5000/Kesiswaan/${id}`, merged);
  };

  // Simpan presensi
  const handleSimpanPresensi = async () => {
    if (!selectedNamaId)
      return Swal.fire("Nama belum dipilih", "Pilih dahulu", "warning");

    const target = kesiswaan.find(
      (k) => String(k.id) === String(selectedNamaId)
    );

    if (!target)
      return Swal.fire("Error", "Data tidak ditemukan", "error");

    const { date } = nowWIB();

    const newPresensi = {
      id: `${selectedNamaId}-${date}-${Date.now()}`,
      kesiswaanId: selectedNamaId,
      nama: target.Nama,
      level: target.Kategori,
      jamMasuk: null,
      jamPulang: null,
      date,
    };

    try {
      await updateSafe(selectedNamaId, {
        lastPresensi: { date, jamMasuk: null, jamPulang: null },
      });

      setPresensiList((p) => [newPresensi, ...p]);
      setSelectedNamaId("");

      Swal.fire("Berhasil", "Presensi dibuat", "success");
    } catch {
      Swal.fire("Error", "Gagal menyimpan presensi", "error");
    }
  };

  // Jam Masuk
  const handleKlikMasuk = async (entryId) => {
    const entry = presensiList.find((p) => p.id === entryId);
    if (!entry || entry.jamMasuk) return;

    const { time } = nowWIB();

    try {
      await updateSafe(entry.kesiswaanId, {
        lastPresensi: {
          date: entry.date,
          jamMasuk: time,
          jamPulang: entry.jamPulang,
        },
      });

      setPresensiList((prev) =>
        prev.map((p) => (p.id === entryId ? { ...p, jamMasuk: time } : p))
      );

      Swal.fire("Berhasil", "Jam Masuk dicatat!", "success");
    } catch {
      Swal.fire("Error", "Gagal update jam masuk", "error");
    }
  };

  // Jam Pulang
  const handleKlikPulang = async (entryId) => {
    const entry = presensiList.find((p) => p.id === entryId);
    if (!entry || entry.jamPulang) return;

    const { time } = nowWIB();

    try {
      await updateSafe(entry.kesiswaanId, {
        lastPresensi: {
          date: entry.date,
          jamMasuk: entry.jamMasuk,
          jamPulang: time,
        },
      });

      setPresensiList((prev) =>
        prev.map((p) => (p.id === entryId ? { ...p, jamPulang: time } : p))
      );

      Swal.fire("Berhasil", "Jam Pulang dicatat!", "success");
    } catch {
      Swal.fire("Error", "Gagal update jam pulang", "error");
    }
  };

  // Hapus presensi
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

    try {
      await updateSafe(entry.kesiswaanId, { lastPresensi: null });
    } catch {}

    setPresensiList((prev) => prev.filter((p) => p.id !== entryId));

    Swal.fire("Berhasil", "Entry presensi dihapus", "success");
  };

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
            Presensi Harian
          </h2>

          {/* FORM */}
          <div className="bg-white p-5 rounded-md shadow-md mb-6 flex flex-wrap items-end gap-4">

            {/* Level */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-pink-700">
                Pilih Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setSelectedNamaId("");
                }}
                className="border border-pink-300 rounded-md p-2 w-56"
              >
                <option value="all">— Semua Level —</option>
                {kategoriList.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            {/* Nama */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-pink-700">
                Pilih Nama
              </label>
              <select
                value={selectedNamaId}
                onChange={(e) => setSelectedNamaId(e.target.value)}
                disabled={selectedLevel === "all"} // <<< FIX
                className="border border-pink-300 rounded-md p-2 w-72
                  disabled:bg-gray-200 disabled:text-gray-500"
              >
                <option value="">
                  {selectedLevel === "all"
                    ? "Pilih level dulu"
                    : "— Pilih Nama —"}
                </option>

                {namaOptions.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.Nama}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimpanPresensi}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Simpan Presensi
            </button>

            <div className="ml-auto text-pink-700 font-semibold">
              Total Entry: {presensiList.length}
            </div>
          </div>

          {/* TABEL */}
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
                    <th>Jam Masuk</th>
                    <th>Jam Pulang</th>
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
                      <td className="border text-center">
                        {p.jamMasuk || "—"}
                      </td>
                      <td className="border text-center">
                        {p.jamPulang || "—"}
                      </td>

                      <td className="border text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleKlikMasuk(p.id)}
                            disabled={!!p.jamMasuk}
                            className={`py-1 px-3 rounded font-bold ${
                              p.jamMasuk
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            Masuk
                          </button>

                          <button
                            onClick={() => handleKlikPulang(p.id)}
                            disabled={!!p.jamPulang}
                            className={`py-1 px-3 rounded font-bold ${
                              p.jamPulang
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-amber-500 text-white hover:bg-amber-600"
                            }`}
                          >
                            Pulang
                          </button>

                          <button
                            onClick={() => handleHapus(p.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                          >
                            🗑
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

export default Presensi;
