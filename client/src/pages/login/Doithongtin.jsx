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
      updateUser({ id: user.id, name: formData.tenNguoiDung , username: formData.email
        
       });
      toast.success("Cập nhật thông tin thành công!");
      navigate('/');

    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      toast.error("Cập nhật thất bại.");
    }
  };

  if (!user) {
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Đang tải dữ liệu người dùng...</p>;
  }

  return (
    <div className="modal-form">
      <form className="form-login2" onSubmit={handleSubmit}>
        <h2 className="login__heading">Cập nhật tài khoản</h2>

        <input
          type="text"
          placeholder="Tên của bạn"
          className="login__input"
          name="tenNguoiDung"
          value={formData.tenNguoiDung}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Số điện thoại"
          className="login__input"
          name="sdt"
          value={formData.sdt}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Email"
          className="login__input"
          name="email"
          value={formData.email}
          disabled // Email không cho phép sửa
        />

        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu hiện tại"
            className="login__input"
            name="matKhauCu"
            value={formData.matKhauCu}
            onChange={handleChange}
          />
          <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowPassword(!showPassword)}></i>
        </div>

        <div className="password-input-container">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Mật khẩu mới"
            className="login__input"
            name="matKhauMoi"
            value={formData.matKhauMoi}
            onChange={handleChange}
          />
          <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowNewPassword(!showNewPassword)}></i>
        </div>

        <button type="submit" className="btn btn--login1">Cập nhật</button>
      </form>
    </div>
  );
}
