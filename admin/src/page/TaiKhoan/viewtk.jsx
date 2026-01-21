import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ViewTaiKhoanByID() {
  const [account, setAccount] = useState({});
  const { id_tai_khoan } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/getaccountbyid/${id_tai_khoan}`)
      .then((res) => {
        setAccount(res.data[0]);
      });
  }, [id_tai_khoan]);

  console.log(account)

  return (
    <div>
       <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thông tin tài khoản</h3>
      </div>
      <hr />
      <div className="row mb-3">
        <img
          style={{ borderRadius: '10px', marginLeft: '12px' }}
          src={account.anh_nguoi_dung}
          width="150"
          height="180"
          className="img img-responsive"
          alt="avatar"
        />
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Tên người dùng</label>
          <input type="text" className="form-control" value={account.ten_nguoi_dung || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={account.email || ''} readOnly />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Số điện thoại</label>
          <input type="text" className="form-control" value={account.sdt || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Loại tài khoản</label>
          <input type="text" className="form-control" value={
            account.type === 1 ? 'Bệnh nhân' : account.type === 2 ? 'Bác sĩ' : account.type === 3 ? 'Quản trị viên' : ''
          } readOnly />
        </div>
      </div>
    </div>
  );
}
