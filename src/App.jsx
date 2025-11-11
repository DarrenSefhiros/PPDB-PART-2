import { Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import './index.css'
import Dashboard from './Components/Dashboard'
import Register from './Components/Register'
import Tambahdata from './Components/Tambahdata'
import Tagihan from './Components/Tagihan'
import Jenistagihan from './Components/Jenistagihan'
import EditData from './Components/editdata'
import TambahJenisTagihan from './Components/Tambahjenistagihan'
import EditJenisTagihan from './Components/Editjenistagihan'
import Rekaptagihan from './Components/Rekaptagihan'
import Tabelsiswa from './Datasiswa/Tabelsiswa'
import TambahDataKategori from './Datasiswa/Tambahdatakategori'
import Editkategori from './Datasiswa/Editkategori'
import Masterdata from './Datasiswa/Masterdata'
import Kelas from './Datasiswa/kelas'
import TambahDataKelas from './Datasiswa/Tambahdatakelas'
import EditKelas from './Datasiswa/EditKelas'
import TambahData2 from './Datasiswa/TambahData2'
import EditMasterData from './Datasiswa/Editmasterdata'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Tambahdata" element={<Tambahdata />} />
      <Route path="/Tambahdata2" element={<TambahData2 />} />
      <Route path="/Tagihan" element={<Tagihan />} />
      <Route path="/Rekaptagihan" element={<Rekaptagihan />} />
      <Route path="/Jenistagihan" element={<Jenistagihan />} />
      <Route path="/KategoriData" element={<Tabelsiswa />} />
      <Route path="/MasterData" element={<Masterdata />} />
      <Route path="/Kelas" element={<Kelas />} />
      <Route path="/Tambahjenistagihan" element={<TambahJenisTagihan />} />
      <Route path="/TambahDataKategori" element={<TambahDataKategori />} />
      <Route path="/TambahDataKelas" element={<TambahDataKelas />} />
      <Route path="/EditJenisTagihan/:id" element={<EditJenisTagihan />} />
      <Route path="/EditMasterData/:id" element={<EditMasterData />} />
      <Route path="/EditKelas/:id" element={<EditKelas />} />
      <Route path="/EditKategori/:id" element={<Editkategori />} />
      <Route path="/Edit/:id" element={<EditData />} />
    </Routes>
  )
}

export default App
