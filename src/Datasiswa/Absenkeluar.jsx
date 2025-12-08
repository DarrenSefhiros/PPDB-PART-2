import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function PresensiKeluar() {
  const [rfidInput, setRfidInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
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
        Swal.fire("RFID tidak ditemukan", "Kode RFID tidak terdaftar!", "error");
      } else {
        setUserData(user);
      }
    } catch (err) {
      Swal.fire("Error", "Gagal mengakses database!", "error");
    }
    setLoading(false);
  };

  // PROSES ABSEN PULANG
  const handleAbsenPulang = async () => {
    if (!userData) return;

    const { time, date } = nowWIB();
    const hour = parseInt(time.split(":")[0]);

    // BELUM JAM 3 → Tidak bisa
    if (hour < 15) {
      return Swal.fire(
        "Belum waktunya pulang",
        "Silahkan presensi pulang di jam 15:00 ke atas",
        "warning"
      );
    }

    const last = userData.lastPresensi;

    // BELUM PRESENSI MASUK → Tidak boleh
    if (!last || last.date !== date || !last.jamMasuk) {
      return Swal.fire(
        "Tidak bisa absen pulang",
        "Anda belum melakukan presensi masuk hari ini!",
        "error"
      );
    }

    // SUDAH ABSEN PULANG → Tidak boleh
    if (last.jamPulang) {
      return Swal.fire(
        "Sudah absen pulang",
        "Anda telah melakukan presensi pulang sebelumnya",
        "warning"
      );
    }

    // UPDATE DATABASE
    await axios.put(`http://localhost:5000/Kesiswaan/${userData.id}`, {
      ...userData,
      lastPresensi: {
        date,
        jamMasuk: last.jamMasuk,
        jamPulang: time,
      },
    });

    Swal.fire("Berhasil!", "Presensi pulang berhasil disimpan", "success");
  };

  return (
    <div className="flex">
      <div className="p-10 w-full min-h-screen flex items-center justify-center bg-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center"
        >
          {/* TOMBOL BACK */}
          <Link to="/presensi">
            <button className="mb-5 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg">
              ← Back
            </button>
          </Link>

          {/* FOTO USER */}
          <img
            src={
              userData?.foto ||
              "https://www.dpzone.in/wp-content/uploads/2/Guest-PFP-13.jpg"
            }
            alt="User"
            className="w-32 h-32 rounded-full mx-auto mb-5 border-4 shadow-md"
          />

          {/* INPUT RFID */}
          <input
            ref={rfidRef}
            type="text"
            placeholder="Scan atau masukkan RFID..."
            value={rfidInput}
            onChange={(e) => setRfidInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheckRFID()}
            className="w-full px-4 py-3 rounded-md border border-gray-400 text-center text-lg"
          />

          <button
            onClick={handleCheckRFID}
            disabled={loading}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            {loading ? "Mencari..." : "Cek RFID"}
          </button>

          {/* DATA USER */}
          {userData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-left bg-blue-100 p-4 rounded-lg"
            >
              <p><b>Nama:</b> {userData.Nama}</p>
              <p><b>Email:</b> {userData.Email}</p>
              <p><b>Kategori:</b> {userData.Kategori}</p>
              <p><b>Jabatan/Kelas:</b> {userData.Jabatan}</p>
            </motion.div>
          )}

          {/* TOMBOL ABSEN PULANG */}
          {userData && (
            <button
              onClick={handleAbsenPulang}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
            >
              PRESENSI PULANG
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default PresensiKeluar;
