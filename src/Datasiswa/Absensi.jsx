import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Absensi() {
  const [rfidInput, setRfidInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kategoriIjinList, setKategoriIjinList] = useState([]);

  const rfidRef = useRef(null);
  const navigate = useNavigate();

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
  // LOAD KATEGORI IJIN
  // ===============================
  useEffect(() => {
    axios
      .get("http://localhost:5000/KategoriIjin")
      .then((res) => setKategoriIjinList(res.data || []))
      .catch(() => setKategoriIjinList([]));
  }, []);

  // ===============================
  // AUTO FETCH USER DARI RFID
  // ===============================
  const fetchUserByRFID = async (rfid) => {
    if (!rfid) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/Kesiswaan");
      let user = res.data.find(
        (u) => String(u.RFID) === String(rfid)
      );

      if (!user) {
        Swal.fire("Tidak ditemukan", "RFID tidak terdaftar!", "error");
        setUserData(null);
        return;
      }

      const today = nowWIB().date;

      // RESET JIKA GANTI HARI
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
  // AUTO TRIGGER SAAT RFID MASUK
  // ===============================
  useEffect(() => {
    if (rfidInput.length >= 9) {
      const timer = setTimeout(() => {
        fetchUserByRFID(rfidInput);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [rfidInput]);

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

    // ABSEN MASUK
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
    }

    // ABSEN PULANG
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

    resetForm();
  };

  // ===============================
  // IJIN (SWEETALERT)
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

    const { value: form } = await Swal.fire({
      title: "Ijin Karena Apa?",
      html: `
        <select id="alasan" class="swal2-input">
          ${kategoriIjinList
            .map(
              (i) =>
                `<option value="${i.KategoriIjin}">${i.KategoriIjin}</option>`
            )
            .join("")}
        </select>
        <textarea id="keterangan" class="swal2-textarea" placeholder="Keterangan tambahan (opsional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Simpan Ijin",
      preConfirm: () => ({
        alasan: document.getElementById("alasan").value,
        keterangan: document.getElementById("keterangan").value,
      }),
    });

    if (!form) return;

    await axios.put(`http://localhost:5000/Kesiswaan/${userData.id}`, {
      ...userData,
      status: "ijin",
      alasanIjin: form.alasan,
      lastPresensi: {
        date,
        jamMasuk: null,
        jamPulang: null,
        ijin: {
          alasan: form.alasan,
          keterangan: form.keterangan,
        },
      },
    });

    Swal.fire("Berhasil", "Presensi ijin disimpan", "success");
    resetForm();
  };

  const resetForm = () => {
    setRfidInput("");
    setUserData(null);
    rfidRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center relative"
      >
        <button
          onClick={() => navigate("/RekapPresensi")}
          className="absolute left-5 top-5 bg-pink-300 hover:bg-pink-400 text-white px-4 py-2 rounded-lg"
        >
          ← Back
        </button>

        <img
          src={
            userData?.foto ||
            "https://www.dpzone.in/wp-content/uploads/2/Guest-PFP-13.jpg"
          }
          alt="Profil"
          className="w-32 h-32 rounded-full mx-auto mb-5 border-4 border-gray-300 shadow-md"
        />

        <input
          ref={rfidRef}
          value={rfidInput}
          onChange={(e) => setRfidInput(e.target.value)}
          placeholder="Scan RFID..."
          className="w-full px-4 py-3 rounded-md border text-center text-lg"
        />

        {loading && (
          <p className="mt-3 text-purple-600 font-semibold">
            Mencari data...
          </p>
        )}

        {userData && (
          <>
            <div className="mt-6 text-left bg-pink-100 p-4 rounded-lg">
              <p><b>Nama:</b> {userData.Nama}</p>
              <p><b>Email:</b> {userData.Email}</p>
              <p><b>Kategori:</b> {userData.Kategori}</p>
              <p><b>Jabatan/Kelas:</b> {userData.Jabatan}</p>
              <p><b>Status Hari Ini:</b> {userData.status || "Belum presensi"}</p>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleAbsen}
                className="w-1/2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg"
              >
                ABSEN
              </button>

              <button
                onClick={handleIjin}
                className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg"
              >
                IJIN
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Absensi;
