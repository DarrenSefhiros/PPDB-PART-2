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


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Tambahdata" element={<Tambahdata />} />
      <Route path="/Tagihan" element={<Tagihan />} />
      <Route path="/Jenistagihan" element={<Jenistagihan />} />
      <Route path="/Tambahjenistagihan" element={<TambahJenisTagihan />} />
      <Route path="/EditJenisTagihan/:id" element={<EditJenisTagihan />} />
      <Route path="/Edit/:id" element={<EditData />} />
    </Routes>
  )
}

export default App
