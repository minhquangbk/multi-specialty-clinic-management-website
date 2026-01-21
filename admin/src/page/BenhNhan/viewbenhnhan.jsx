import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function ViewBenhNhan() {
  const [benhNhan, setData] = useState({});
  const { id_benh_nhan } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/getbenhnhan/${id_benh_nhan}`)
      .then((resp) => setData({ ...resp.data[0] }));
  }, [id_benh_nhan]);

  const date = new Date(benhNhan.ngay_sinh);

  const formattedDate = date.toLocaleDateString('en-GB');

  const handleDangKyKham = () => {
  // Lưu thông tin bệnh nhân vào localStorage
  localStorage.setItem('benhNhanDangKy', JSON.stringify(benhNhan));

  // Chuyển đến trang đặt lịch khám
  navigate('/addlichkham');
};

  const handleDangKyTaiKhoan = () => {

  localStorage.setItem('thongTinTaiKhoanTuBenhNhan', JSON.stringify({
      id_benh_nhan: benhNhan.id_benh_nhan,
      ten_nguoi_dung: benhNhan.ho_ten,
      sdt: benhNhan.so_dien_thoai,
      email: benhNhan.email,
      anh_nguoi_dung: benhNhan.hinh_anh_bn,
      type:2
    }));

  navigate('/Createtaikhoanforuser');
};



  return (
    <div>
      <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thông tin Bệnh Nhân</h3>
      </div>
      <hr />
      <div className="row">
      <img style={{ borderRadius: '10px', marginLeft: '10px' }} src={benhNhan.hinh_anh_bn} width='150' height='180' className="img img-responsive"  />
        <div className="col mb-3">
          <label className="form-label">Họ và Tên</label>
          <input type="text" name="ho_ten" className="form-control" placeholder="Họ và Tên" value={benhNhan.ho_ten || ''} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Ngày Sinh</label>
          <input type="text" name="ngay_sinh" className="form-control" placeholder="Ngày Sinh" value={formattedDate || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Giới Tính</label>
          <input type="text" name="gioi_tinh" className="form-control" placeholder="Giới Tính" value={benhNhan.gioi_tinh === 2 ? 'Nữ' : benhNhan.gioi_tinh === 1 ? 'Nam' : ''} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Số điện thoại</label>
          <input type="text" name="so_dien_thoai" className="form-control" placeholder="Số điện thoại" value={benhNhan.so_dien_thoai || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Email</label>
          <input type="text" name="email" className="form-control" placeholder="Email" value={benhNhan.email || ''} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Địa chỉ</label>
          <input type="text" name="dia_chi" className="form-control" placeholder="Địa chỉ" value={benhNhan.dia_chi || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">CMND</label>
          <input type="text" name="cmnd" className="form-control" placeholder="CMND" value={benhNhan.cmnd || ''} readOnly />
        </div>
      </div>
      <div className="d-grid">
        <button
          className="btn btn-warning"
          style={{ marginTop: '15px' }}
          onClick={handleDangKyKham}
        >
          Đăng ký lịch khám
        </button>
        <button
          className="btn btn-warning"
          style={{ marginTop: '15px', marginLeft:"10px" }}
          onClick={handleDangKyTaiKhoan}
        >
          Đăng ký tài khoản
        </button>
      </div>
    </div>
  );
}
