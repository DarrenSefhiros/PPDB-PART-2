import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

function EditKategoriIjin() {
  const [kategori, setKategori] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadKategori = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/KategoriIjin/${id}`);
        setKategori(res.data.KategoriIjin);
      } catch (err) {
        console.error("Gagal mengambil data kategori ijin:", err);
        Swal.fire("Error", "Gagal mengambil data!", "error");
        navigate("/KategoriIjin");
      }
    };
    loadKategori();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!kategori.trim()) {
      Swal.fire("Error", "Nama kategori ijin tidak boleh kosong!", "error");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/KategoriIjin/${id}`, {
        KategoriIjin: kategori.trim(),
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kategori ijin berhasil diupdate.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/KategoriIjin");
    } catch (error) {
      console.error("Error submit:", error);
      Swal.fire("Error", "Gagal mengupdate kategori ijin!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Kategori Ijin</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nama Kategori Ijin</label>
            <input
              type="text"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              placeholder="Masukkan nama kategori ijin"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-2 rounded-md font-bold"
            >
              {loading ? "Memproses..." : "Update"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/KategoriIjin")}
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

export default EditKategoriIjin;
