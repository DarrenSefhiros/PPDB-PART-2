import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidnav from "./sidnav";

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
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalHarga = data.reduce((acc, item) => acc + Number(item.Harga), 0);

  return (
    <div className="flex">
      <Sidnav />
      <div className="ml-60 min-h-screen bg-pink-50 flex flex-col items-center p-4 w-full">
        <div className="p-8 w-full max-w-3xl">
          <div className="flex justify-between mb-6 gap-4">
            <div className="bg-white shadow-md rounded-md p-6 flex-1 text-center">
              <h3 className="text-lg font-semibold text-pink-700 mb-2">
                Total Dashboard
              </h3>
              <p className="text-2xl font-bold text-pink-600">{data.length} orang</p>
            </div>
            <div className="bg-white shadow-md rounded-md p-6 flex-1 text-center">
              <h3 className="text-lg font-semibold text-pink-700 mb-2">
                Nominal Masuk
              </h3>
              <p className="text-2xl font-bold text-pink-600">
                Rp {totalHarga.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-pink-200 rounded-md overflow-hidden">
              <thead className="bg-purple-200 text-purple-800">
                <tr>
                  <th className="px-2 py-2 text-right w-12">No</th>
                  <th className="px-4 py-2 text-center">Nama</th>
                  <th className="px-4 py-2 text-center">Jenis</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center w-13">Harga</th>
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
                    <tr
                      key={item.id}
                      className="bg-pink-100 hover:bg-pink-200 transition"
                    >
                      <td className="border border-pink-200 px-2 py-2 text-right w-12">
                        {index + 1}
                      </td>
                      <td className="border border-pink-200 px-4 py-2">{item.Nama}</td>
                      <td className="border border-pink-200 px-4 py-2">{item.Jenis}</td>
                      <td className="border border-pink-200 px-4 py-2 text-center">
                        {item.Status && item.Status.toLowerCase() === "sudah lunas"
                          ? "Sudah Lunas"
                          : "Belum Lunas"}
                      </td>
                      <td className="border border-pink-200 px-4 py-2 text-right">
                        Rp {Number(item.Harga).toLocaleString("id-ID")}
                      </td>
                    </tr>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
