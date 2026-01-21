import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ViewBacSi() {
  const [bacsi, setData] = useState({});
  const [chuyenkhoa, setDatachuyenkhoa] = useState({});
  const [trinhdo, setDatatrinhdo] = useState({});
  const { id_bac_si } = useParams();

  useEffect(() => {
    // Lấy dữ liệu bác sĩ theo mã nhân viên
    axios.get(`http://localhost:5000/api/getbacsi/${id_bac_si}`)
      .then((resq) => {
        setData(resq.data[0]);
      });
  }, [id_bac_si]);
  
  useEffect(() => {
    // Chỉ gọi API nếu `id_khoa` đã được lấy từ dữ liệu của bác sĩ
    if (bacsi.id_khoa) {
      axios.get(`http://localhost:5000/api/getdmkhoa/${bacsi.id_khoa}`)
        .then((resp) => {
          setDatachuyenkhoa(resp.data[0]);
        });
    }
  }, [bacsi.id_khoa]);

  useEffect(() => {
    // Chỉ gọi API nếu `id_bang_cap` đã được lấy từ dữ liệu của bác sĩ
    if (bacsi.id_bang_cap) {
      axios.get(`http://localhost:5000/api/gettrinhdo/${bacsi.id_bang_cap}`)
        .then((resp) => {
          setDatatrinhdo(resp.data[0]);
        });
    }
  }, [bacsi.id_bang_cap]);


  
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng từ 0 đến 11
    const year = date.getFullYear();

    const monthNames = [
      "tháng 1", "tháng 2", "tháng 3", "tháng 4", 
      "tháng 5", "tháng 6", "tháng 7", "tháng 8", 
      "tháng 9", "tháng 10", "tháng 11", "tháng 12"
    ];

    return `${day} ${monthNames[month - 1]} năm ${year}`;
  };

  const handleDangKyTaiKhoan = () => {
    localStorage.setItem('thongTinTaiKhoanTuBacSi', JSON.stringify({
      id_bac_si: bacsi.id_bac_si,
      ten_nguoi_dung: bacsi.ho_ten,
      sdt: bacsi.so_dien_thoai,
      email: bacsi.email,
      anh_nguoi_dung: bacsi.hinh_anh_bs,
      type:1
    }));

    // Chuyển đến giao diện tạo tài khoản
    window.location.href = "/Createtaikhoanforuser";
  };

 const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };
  
  return (
    <div>
      <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thông tin bác sĩ</h3>
      </div>
      <hr />
      <div className="row">
        <img 
          style={{ borderRadius: '10px', marginLeft: '12px', marginBottom: '12px' }} 
          src={bacsi.hinh_anh_bs} 
          width='150' 
          height='180' 
          className="img img-responsive" 
          alt={bacsi.ten_dich_vu} 
        />
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Tên bác sĩ</label>
          <input type="text" name="ten_nhan_vien" className="form-control" placeholder="Họ tên bác sĩ" value={bacsi.ho_ten || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Chức danh</label>
          <input type="text" name="chuc_danh" className="form-control" placeholder="Chức danh" value={bacsi.chuc_danh || ''} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Ngày sinh</label>
          <input type="text" name="ngay_sinh" className="form-control" placeholder="Ngày sinh" value={formatDate(bacsi.ngay_sinh) || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Giới tính</label>
          <input type="text" name="gioi_tinh" className="form-control" placeholder="Giới tính" value={bacsi.gioi_tinh === 2 ? 'Nữ' : bacsi.gioi_tinh === 1 ? 'Nam' : ''}
 readOnly />
        </div>
      </div>
      
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Địa chỉ</label>
          <input type="text" name="dia_chi" className="form-control" placeholder="Địa chỉ" value={bacsi.dia_chi || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Số điện thoại</label>
          <input type="text" name="sdt" className="form-control" placeholder="Số điện thoại" value={bacsi.so_dien_thoai || ''} readOnly />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Ngày vào làm</label>
          <input type="text" name="dia_chi" className="form-control" placeholder="Ngày vào làm" value={formatDate(bacsi.ngay_vao_lam )|| ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Email</label>
          <input type="text" name="sdt" className="form-control" placeholder="Email" value={bacsi.email || ''} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Căn cước công dân</label>
          <input type="text" name="cmnd" className="form-control" placeholder="Căn cước công dân" value={bacsi.cmnd || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Trình độ</label>
          <input type="text" name="bang_cap" className="form-control" placeholder="Bằng cấp" value={trinhdo.ten_bang_cap || ''} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Chuyên khoa</label>
          <input type="text" name="chuyen_khoa" className="form-control" placeholder="Chuyên khoa" value={chuyenkhoa.ten_khoa || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Mô tả</label>
          <input type="text" name="mo_ta" className="form-control" placeholder="Mô tả" value={bacsi.mo_ta || ''} readOnly />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Mức lương</label>
          <input type="text" name="muc_luong" className="form-control" placeholder="Mức lương" value={formatCurrency(bacsi.muc_luong) || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Trạng thái</label>
          <input type="text" name="trang_thai" className="form-control" placeholder="Trạng thái" value={bacsi.trang_thai === 1 ? 'Đang hoạt động' : 'Đang nghỉ phép' || ''} readOnly />
        </div>
      </div>
      <div className="d-grid">
        <button
          className="btn btn-warning"
          style={{ marginTop: '5px' }}
          onClick={handleDangKyTaiKhoan}
        >
          Đăng ký tài khoản
        </button>
      </div>
    </div>
  );
}
