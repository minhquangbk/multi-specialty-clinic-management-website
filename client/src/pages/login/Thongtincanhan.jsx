import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Thongtincanhan.css'
import { useUser } from '../../until/userContext';

const initiaState = {
  ho_ten: "",
  ngay_sinh: "",
  gioi_tinh: "",
  dia_chi: "",
  so_dien_thoai: "",
  email: "",
  cmnd: "",
  hinh_anh_bn: "",
  ngay_vao_kham: "",
  ngay_xuat_phong: "",
};

export default function EditThongTin() {
  const [state, setState] = useState(initiaState);
  const { ho_ten, ngay_sinh, gioi_tinh, dia_chi, so_dien_thoai, email, cmnd, hinh_anh_bn, ngay_vao_kham, ngay_xuat_phong } = state;
  const navigate = useNavigate();
  const { user } = useUser();
  const [idUser, setIdUser] = useState(null);

  useEffect(() => {
    const fetchIdUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/getinfobyiduser/${user.id}`);
        const data = await res.json();

        if (data && data.id_user) {
          setIdUser(data.id_user); // Lưu id_user (bác sĩ hoặc bệnh nhân)
        }
      } catch (error) {
        console.error('Lỗi khi lấy id_user:', error);
      }
    };

    if (user?.id) {
      fetchIdUser();
    }
  }, [user]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/getbenhnhan/${idUser}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [idUser]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setState({ ...state, hinh_anh_bn: `/images/${file.name}` });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ho_ten || !ngay_sinh || !gioi_tinh || !dia_chi || !so_dien_thoai || !email || !cmnd) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
    } else {
      if (window.confirm("Bạn có muốn cập nhật thông tin bệnh nhân?")) {
        const formattedData = {
          ho_ten,
          ngay_sinh: new Date(ngay_sinh).toISOString().split('T')[0],
          gioi_tinh,
          dia_chi,
          so_dien_thoai,
          email,
          cmnd,
          hinh_anh_bn,
          ngay_vao_kham: ngay_vao_kham ? new Date(ngay_vao_kham).toISOString().split('T')[0] : null,
          ngay_xuat_phong: ngay_xuat_phong ? new Date(ngay_xuat_phong).toISOString().split('T')[0] : null
        };

        axios.put(`http://localhost:5000/api/updatebenhnhan/${idUser}`, formattedData)
          .then(() => {
            setState(initiaState);
            toast.success("Cập nhật bệnh nhân thành công!");
            setTimeout(() => navigate("/"), 500);
          })
          .catch((err) => toast.error(err.response?.data || "Có lỗi xảy ra"));
      }
    }
  };

    const formatDate = (dateString) => {
        const date = new Date(dateString);// Chuyển đổi date thành múi giờ UTC và lấy phần ngày mà không bị ảnh hưởng múi giờ
        const year = date.getFullYear();//Lấy năm
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng
        const day = date.getDate().toString().padStart(2, '0');//Lấy ngày
        return `${year}-${month}-${day}`;
      };

  return (
    <div className="edit-benhnhan-container">
      <h1 className="edit-benhnhan-title">Cập nhật thông tin Bệnh Nhân</h1>
      <form className="edit-benhnhan-form" onSubmit={handleSubmit}>
        <div className="edit-benhnhan-form-group">
          <label>Họ và Tên</label>
          <input type="text" name="ho_ten" placeholder="Họ và Tên" onChange={handleInputChange} value={ho_ten || ""} />
        </div>

        <div className="edit-benhnhan-form-group">
          <label>Ngày Sinh</label>
          <input type="date" name="ngay_sinh" onChange={handleInputChange} value={ngay_sinh ? formatDate(ngay_sinh) : ""} />
        </div>

        <div className="edit-benhnhan-form-group">
          <label>Giới Tính</label>
          <select name="gioi_tinh" onChange={handleInputChange} value={gioi_tinh || ""}>
            <option value="">Chọn Giới Tính</option>
            <option value="1">Nam</option>
            <option value="2">Nữ</option>
          </select>
        </div>

        <div className="edit-benhnhan-form-group">
          <label>Số Điện Thoại</label>
          <input type="text" name="so_dien_thoai" placeholder="Số Điện Thoại" onChange={handleInputChange} value={so_dien_thoai || ""} />
        </div>

        <div className="edit-benhnhan-form-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} value={email || ""} />
        </div>

        <div className="edit-benhnhan-form-group">
          <label>Địa Chỉ</label>
          <input type="text" name="dia_chi" placeholder="Địa Chỉ" onChange={handleInputChange} value={dia_chi || ""} />
        </div>

        <div className="edit-benhnhan-form-group">
          <label>Hình ảnh bệnh nhân</label>
          <input type="file" name="hinh_anh_bn" onChange={handleFileChange} />
        </div>

        <div className="edit-benhnhan-form-group">
          <label>CMND</label>
          <input type="text" name="cmnd" placeholder="CMND" onChange={handleInputChange} value={cmnd || ""} />
        </div>

        <img className="edit-benhnhan-img" src={hinh_anh_bn} alt="Patient" />

        <button type="submit" className="edit-benhnhan-btn">Cập nhật</button>
      </form>
    </div>
  );
}
