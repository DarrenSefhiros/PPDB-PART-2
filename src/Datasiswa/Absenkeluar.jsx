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

  // ===============================
  // WAKTU WIB
  // ===============================
  const nowWIB = () => {
    const d = new Date();
    return {
      time: d.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Jakarta",
        hour12: false,
      }),
      date: d.toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta",
      }),
    };
  };

  useEffect(() => {
    setTimeout(() => rfidRef.current?.focus(), 300);
  }, []);

  // ===============================
  // AUTO FETCH USER RFID
  // ===============================
  const fetchUserByRFID = async (rfid) => {
    if (!rfid) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/Kesiswaan");
      const user = res.data.find(
        (u) => String(u.RFID) === String(rfid)
      );

      if (!user) {
        Swal.fire("RFID tidak ditemukan", "Kode RFID tidak terdaftar!", "error");
        setUserData(null);
        return;
      }

      setUserData(user);
    } catch {
      Swal.fire("Error", "Gagal mengakses database!", "error");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // TRIGGER SAAT ENTER (RFID READER)
  // ===============================
  const handleRFIDKey = (e) => {
    if (e.key === "Enter") {
      fetchUserByRFID(rfidInput);
    }
  };

  // ===============================
  // ABSEN PULANG
  // ===============================
  const handleAbsenPulang = async () => {
    if (!userData) return;

    const { time, date } = nowWIB();
    const hour = parseInt(time.split(":")[0]);
    const last = userData.lastPresensi;

    // BELUM JAM 15
    if (hour < 15) {
      return Swal.fire(
        "Belum waktunya pulang",
        "Presensi pulang dibuka jam 15:00",
        "warning"
      );
    }

    // BELUM MASUK
    if (!last || last.date !== date || !last.jamMasuk) {
      return Swal.fire(
        "Ditolak",
        "Anda belum presensi masuk hari ini",
        "error"
      );
    }

    // SUDAH PULANG
    if (last.jamPulang) {
      return Swal.fire(
        "Sudah presensi pulang",
        "Anda sudah melakukan presensi pulang",
        "warning"
      );
    }

    // UPDATE DB
    await axios.put(`http://localhost:5000/Kesiswaan/${userData.id}`, {
      ...userData,
      lastPresensi: {
        ...last,
        jamPulang: time,
      },
    });

    Swal.fire("Berhasil", "Presensi pulang berhasil", "success");

    // 🔄 RESET SIAP SCAN BERIKUTNYA
    setRfidInput("");
    setUserData(null);
    rfidRef.current?.focus();
  };

  return (
    <div className="flex">
      <div className="p-10 w-full min-h-screen flex items-center justify-center bg-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center"
        >
          {/* BACK */}
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
            placeholder="Scan / Masukkan RFID..."
            value={rfidInput}
            onChange={(e) => setRfidInput(e.target.value)}
            onKeyDown={handleRFIDKey}
            className="w-full px-4 py-3 rounded-md border border-gray-400 text-center text-lg"
          />

          {loading && (
            <p className="mt-3 text-blue-600 font-semibold">
              Mencari data...
            </p>
          )}

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

          {/* TOMBOL PULANG */}
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
