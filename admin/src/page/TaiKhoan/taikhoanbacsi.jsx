import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '../../until/userContext';
import { useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    tenNguoiDung: '',
    sdt: '',
    matKhauCu: '',
    matKhauMoi: '',
    email: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { user , updateUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu user chưa có, không gọi API
    if (!user || !user.id) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/getaccountbyid/${user.id}`);
        const userData = res.data[0]; // ✅ Lấy phần tử đầu tiên trong mảng trả về

        setFormData(prev => ({
          ...prev,
          tenNguoiDung: userData.ten_nguoi_dung,
          sdt: userData.sdt,
          email: userData.email
        }));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      toast.error("Không thể cập nhật. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/updateaccount', {
        id_tai_khoan: user.id,
        ten_nguoi_dung: formData.tenNguoiDung,
        sdt: formData.sdt,
        mat_khau_cu: formData.matKhauCu || undefined,
        mat_khau_moi: formData.matKhauMoi || undefined
      });
      updateUser({
        ...user,
        name: formData.tenNguoiDung
      });
      toast.success("Cập nhật thông tin thành công!");
      navigate('/Capnhattaikhoan');

    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      toast.error("Cập nhật thất bại.");
    }
  };

  if (!user) {
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Đang tải dữ liệu người dùng...</p>;
  }

return (
  <div>
    <h3 className="mb-4">Cập nhật tài khoản</h3>
    <form onSubmit={handleSubmit} encType="multipart/form-data">
<div className="row mb-2">
  <label className="col-sm-2 col-form-label">Tên người dùng:</label>
  <div className="col-sm-5">
    <input
      type="text"
      className="form-control"
      name="tenNguoiDung"
      value={formData.tenNguoiDung}
      onChange={handleChange}
      placeholder="Tên của bạn"
    />
  </div>
</div>

<div className="row mb-2">
  <label className="col-sm-2 col-form-label">Số điện thoại:</label>
  <div className="col-sm-5">
    <input
      type="text"
      className="form-control"
      name="sdt"
      value={formData.sdt}
      onChange={handleChange}
      placeholder="Số điện thoại"
    />
  </div>
</div>

<div className="row mb-2">
  <label className="col-sm-2 col-form-label">Email:</label>
  <div className="col-sm-5">
    <input
      type="email"
      className="form-control"
      name="email"
      value={formData.email}
      disabled
    />
  </div>
</div>

<div className="row mb-2">
  <label className="col-sm-2 col-form-label">Mật khẩu hiện tại:</label>
  <div className="col-sm-5 position-relative">
    <input
      type={showPassword ? "text" : "password"}
      className="form-control pe-5"
      name="matKhauCu"
      value={formData.matKhauCu}
      onChange={handleChange}
      placeholder="Mật khẩu hiện tại"
    />
    <i
      className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}
      style={{
        top: "50%",
        right: "15px",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#999"
      }}
      onClick={() => setShowPassword(!showPassword)}
    ></i>
  </div>
</div>

<div className="row mb-2">
  <label className="col-sm-2 col-form-label">Mật khẩu mới:</label>
  <div className="col-sm-5 position-relative">
    <input
      type={showNewPassword ? "text" : "password"}
      className="form-control pe-5"
      name="matKhauMoi"
      value={formData.matKhauMoi}
      onChange={handleChange}
      placeholder="Mật khẩu mới"
    />
    <i
      className={`fa ${showNewPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}
      style={{
        top: "50%",
        right: "15px",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#999"
      }}
      onClick={() => setShowNewPassword(!showNewPassword)}
    ></i>
  </div>
</div>

<div className="row mt-3">
  <div className="col-sm-5 offset-sm-2">
    <button type="submit" className="btn btn-warning">Cập nhật</button>
  </div>
</div>

    </form>
  </div>
);

}
