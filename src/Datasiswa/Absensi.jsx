import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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
  // CEK RFID + RESET HARIAN
  // ===============================
  const handleCheckRFID = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/Kesiswaan");
      let user = res.data.find(
        (u) => String(u.RFID) === String(rfidInput)
      );

      if (!user) {
        Swal.fire("Tidak ditemukan", "RFID tidak terdaftar!", "error");
        setUserData(null);
        return;
      }

      const today = nowWIB().date;

      // 🔄 RESET JIKA GANTI HARI
      if (user.lastPresensi && user.lastPresensi.date !== today) {
        user = {
          ...user,
          status: "",
          alasanIjin: "",
          lastPresensi: null,
        };

        await axios.put(
          `http://localhost:5000/Kesiswaan/${user.id}`,
          user
        );
      }

      setUserData(user);
    } catch {
      Swal.fire("Error", "Gagal mengambil data!", "error");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ABSEN MASUK / PULANG
  // ===============================
  const handleAbsen = async () => {
    if (!userData) return;

    const { time, date } = nowWIB();
    const hour = parseInt(time.split(":")[0]);

    if (hour < 6) {
      return Swal.fire(
        "Belum waktunya",
        "Presensi dimulai jam 06:00",
        "warning"
      );
    }

    // ❌ SUDAH IJIN HARI INI
    if (
      userData.status === "ijin" &&
      userData.lastPresensi?.date === date &&
      hour < 15
    ) {
      return Swal.fire(
        "Ditolak",
        "Anda sudah ijin hari ini",
        "warning"
      );
    }

    // ❌ SUDAH MASUK HARI INI
    if (
      userData.status === "masuk" &&
      userData.lastPresensi?.date === date &&
      hour < 15
    ) {
      return Swal.fire(
        "Ditolak",
        "Anda sudah absen masuk hari ini",
        "warning"
      );
    }

    // ===============================
    // ABSEN MASUK
    // ===============================
    if (hour < 15) {
      await axios.put(`http://localhost:5000/Kesiswaan/${userData.id}`, {
        ...userData,
        status: "masuk",
        alasanIjin: "",
        lastPresensi: {
          date,
          jamMasuk: time,
          jamPulang: null,
        },
      });

      Swal.fire("Berhasil", "Absen masuk berhasil", "success");
      return;
    }

    // ===============================
    // ABSEN PULANG
    // ===============================
    if (hour >= 15) {
      if (!userData.lastPresensi?.jamMasuk) {
        return Swal.fire(
          "Ditolak",
          "Anda belum absen masuk",
          "warning"
        );
      }

      await axios.put(`http://localhost:5000/Kesiswaan/${userData.id}`, {
        ...userData,
        lastPresensi: {
          ...userData.lastPresensi,
          jamPulang: time,
        },
      });

      Swal.fire("Berhasil", "Absen pulang berhasil", "success");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center relative"
      >
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 top-5 bg-pink-300 hover:bg-pink-400 text-white px-4 py-2 rounded-lg"
        >
          ← Back
        </button>

        {/* FOTO PROFIL */}
        <img
          src={
            userData?.foto ||
            "https://www.dpzone.in/wp-content/uploads/2/Guest-PFP-13.jpg"
          }
          alt="Foto Profil"
          className="w-32 h-32 rounded-full mx-auto mb-5 border-4 border-gray-300 shadow-md"
        />

        {/* INPUT RFID */}
        <input
          ref={rfidRef}
          value={rfidInput}
          onChange={(e) => setRfidInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheckRFID()}
          placeholder="Masukkan RFID..."
          className="w-full px-4 py-3 rounded-md border text-center text-lg"
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
            <p><b>Jabatan/Kelas:</b> {userData.Jabatan}</p>
            <p><b>Status Hari Ini:</b> {userData.status || "Belum presensi"}</p>
          </motion.div>
        )}

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
  );
}

export default Absensi;
