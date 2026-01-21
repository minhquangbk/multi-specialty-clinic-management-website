import React from 'react'
import {BrowserRouter, Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar/navbar'
import Footer from './components/Footer/footer'
import Home from './pages/index/Home';
import Cartpage from './pages/cart/Cartpage';
import Details from './pages/services/DetailServices';
import Product from './pages/services/Services';
import Chonsize from './pages/tuvan/Chonsize';
import About from './pages/about/About';
import Buycoolmate from './components/Message/buycoolmate';
import ScrollToTop from './until/scroll';
import Odercart from './pages/cart/Odercart';
import Register from './pages/login/Register';
import Login from './pages/login/Login';
import { UserProvider } from './until/userContext';
import HospitalInterface from './pages/doctor/doctor';
import AppointmentForm from './pages/datlich/datlich';
import RegistrationForm from './pages/datlich/xacnhandl';
import MedicalChart from './pages/hosokhambenh/hosokhambenh';
import ChatApp from './components/Message/AIchat';
import { useLocation } from 'react-router-dom';
import { VisibilityProvider } from './until/visibleContext';
import ContactButtons from './components/Message/iconchat';
import Message from './components/Message/message';
import UpdateProfile from './pages/login/Doithongtin';
import VnpayReturn from './pages/cart/Vnpay';
import EditThongTin from './pages/login/Thongtincanhan';


export default function App() {
  const location = useLocation();
  return (
    
    <div className='app'>
      <VisibilityProvider>
        <UserProvider>
          
          <ScrollToTop/>
          <Navbar/>
            <Routes>

            <Route path='/' element={<Home/>}/>
            <Route path='/cart' element={<Cartpage/>}/>
            <Route path='/dichvu' element={<Product/>}/>
            <Route path='/detail' element={<Details/>}/>
            <Route path='/DangKy' element={<Register/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/DangNhap' element={<Login/>}/>
            <Route path='/chonsize' element={<Chonsize/>}/>
            <Route path='/detail/:id_dich_vu' element={<Details/>}/>
            <Route path='/donhang' element={<Odercart/>}/>
            <Route path='/bacsi' element={<HospitalInterface/>}/>
            <Route path='/datlich' element={<AppointmentForm/>}/>
            <Route path='/xndatlich' element={<RegistrationForm/>}/>
            <Route path='/hosokhambenh' element={<MedicalChart/>}/>
            <Route path='/chatwithAI' element={<ChatApp/>}/>
            <Route path='/doithongtin' element={<UpdateProfile/>}/>
            <Route path="/vnpay-return" element={<VnpayReturn />} />
            <Route path="/capnhatthongtincanhan" element={<EditThongTin />} />


            </Routes>
          <ContactButtons/>
          <Message/>
          <Buycoolmate/>
          {location.pathname !== '/chatwithAI' && <Footer />}  {/* Hide footer if on /chatwithAI */}
          
          </UserProvider>
      </VisibilityProvider>
    </div>
  )
}
