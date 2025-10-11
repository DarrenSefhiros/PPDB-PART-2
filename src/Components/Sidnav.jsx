import React from 'react';

const Sidnav = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-60 bg-pink-700 text-white shadow-lg p-4 text-center">
      <h2 className="text-3xl font-bold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li><a href="/Dashboard" className="hover:text-pink-300">Dashboard</a></li>
        <li><a href="/Tagihan" className="hover:text-pink-300">Tagihan</a></li>
        <li><a href="/JenisTagihan" className="hover:text-pink-300">Jenis Tagihan</a></li>
      </ul>
    </div>
  );
};

export default Sidnav;
