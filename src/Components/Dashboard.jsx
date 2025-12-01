import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./Sidnav";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaChalkboardTeacher,
  FaUserTie,
} from "react-icons/fa";
import { PiStudent } from "react-icons/pi";

function Card({ title, value, icon, color }) {
  return (
    <div
      className={`shadow-md rounded-md p-6 text-center hover:scale-[1.03] transition flex flex-col items-center justify-center gap-2 ${color}`}
    >
      <div>{icon}</div>
      <h3 className="text-lg font-semibold text-white drop-shadow-md">
        {title}
      </h3>
      <p className="text-2xl font-bold text-white drop-shadow-md">{value}</p>
    </div>
  );
}

function Dashboard() {
  const [tagihanData, setTagihanData] = useState([]);
  const [kesiswaanData, setKesiswaanData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTagihan = await axios.get("http://localhost:5000/login");
        const resKesiswaan = await axios.get("http://localhost:5000/Kesiswaan");
        setTagihanData(resTagihan.data.reverse());
        setKesiswaanData(resKesiswaan.data.reverse());
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const totalSiswa = kesiswaanData.filter((i) => i.Kategori === "Siswa").length;
  const totalGuru = kesiswaanData.filter((i) => i.Kategori === "Guru").length;
  const totalKaryawan = kesiswaanData.filter((i) => i.Kategori === "Karyawan").length;

  const totalTagihan = tagihanData.reduce(
    (acc, item) => acc + Number(String(item.Tagihan).replace(/\./g, "") || 0),
    0
  );
  const totalSudahLunas = tagihanData.filter((i) => i.Status === "Sudah Lunas").length;
  const totalBelumLunas = tagihanData.filter((i) => i.Status !== "Sudah Lunas").length;

  return (
    <div className="flex">
      <Sidnav />
      <div className="ml-60 min-h-screen bg-pink-50 flex flex-col items-center p-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mb-6"
        >
          <h1 className="text-3xl font-bold text-pink-700">Dashboard</h1>
        </motion.div>

        {/* === CARD DATA === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6 w-full max-w-6xl"
        >
          <Card title="Total Siswa" value={totalSiswa} icon={<PiStudent />} color="bg-pink-500" />
          <Card title="Total Guru" value={totalGuru} icon={<FaChalkboardTeacher />} color="bg-pink-500" />
          <Card title="Total Karyawan" value={totalKaryawan} icon={<FaUserTie />} color="bg-pink-500" />
          <Card title="Total Tagihan" value={`Rp ${totalTagihan.toLocaleString("id-ID")}`} icon={<FaMoneyBillWave />} color="bg-pink-500" />
          <Card title="Total Lunas" value={totalSudahLunas} icon={<FaCheckCircle />} color="bg-pink-500" />
          <Card title="Total Belum Lunas" value={totalBelumLunas} icon={<FaTimesCircle />} color="bg-pink-500" />
        </motion.div>

        {/* === TABEL TAGIHAN === */}
        <div className="w-full max-w-6xl bg-white shadow-md rounded-md p-5 mb-8">
          <h2 className="text-xl font-bold text-pink-700 mb-3">Data Tagihan</h2>
          {loading ? (
            <div className="text-center py-4 text-pink-600">Memuat data...</div>
          ) : tagihanData.length === 0 ? (
            <div className="text-center py-4 text-pink-600">Belum ada data</div>
          ) : (
            <table className="min-w-full border border-pink-200 rounded-md overflow-hidden text-sm">
              <thead className="bg-purple-200 text-purple-800">
                <tr className="text-center">
                  <th className="px-3 py-2 w-10 font-bold">No</th>
                  <th className="px-4 py-2 w-40 text-left font-bold">Nama</th>
                  <th className="px-4 py-2 w-52 font-bold">Email</th>
                  <th className="px-4 py-2 w-36 font-bold">Jenis</th>
                  <th className="px-4 py-2 w-32 font-bold">Tagihan</th>
                  <th className="px-4 py-2 w-36 font-bold">Tanggal</th>
                  <th className="px-4 py-2 w-32 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {tagihanData.map((item, index) => (
                  <tr key={item.id} className="bg-pink-100 hover:bg-pink-200 transition">
                    <td className="border border-pink-200 px-2 py-2 text-center">{index + 1}</td>
                    <td className="border border-pink-200 px-4 py-2">{item.Nama}</td>
                    <td className="border border-pink-200 px-4 py-2">{item.Email}</td>
                    <td className="border border-pink-200 px-4 py-2">{item.Jenis}</td>
                    <td className="border border-pink-200 px-4 py-2 text-right">
                      Rp {Number(String(item.Tagihan).replace(/\./g, "") || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="border border-pink-200 px-4 py-2 text-center">{formatDate(item.Tanggal)}</td>
                    <td
                      className={`border border-pink-200 px-4 py-2 text-center font-semibold ${
                        item.Status === "Sudah Lunas" ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {item.Status || "Belum Lunas"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>


        {["Guru", "Siswa", "Karyawan"].map((kategori) => (
          <div key={kategori} className="w-full max-w-6xl bg-white shadow-md rounded-md p-5 mb-6">
            <h2 className="text-xl font-bold text-pink-700 mb-3">Data {kategori}</h2>

            <table className="min-w-full border border-pink-200 rounded-md overflow-hidden text-sm">
              <thead className="bg-purple-200 text-purple-800">
                <tr>
                  <th className="px-2 py-2 w-12 font-bold">No</th>
                  <th className="px-4 py-2 text-center font-bold">Nama</th>
                  <th className="px-4 py-2 text-center font-bold">Email</th>
                  <th className="px-4 py-2 text-center font-bold">Jabatan/Kelas</th>
                  <th className="px-4 py-2 text-left font-bold">Kategori</th>
                </tr>
              </thead>

              <tbody>
                {kesiswaanData.filter((i) => i.Kategori === kategori).length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-4 text-pink-600 font-medium"
                    >
                      Belum ada data
                    </td>
                  </tr>
                ) : (
                  kesiswaanData
                    .filter((i) => i.Kategori === kategori)
                    .map((i, idx) => (
                      <tr key={i.id} className="bg-pink-100 hover:bg-pink-200 transition">
                        <td className="border border-pink-200 px-2 py-2 text-center">{idx + 1}</td>
                        <td className="border border-pink-200 px-4 py-2 text-center">{i.Nama}</td>
                        <td className="border border-pink-200 px-4 py-2 text-center">{i.Email}</td>
                        <td className="border border-pink-200 px-4 py-2 text-center">{i.Jabatan}</td>
                        <td className="border border-pink-200 px-4 py-2 text-left">{i.Kategori}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
