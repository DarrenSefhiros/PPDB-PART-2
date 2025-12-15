import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function PresensiIjin() {
  const [rfidInput, setRfidInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [kategoriIjinList, setKategoriIjinList] = useState([]);
  const [alasan, setAlasan] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const rfidRef = useRef(null);

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
  // LOAD KATEGORI IJIN
  // ===============================
  useEffect(() => {
    axios
      .get("http://localhost:5000/KategoriIjin")
      .then((res) => {
        setKategoriIjinList(res.data || []);
        setAlasan(res.data?.[0]?.KategoriIjin || "");
      })
      .catch(() => {
        setKategoriIjinList([]);
        setAlasan("");
      });
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
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // SIMPAN IJIN
  // ===============================
  const handleIjin = async () => {
    if (!userData) return;

    const { date, time } = nowWIB();
    const hour = parseInt(time.split(":")[0]);

    if (hour < 6) {
      return Swal.fire(
        "Belum waktunya",
        "Presensi ijin dimulai jam 06:00",
        "warning"
      );
    }

    // ❌ SUDAH IJIN HARI INI
    if (
      userData.status === "ijin" &&
      userData.lastPresensi?.date === date
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
      userData.lastPresensi?.date === date
    ) {
      return Swal.fire(
        "Ditolak",
        "Anda sudah absen masuk hari ini, tidak bisa ijin",
        "warning"
      );
    }

    await axios.put(`http://localhost:5000/Kesiswaan/${userData.id}`, {
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
    });

    Swal.fire("Berhasil", "Presensi ijin disimpan", "success");
    setUserData(null);
    setRfidInput("");
    setKeterangan("");
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-pink-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center"
      >
        <Link
          to="/Presensi"
          className="inline-block mb-5 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
        >
          ⬅ Kembali
        </Link>

        <h2 className="text-2xl font-bold text-pink-700 mb-6">
          Presensi Ijin
        </h2>

        {/* FOTO PROFIL */}
        <img
          src={
            userData?.foto ||
            "https://www.dpzone.in/wp-content/uploads/2/Guest-PFP-13.jpg"
          }
          alt="Profil"
          className="w-32 h-32 rounded-full mx-auto mb-5 border-4 border-gray-300 shadow-md"
        />

        {/* RFID */}
        <input
          ref={rfidRef}
          value={rfidInput}
          onChange={(e) => setRfidInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheckRFID()}
          placeholder="Scan / Masukkan RFID..."
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
          <div className="mt-6 text-left bg-pink-100 p-4 rounded-lg">
            <p><b>Nama:</b> {userData.Nama}</p>
            <p><b>Email:</b> {userData.Email}</p>
            <p><b>Kategori:</b> {userData.Kategori}</p>
            <p><b>Kelas/Jabatan:</b> {userData.Jabatan}</p>
            <p><b>Status Hari Ini:</b> {userData.status || "Belum presensi"}</p>
          </div>
        )}

        {/* FORM IJIN */}
        {userData && (
          <>
            <div className="mt-5 text-left">
              <label className="font-semibold">Alasan Ijin</label>
              <select
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                className="w-full p-3 border rounded-md mt-1"
              >
                {kategoriIjinList.map((i) => (
                  <option key={i.id} value={i.KategoriIjin}>
                    {i.KategoriIjin}
                  </option>
                ))}
              </select>

              <label className="block mt-3 font-semibold">
                Keterangan Tambahan
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full p-3 border rounded-md mt-1"
              />
            </div>

            <button
              onClick={handleIjin}
              className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg"
            >
              SIMPAN IJIN
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default PresensiIjin;
