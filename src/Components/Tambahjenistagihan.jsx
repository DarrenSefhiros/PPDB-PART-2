import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

function TambahJenisTagihan() {
  const [formData, setFormData] = useState({
    jenisTagihan: "",
    tagihan: "",
    jatuhTempo: "",
    keterangan: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tagihan" ? value.replace(/\./g, "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi simple
    if (
      !formData.jenisTagihan ||
      !formData.tagihan ||
      !formData.jatuhTempo ||
      !formData.keterangan.trim()
    ) {
      Swal.fire(
        "Error",
        "Jenis Tagihan, Tagihan, Jatuh Tempo, dan Keterangan wajib diisi!",
        "error"
      );
      return;
    }

    // Konversi tanggal ke format Indonesia (dd-MM-yyyy)
    const convertToIndonesianFormat = (date) => {
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    };

    const formattedJatuhTempo = convertToIndonesianFormat(formData.jatuhTempo);

    const payload = {
      jenisTagihan: formData.jenisTagihan,
      tagihan: parseInt(formData.tagihan.replace(/\./g, "")),
      keterangan: formData.keterangan.trim(),
      jatuhTempo: formattedJatuhTempo,
    };

    console.log(payload);

    try {
      await api.post("/jenistagihan", payload);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data jenis tagihan berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/JenisTagihan");
    } catch (error) {
      console.error("Gagal tambah data:", error);
      if (error.response && error.response.data) {
        Swal.fire(
          "Error",
          error.response.data.message || "Gagal menambahkan data!",
          "error"
        );
      } else {
        Swal.fire("Error", "Gagal menambahkan data!", "error");
      }
    }
  };

  return (
    <div className="flex">
      <div className="ml-30 p-6 w-full min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 my-14">
          <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">
            Tambah Jenis Tagihan
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Jenis Tagihan</label>
              <input
                type="text"
                name="jenisTagihan"
                value={formData.jenisTagihan}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-pink-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Tagihan</label>
              <input
                type="text"
                name="tagihan"
                value={formData.tagihan}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-pink-400 focus:outline-none"
              />
              {formData.tagihan && !isNaN(formData.tagihan) && (
                <p className="text-sm text-gray-600 mt-1">
                  Rp.{parseInt(formData.tagihan).toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Jatuh Tempo</label>
              <input
                type="date"
                name="jatuhTempo"
                value={formData.jatuhTempo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-pink-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Keterangan</label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                rows={3}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-pink-400 focus:outline-none"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-bold"
              >
                Tambah
              </button>
              <button
                type="button"
                onClick={() => navigate("/JenisTagihan")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TambahJenisTagihan;
