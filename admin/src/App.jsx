import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Indexdm from "./page/Khoa/indexdm";
import Sizebar from "./components/Sidebar/sizebar";
import Footer from "./components/Footter/footer";
import Navbar from "./components/Navbar/navbar";
import LoginForm from "./page/Login/login";
import Thongke from "./page/ThongKe/thongke";
import Createdm from "./page/Khoa/createdm";
import Viewdm from "./page/Khoa/viewdm";
import Editdm from "./page/Khoa/editdm";
import Indexbenhnhan from "./page/BenhNhan/indexbenhnhan";
import CreateBenhNhan from "./page/BenhNhan/createbenhnhan";
import Editkh from "./page/BenhNhan/editbenhnhan";
import Viewkh from "./page/BenhNhan/viewbenhnhan";
import Editnv from "./page/BacSi/editbacsi";
import Viewnv from "./page/BacSi/viewbacsi";
import Indexnv from "./page/BacSi/indexbacsi";
import Createnv from "./page/BacSi/createbacsi";
import Indexlichkhambenh from "./page/LichKhamBenh/indexlichkhambenh";
import IndexHDN from "./page/HoaDonNhap/indexHDN";
import Indexkhohang from "./page/KhoHang/indexkhohang";
import Createkhohang from "./page/KhoHang/createkhohang";
import Editkhohang from "./page/KhoHang/editkhohang";
import Viewkhohang from "./page/KhoHang/viewkhohang";
import Viewlichkhambenh from "./page/LichKhamBenh/viewlichkhambenh";
import TaiKhoan from "./page/TaiKhoan/indextk";
import Createhdn from "./page/HoaDonNhap/createhoadon";
import Viewhoadonnhap from "./page/HoaDonNhap/viewhoadon";
import EditLichKhamBenh from "./page/LichKhamBenh/editlichkhambenh";
import Indexgdv from "./page/GoiKham/indexgdv";
import Creategdv from "./page/GoiKham/creategdv";
import Editgdv from "./page/GoiKham/editgdv";
import Viewgdv from "./page/GoiKham/viewgdv";
import IndexThuocVatTu from "./page/VatTuYTe/indexTVT";
import CreateThuoc from "./page/VatTuYTe/createTVT";
import EditThuocVatTu from "./page/VatTuYTe/editTVT";
import ViewThuocVatTu from "./page/VatTuYTe/viewTVT";
import IndexTrinhDo from "./page/TrinhDoBangCap/IndexTrinhDo";
import CreateTrinhDo from "./page/TrinhDoBangCap/CreateTrinhDo";
import EditTrinhDo from "./page/TrinhDoBangCap/UpdateTrinhDo";
import ViewTrinhDo from "./page/TrinhDoBangCap/ViewTrinhDo";
import EditHoSoBenhAn from "./page/HoSoKhamBenh/UpdateHSKB";
import CreateHoSoBenhAn from "./page/HoSoKhamBenh/CreateHSKB";
import IndexHoSoBenhAn from "./page/HoSoKhamBenh/IndexHSKB";
import ViewHoSoBenhAn from "./page/HoSoKhamBenh/ViewHSKB";
import Indexadddichvukham from "./page/LichKhamBenh/adddichvukham";
import Indexadddichvutheochuyenkhoa from "./page/LichKhamBenh/addtheochuyenkhoa";
import IndexPhongKham from "./page/Phongkham/indexphongkham";
import CreatePhongKham from "./page/Phongkham/createphongkham";
import EditPhongKham from "./page/Phongkham/editphongkham";
import ViewPhongKham from "./page/Phongkham/viewphongkham";
import CreateLichKham from "./page/LichKhamBenh/addlichkham";
import { UserProvider } from "./until/userContext";
import Updateprofile from "./page/BacSi/updateprofile";
import Viewprofile from "./page/BacSi/profile";
import UpdateProfile from "./page/TaiKhoan/taikhoanbacsi";
import NghiPhepBacSi from "./page/NghiPhep/nghiphep";
import IndexNghiPhep from "./page/NghiPhep/indexnghiphep";
import IndexNghiPhepBacSi from "./page/NghiPhep/indexnghiphepbacsi";
import UpdateNghiBacSi from "./page/NghiPhep/updatenghiphep";
import Indexaddthuoc from "./page/HoSoKhamBenh/addthuoc";
import IndexlichkhambenhBacSi from "./page/LichKhamBenh/indexlichkhambenhbacsi";
import IndexHoSoBenhAnBacSi from "./page/HoSoKhamBenh/IndexHSKBBacSi";
import EditLichKhamBenhBacSi from "./page/LichKhamBenh/editlichkhambenhbacsi";
import CreateTaiKhoanFull from "./page/TaiKhoan/createtk";
import ViewTaiKhoanByID from "./page/TaiKhoan/viewtk";
import Thongkebacsi from "./page/ThongKe/thongkebacsi";
import CreateChuyenTuyen from "./page/HoSoKhamBenh/CreateChuyenTuyen";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // nếu có token thì cho phép truy cập các route
  }, []);

  // Hàm xử lý đăng nhập
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <UserProvider>
    <BrowserRouter>
      
      <ToastContainer />

      {/* Kiểm tra nếu chưa đăng nhập thì chỉ hiển thị giao diện đăng nhập */}
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          {/* Chuyển hướng tất cả các route khác về login nếu chưa đăng nhập */}
          <Route path="*" element={<LoginForm onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <div className="app">
          <div id="wrapper">
            {/* Sidebar */}
            <Sizebar />

            <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <Navbar onLogout={handleLogout} />
                <div className="container-fluid">
                  <Routes>
                    <Route path="/" element={<Thongke />} />
                    <Route path="/Thongkebacsi" element={<Thongkebacsi />} />

                    <Route path="/Indexdm" element={<Indexdm />} />
                    <Route path="/Themdm" element={<Createdm />} />
                    <Route path="/Updatedm/:id_khoa" element={<Editdm />} />
                    <Route path="/Viewdm/:id_khoa" element={<Viewdm />} />

                    <Route path="/Indexgdv" element={<Indexgdv />} />
                    <Route path="/Creategdv" element={<Creategdv />} />
                    <Route path="/Updategdv/:id_dich_vu" element={<Editgdv />} />
                    <Route path="/Viewgdv/:id_dich_vu" element={<Viewgdv />} />
                    
                    <Route path="/Indexkhohang" element={<Indexkhohang />} />
                    <Route path="/Createkhohang" element={<Createkhohang />} />
                    <Route path="/Updatekhohang/:id_kho" element={<Editkhohang />} />
                    <Route path="/Viewkhohang/:id_kho" element={<Viewkhohang />} />

                    <Route path="/IndexTVT" element={<IndexThuocVatTu />} />
                    <Route path="/CreateTVT" element={<CreateThuoc />} />
                    <Route path="/UpdateTVT/:id_thuoc_vat_tu" element={<EditThuocVatTu />} />
                    <Route path="/ViewTVT/:id_thuoc_vat_tu" element={<ViewThuocVatTu />} />

                    <Route path="/Indexbenhnhan" element={<Indexbenhnhan />} />
                    <Route path="/Createbenhnhan" element={<CreateBenhNhan />} />
                    <Route path="/Updatebenhnhan/:id_benh_nhan" element={<Editkh />} />
                    <Route path="/Viewbenhnhan/:id_benh_nhan" element={<Viewkh />} />

                    <Route path="/Indextrinhdobs" element={<IndexTrinhDo />} />
                    <Route path="/Createtrinhdobs" element={<CreateTrinhDo />} />
                    <Route path="/Updatetrinhdobs/:id_bang_cap" element={<EditTrinhDo />} />
                    <Route path="/Viewtrinhdobs/:id_bang_cap" element={<ViewTrinhDo />} />

                    <Route path="/Indexhosobenhan" element={<IndexHoSoBenhAn />} />
                    <Route path="/IndexhosobenhanBacSi/:id_bac_si" element={<IndexHoSoBenhAnBacSi />} />
                    <Route path="/Createhosobenhan/:id_lich_kham" element={<CreateHoSoBenhAn />} />
                    <Route path="/CreateChuyenTuyen/:id_lich_kham" element={<CreateChuyenTuyen />} />
                    <Route path="/Updatehosobenhan/:id_ho_so" element={<EditHoSoBenhAn />} />
                    <Route path="/Viewhosobenhan/:id_ho_so" element={<ViewHoSoBenhAn />} />
                    <Route path="/Indexaddthuoc/:id_lich_kham" element={<Indexaddthuoc />} />

                    <Route path="/IndexBacSi" element={<Indexnv />} />
                    <Route path="/IndexNghiPhep" element={<IndexNghiPhep/>} />
                    <Route path="/IndexNghiPhepBacSi" element={<IndexNghiPhepBacSi/>} />
                    <Route path="/CreateBacSi" element={<Createnv />} />
                    <Route path="/UpdateBacSi/:id_bac_si" element={<Editnv />} />
                    <Route path="/UpdateNghiPhep/:id_nghi_phep" element={< UpdateNghiBacSi/>} />
                    <Route path="/ViewBacSi/:id_bac_si" element={<Viewnv />} />
                    <Route path="/Updateprofile/:id_bac_si" element={<Updateprofile />} />
                    <Route path="/ProfileBacSi/:id_bac_si" element={< Viewprofile />} />
                    <Route path="/XinNghiPhep" element={< NghiPhepBacSi />} />


                    <Route path="/Indexhoadonnhap" element={<IndexHDN />} />
                    <Route path="/Viewcthdn/:id_hoa_don" element={<Viewhoadonnhap />} />


                    <Route path="/Indexlichkham" element={<Indexlichkhambenh />} />
                    <Route path="/IndexlichkhamBacSi/:id_bac_si" element={<IndexlichkhambenhBacSi />} />
                    <Route path="/addlichkham" element={<CreateLichKham />} />
                    <Route path="/Indexhoadonnhap" element={<IndexHDN />} />
                    <Route path="/Viewctlk/:id_lich_kham" element={<Viewlichkhambenh />} />
                    <Route path="/Updatelk/:id_lich_kham" element={<EditLichKhamBenh />} />
                    <Route path="/UpdatelkBacSi/:id_lich_kham" element={<EditLichKhamBenhBacSi />} />
                    <Route path="/Indexadddichvukham/:id_lich_kham" element={<Indexadddichvukham />} />
                    <Route path="/Indexadddichvutheochuyenkhoa/:id_lich_kham" element={<Indexadddichvutheochuyenkhoa />} />

                    <Route path="/Indexphongkham" element={<IndexPhongKham />} />
                    <Route path="/Createphongkham" element={<CreatePhongKham />} />
                    <Route path="/Updatephongkham/:id_phong_kham" element={<EditPhongKham />} />
                    <Route path="/Viewphongkham/:id_phong_kham" element={<ViewPhongKham />} />

                    <Route path="/Indextaikhoan" element={<TaiKhoan />} />
                    <Route path="/Capnhattaikhoan" element={<UpdateProfile />} />
                     <Route path="/Createtaikhoanforuser" element={<CreateTaiKhoanFull />} />
                     <Route path="/Viewtaikhoanbyid/:id_tai_khoan" element={<ViewTaiKhoanByID />} />

                    {/* Thêm tất cả các Routes khác tại đây */}
                  </Routes>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      )}
    
    </BrowserRouter>

     </UserProvider>
  );
}
