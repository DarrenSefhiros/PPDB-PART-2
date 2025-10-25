import React from "react";
import "remixicon/fonts/remixicon.css";

const Sidnav = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-60 bg-gradient-to-b from-pink-700 to-pink-900 text-white shadow-2xl flex flex-col justify-between">
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wide">
          Menu
        </h2>
        <ul className="space-y-5">
          <li>
            <a
              href="/Dashboard"
              className="flex items-center gap-3 text-lg hover:bg-pink-600 rounded-md py-2 px-3 transition-all duration-200"
            >
              <i className="ri-dashboard-line text-2xl text-pink-200"></i>
              <span className="font-medium">Dashboard</span>
            </a>
          </li>

          <li>
            <a
              href="/Tagihan"
              className="flex items-center gap-3 text-lg hover:bg-pink-600 rounded-md py-2 px-3 transition-all duration-200"
            >
              <i className="ri-bill-line text-2xl text-pink-200"></i>
              <span className="font-medium">Tagihan</span>
            </a>
          </li>

          <li>
            <a
              href="/JenisTagihan"
              className="flex items-center gap-3 text-lg hover:bg-pink-600 rounded-md py-2 px-3 transition-all duration-200"
            >
              <i className="ri-list-settings-line text-2xl text-pink-200"></i>
              <span className="font-medium">Jenis Tagihan</span>
            </a>
          </li>
        </ul>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="p-6 border-t border-pink-600">
        <a
          href="/"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <i className="ri-logout-box-r-line text-2xl"></i>
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
};

export default Sidnav;
