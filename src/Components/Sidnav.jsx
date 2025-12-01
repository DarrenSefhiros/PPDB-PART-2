import React from "react";
import "remixicon/fonts/remixicon.css";
import Swal from "sweetalert2";

const Sidnav = () => {
  const handleLogout = () => {
    Swal.fire({
      title: "Yakin mau logout?",
      text: "Kamu akan keluar dari akun ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="fixed top-0 left-0 h-full w-60 bg-gradient-to-b from-pink-500 via-pink-600 to-pink-800 text-white shadow-2xl flex flex-col">
      {/* HEADER */}
      <div className="p-6 border-b border-pink-400">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wide text-white drop-shadow-md">
          Menu
        </h2>
        <ul className="space-y-5">
          <li>
            <a
              href="/Dashboard"
              className="flex items-center gap-3 text-lg hover:bg-pink-700 rounded-md py-2 px-3 transition-all duration-200"
            >
              <i className="ri-dashboard-line text-2xl text-pink-100"></i>
              <span className="font-medium">Dashboard</span>
            </a>
          </li>

          {/* DATABASE */}
          <li className="text-sm uppercase text-pink-200 font-bold tracking-wide mt-4">
            Database
          </li>
          <li>
            <a
              href="/KategoriData"
              className="flex items-center gap-3 text-lg hover:bg-pink-700 rounded-md px-3 transition-all duration-200"
            >
              <i className="ri-database-2-line text-2xl text-pink-100"></i>
              <span>Kategori Data</span>
            </a>
          </li>
          <li>
            <a
              href="/Kelas"
              className="flex items-center gap-3 text-lg hover:bg-pink-700 rounded-md px-3 transition-all duration-200"
            >
              <i className="ri-team-line text-2xl text-pink-100"></i>
              <span>Kelas</span>
            </a>
          </li>
          <li>
            <a
              href="/MasterData"
              className="flex items-center gap-3 text-lg hover:bg-pink-700 rounded-md px-3 transition-all duration-200"
            >
              <i className="ri-folder-user-line text-2xl text-pink-100"></i>
              <span>Master Data</span>
            </a>
          </li>

          {/* KEUANGAN */}
          <li className="text-sm uppercase text-pink-200 font-bold tracking-wide mt-4">
            Keuangan
          </li>
          <li>
            <a
              href="/Jenistagihan"
              className="flex items-center text-nowrap gap-3 text-lg hover:bg-pink-700 w-auto rounded-md  px-3 transition-all duration-200"
            >
              <i className="ri-file-list-2-line text-2xl text-pink-100"></i>
              <span>Kategori Tagihan</span>
            </a>
          </li>
          <li>
            <a
              href="/Tagihan"
              className="flex items-center gap-3 text-lg hover:bg-pink-800 rounded-md px-3 transition-all duration-200"
            >
              <i className="ri-bill-line text-2xl text-pink-100"></i>
              <span>Tagihan</span>
            </a>
          </li>
          <li>
            <a
              href="/Rekaptagihan"
              className="flex items-center gap-3 text-lg hover:bg-pink-800 rounded-md  px-3 transition-all duration-200"
            >
              <i className="ri-history-line text-2xl text-pink-100"></i>
              <span>Rekap Tagihan</span>
            </a>
          </li>
        </ul>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="p-6 border-t border-pink-400 bg-pink-700/40 backdrop-blur-md">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-lg w-full"
        >
          <i className="ri-logout-box-r-line text-2xl"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidnav;
