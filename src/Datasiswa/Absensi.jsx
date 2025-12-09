import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidnav from "../Components/Sidnav";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Absensi() {
  const [rfidInput, setRfidInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const rfidRef = useRef(null);
  const navigate = useNavigate();

  const nowWIB = () => {
    const d = new Date();
    const time = d.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Jakarta",
      hour12: false,
    });
    const date = d.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
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
      Swal.fire("Error", "Gagal membaca database!", "error");
    }
    setLoading(false);
  };

  // ABSENSI
  const handleAbsen = async () => {
    if (!userData) return;

    const { time, date } = nowWIB();
    const hour = parseInt(time.split(":")[0]);
    const last = userData.lastPresensi;

    // ❌ Belum jam 6 pagi → TIDAK BOLEH PRESENSI
    if (hour < 6) {
      return Swal.fire(
        "Belum waktunya",
        "Presensi dimulai jam 06:00",
        "warning"
      );
    }

    // ❌ Jika hari ini sudah IJIN → TIDAK BOLEH ABSEN MASUK (kecuali >= 15)
    if (userData.status === "ijin" && hour < 15) {
      return Swal.fire(
        "Tidak bisa Absen Masuk",
        "Anda hari ini sudah Ijin, hanya bisa absen pulang jam 15.00",
        "warning"
      );
    }

    // ❌ Cegah absen masuk ulang
    if (last && last.date === date && hour < 15) {
      return Swal.fire(
        "Tidak bisa absen",
        "Anda sudah absen hari ini, tunggu jam 15.00",
        "warning"
      );
    }

    // ===============================
    // ABSEN MASUK
    // ===============================
    if (hour < 15) {
      const status =
        hour < 7
          ? "Berhasil absen masuk (lebih awal)"
          : "Berhasil absen masuk (kesiangan)";

      await axios.put(`http://localhost:5000/Kesiswaan/${userData.id}`, {
        ...userData,
        status: "masuk",
        alasanIjin: "",
        lastPresensi: { date, jamMasuk: time, jamPulang: null },
      });

      Swal.fire("Berhasil", status, "success");
      return;
    }

    // ===============================
    // ABSEN PULANG
    // ===============================
    if (hour >= 15) {
      await axios.put(`http://localhost:5000/Kesiswaan/${userData.id}`, {
        ...userData,
        lastPresensi: {
          date,
          jamMasuk: userData.lastPresensi?.jamMasuk || null,
          jamPulang: time,
        },
      });

      Swal.fire("Berhasil", "Absen pulang berhasil!", "success");
      return;
    }
  };

  return (
    <div className="flex">

      <div className="ml-0 p-10 w-full min-h-screen flex items-center justify-center bg-pink-50">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center relative"
        >

          {/* 🔙 TOMBOL BACK */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-5 top-5 bg-pink-300 hover:bg-pink-400 text-white px-4 py-2 rounded-lg shadow-md"
          >
            ← Back
          </button>

          {/* FOTO PROFIL */}
          <img
            src={
              userData?.foto ||
              "https://www.dpzone.in/wp-content/uploads/2/Guest-PFP-13.jpg"
            }
            alt="Guest"
            className="w-32 h-32 rounded-full mx-auto mb-5 border-4 shadow-md"
          />

          {/* INPUT RFID */}
          <input
            ref={rfidRef}
            type="text"
            placeholder="Masukkan RFID..."
            value={rfidInput}
            onChange={(e) => setRfidInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheckRFID()}
            className="w-full px-4 py-3 rounded-md border border-gray-400 text-center text-lg"
          />

          <button
            onClick={handleCheckRFID}
            disabled={loading}
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
          >
            {loading ? "Mencari..." : "Cek RFID"}
          </button>

          {/* INFO USER */}
          {userData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-left bg-pink-100 p-4 rounded-lg"
            >
              <p><b>Nama:</b> {userData.Nama}</p>
              <p><b>Email:</b> {userData.Email}</p>
              <p><b>Kategori:</b> {userData.Kategori}</p>
              <p><b>Jabatan/kelas:</b> {userData.Jabatan}</p>
              <p><b>Status Hari Ini:</b> {userData.status || "Belum ada"}</p>
            </motion.div>
          )}

          {/* ⭐ PERINGATAN JAM PULANG */}
          {userData && (() => {
            const hour = parseInt(
              new Date().toLocaleTimeString("en-GB", {
                timeZone: "Asia/Jakarta",
                hour12: false,
              }).split(":")[0]
            );

            return (
              hour >= 15 && (
                <div className="mt-4 bg-yellow-200 text-yellow-800 p-3 rounded-md text-center font-semibold">
                  Silahkan presensi pulang di page <b>Presensi Keluar</b>
                </div>
              )
            );
          })()}

          {/* TOMBOL ABSEN */}
          {userData && (
            <button
              onClick={handleAbsen}
              className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg"
            >
              ABSEN
            </button>
          )}

        </motion.div>
      </div>

    </div>
  );
}

export default Absensi;
