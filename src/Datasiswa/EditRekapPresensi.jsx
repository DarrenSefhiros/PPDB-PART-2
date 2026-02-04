import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/api";

function EditRekapPresensi() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    status: "",
    jamMasuk: "",
    jamPulang: "",
  });

  // ===============================
  // LOAD DATA PRESENSI
  // ===============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `/masterdata/${id}`
        );
        const user = res.data;

        if (!user || !user.lastPresensi) {
          Swal.fire("Error", "Data presensi tidak ditemukan", "error");
          navigate("/RekapPresensi");
          return;
        }

        setUserData(user);

        let status = "masuk";
        if (user.lastPresensi.ijinAlasan) status = "ijin";
        else if (user.lastPresensi.jamPulang) status = "keluar";

        setFormData({
          status,
          jamMasuk: user.lastPresensi.jamMasuk || "",
          jamPulang: user.lastPresensi.jamPulang || "",
        });
      } catch (err) {
        Swal.fire("Error", "Gagal memuat data presensi", "error");
        navigate("/RekapPresensi");
      }
    };

    fetchData();
  }, [id, navigate]);

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // UPDATE PRESENSI (AMAN)
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) return;

    if (formData.status === "ijin") {
      Swal.fire(
        "Tidak Diizinkan",
        "Presensi ijin tidak memiliki jam masuk & pulang",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      await api.put(`/masterdata/${id}`, {
        ...userData, // 🔥 PENTING
        lastPresensi: {
          ...userData.lastPresensi, // 🔥 MERGE DATA LAMA
          jamMasuk: formData.jamMasuk || null,
          jamPulang: formData.jamPulang || null,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Jam presensi berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/RekapPresensi");
    } catch (err) {
      Swal.fire("Error", "Gagal memperbarui jam presensi", "error");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Edit Jam Presensi
        </h2>

        <p className="text-center mb-6 font-semibold">
          Status Presensi :
          <span
            className={`ml-2 ${
              formData.status === "ijin"
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {formData.status}
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              Jam Masuk
            </label>
            <input
              type="time"
              name="jamMasuk"
              value={formData.jamMasuk}
              onChange={handleChange}
              disabled={formData.status === "ijin"}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">
              Jam Pulang
            </label>
            <input
              type="time"
              name="jamPulang"
              value={formData.jamPulang}
              onChange={handleChange}
              disabled={formData.status === "ijin"}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading || formData.status === "ijin"}
              className="bg-pink-600 text-white px-6 py-2 rounded-md font-bold disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Update"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/RekapPresensi")}
              className="bg-gray-500 text-white px-6 py-2 rounded-md font-bold"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRekapPresensi;
