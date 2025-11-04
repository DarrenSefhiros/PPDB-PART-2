import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./Sidnav";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaWallet } from "react-icons/fa";

function Card({ title, value, icon }) {
  return (
    <div className="bg-white shadow-md rounded-md p-6 text-center hover:scale-[1.03] transition flex flex-col items-center justify-center gap-2">
      <div>{icon}</div>
      <h3 className="text-lg font-semibold text-pink-700">{title}</h3>
      <p className="text-2xl font-bold text-pink-600">{value}</p>
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    if (!loginData?.Email) return;

const fetchData = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/login?Email=${loginData.Email}`
    );

    // ✅ Biar data baru muncul paling atas
    const sortedData = [...res.data].reverse();
    setData(sortedData);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


    fetchData();
  }, []);

  const totalTagihan = data.reduce(
    (acc, item) => acc + Number(String(item.Tagihan).replace(/\./g, "") || 0),
    0
  );

  const totalBelumLunas = data
    .filter((item) => item.Status !== "Sudah Lunas")
    .reduce(
      (acc, item) => acc + Number(String(item.Tagihan).replace(/\./g, "") || 0),
      0
    );

  const totalSudahLunas = data
    .filter((item) => item.Status === "Sudah Lunas")
    .reduce(
      (acc, item) => acc + Number(String(item.Tagihan).replace(/\./g, "") || 0),
      0
    );

  const totalOrangBelumLunas = data.filter((item) => item.Status !== "Sudah Lunas").length;
  const totalOrangSudahLunas = data.filter((item) => item.Status === "Sudah Lunas").length;

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
          <h1 className="text-3xl font-bold text-pink-700 flex items-center gap-2">
            Dashboard Tagihan
          </h1>
        </motion.div>
        

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6 w-full max-w-6xl"
        >
          <Card
            title="Total Siswa"
            value={`${totalBelumLunas.toLocaleString("id-ID")}`}
            icon={<FaTimesCircle className="text-red-500 text-2xl" />}
          />
          <Card
            title="Nominal Sudah Lunas"
            value={`Rp ${totalSudahLunas.toLocaleString("id-ID")}`}
            icon={<FaCheckCircle className="text-green-500 text-2xl" />}
          />
          <Card
            title="Total Belum Lunas"
            value={`${totalOrangBelumLunas} orang`}
            icon={<FaTimesCircle className="text-red-500 text-2xl" />}
          />
            <Card
              title="Total Tagihan"
              value={`Rp ${totalTagihan.toLocaleString("id-ID")}`}
              icon={<FaMoneyBillWave className="text-pink-500 text-2xl" />}
            />
          <Card
            title="Orang Sudah Lunas"
            value={`${totalOrangSudahLunas} orang`}
            icon={<FaCheckCircle className="text-green-500 text-2xl" />}
          />
          <Card
            title="Total Keseluruhan Tagihan"
            value={`Rp ${totalTagihan.toLocaleString("id-ID")}`}
            icon={<FaWallet className="text-pink-500 text-2xl" />}
          />
        </motion.div>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="overflow-x-auto w-full max-w-6xl"
        >
          <table className="min-w-full border border-pink-200 rounded-md overflow-hidden">
            <thead className="bg-purple-200 text-purple-800">
              <tr>
                <th className="px-2 py-2 text-right w-12">No</th>
                <th className="px-4 py-2 text-center">Nama</th>
                <th className="px-4 py-2 text-center">Jenis</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center w-13">Tagihan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-pink-600">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-pink-100 hover:bg-pink-200 transition"
                  >
                    <td className="border border-pink-200 px-2 py-2 text-right w-12">
                      {index + 1}
                    </td>
                    <td className="border border-pink-200 px-4 py-2">{item.Nama}</td>
                    <td className="border border-pink-200 px-4 py-2">{item.Jenis}</td>
                    <td
                      className={`border border-pink-200 px-4 py-2 text-center font-semibold ${
                        item.Status === "Sudah Lunas" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.Status || "Belum Lunas"}
                    </td>
                    <td className="border border-pink-200 px-4 py-2 text-right">
                      Rp {Number(String(item.Tagihan).replace(/\./g, "") || 0).toLocaleString("id-ID")}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-pink-600">
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
