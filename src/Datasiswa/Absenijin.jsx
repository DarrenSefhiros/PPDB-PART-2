import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function PresensiIjin() {
  const [rfidInput, setRfidInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [alasan, setAlasan] = useState("Sakit");
  const [keterangan, setKeterangan] = useState("");

  const rfidRef = useRef(null);

  const nowWIB = () => {
    const d = new Date();
    const time = d.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Jakarta",
      hour12: false,
    });
    const date = d.toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
    return { time, date };
  };

  useEffect(() => {
    setTimeout(() => rfidRef.current?.focus(), 300);
  }, []);

  // CEK RFID
  const handleCheckRFID = async () => {
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:5000/Kesiswaan");
      const user = res.data.find((u) => String(u.RFID) === String(rfidInput));

      if (!user) {
        setUserData(null);
        Swal.fire("Tidak ditemukan", "RFID tidak terdaftar!", "error");
      } else {
        setUserData(user);
      }
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data!", "error");
    }

    setLoading(false);
  };

  // SUBMIT IJIN
  const handleIjin = async () => {
    if (!userData) return;

    const { date } = nowWIB();
    const last = userData.lastPresensi;

    // CEGAH IJIN BERULANG DI HARI YANG SAMA
    if (last && last.date === date && last.ijin) {
      return Swal.fire(
        "Sudah Ijin",
        "Anda sudah melakukan presensi ijin hari ini!",
        "warning"
      );
    }

    const updateData = {
      ...userData,
      status: "ijin",
      alasanIjin: alasan,
      lastPresensi: {
        date,
        jamMasuk: null,
        jamPulang: null,
        ijin: {
          alasan,
          keterangan,
        },
      },
    };

    await axios.put(`http://localhost:5000/Kesiswaan/${userData.id}`, updateData);

    Swal.fire("Berhasil!", "Presensi ijin berhasil disimpan.", "success");

    setUserData(null);
    setRfidInput("");
    setKeterangan("");
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-pink-100">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border border-pink-300"
      >
        {/* BACK BUTTON */}
        <Link
          to="/Presensi"
          className="inline-block mb-5 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow"
        >
          ⬅ Kembali
        </Link>

        {/* JUDUL */}
        <h2 className="text-2xl font-bold text-pink-700 mb-6">
          Presensi Ijin
        </h2>

        {/* FOTO PROFIL */}
        <img
          src={
            userData?.foto ||
            "https://www.dpzone.in/wp-content/uploads/2/Guest-PFP-13.jpg"
          }
          alt="Guest"
          className="w-32 h-32 rounded-full mx-auto mb-5 border-4 border-pink-300 shadow-md"
        />

        {/* INPUT RFID */}
        <input
          ref={rfidRef}
          type="text"
          placeholder="Scan / Masukkan RFID..."
          value={rfidInput}
          onChange={(e) => setRfidInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheckRFID()}
          className="w-full px-4 py-3 rounded-md border border-pink-400 text-center text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <button
          onClick={handleCheckRFID}
          disabled={loading}
          className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md shadow"
        >
          {loading ? "Mencari..." : "Cek RFID"}
        </button>

        {/* DATA USER */}
        {userData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-left bg-pink-200 p-4 rounded-lg border border-pink-300"
          >
            <p><b>Nama:</b> {userData.Nama}</p>
            <p><b>Email:</b> {userData.Email}</p>
            <p><b>Kategori:</b> {userData.Kategori}</p>
            <p><b>Kelas/Jabatan:</b> {userData.Jabatan}</p>
          </motion.div>
        )}

        {/* FORM IJIN */}
        {userData && (
          <div className="mt-5 text-left">
            <label className="block font-semibold text-pink-700">
              Alasan Ijin
            </label>
            <select
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="w-full p-3 border border-pink-400 rounded-md mt-1"
            >
              <option>Sakit</option>
              <option>Izin Pribadi</option>
              <option>Kebutuhan Mendesak</option>
              <option>Lainnya</option>
            </select>

            <label className="block mt-3 font-semibold text-pink-700">
              Keterangan Tambahan
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full p-3 border border-pink-400 rounded-md mt-1"
              placeholder="Isi keterangan tambahan (optional)"
            ></textarea>
          </div>
        )}

        {/* SUBMIT IJIN */}
        {userData && (
          <button
            onClick={handleIjin}
            className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow"
          >
            SIMPAN IJIN
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default PresensiIjin;
