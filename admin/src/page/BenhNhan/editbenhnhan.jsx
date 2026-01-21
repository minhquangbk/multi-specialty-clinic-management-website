import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const initiaState = {
  ho_ten: "",
  ngay_sinh: "",
  gioi_tinh: "",
  dia_chi: "",
  so_dien_thoai: "",
  email: "",
  cmnd: "",
  hinh_anh_bn:"",
  ngay_vao_kham:"",
  ngay_xuat_phong:"",
};

export default function EditBenhNhan() {
  const [state, setState] = useState(initiaState);
  const { ho_ten, ngay_sinh, gioi_tinh, dia_chi, so_dien_thoai, email, cmnd ,hinh_anh_bn,ngay_vao_kham,ngay_xuat_phong } = state;
  const { id_benh_nhan } = useParams();
  const navigate = useNavigate();
  console.log(state)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/getbenhnhan/${id_benh_nhan}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id_benh_nhan]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

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

        axios.put(`http://localhost:5000/api/updatebenhnhan/${id_benh_nhan}`, formattedData)
          .then(() => {
            setState(initiaState);
            toast.success("Cập nhật bệnh nhân thành công!");
            setTimeout(() => navigate("/IndexBenhNhan"), 500);
          })
          .catch((err) => toast.error(err.response?.data || "Có lỗi xảy ra"));
      }
    }
  };

  const dateinput = new Date(ngay_vao_kham);
  const formattedDateinput = dateinput.toLocaleDateString('en-GB');
  const date = new Date(ngay_sinh);
  const formattedDate = date.toLocaleDateString('en-GB');
  const dateoutput = new Date(ngay_xuat_phong);
  const formattedDateoutput = dateoutput.toLocaleDateString('en-GB');
  
  return (
    <div>
      <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Cập nhật thông tin Bệnh Nhân</h3>
      </div>
      <hr />
      <form onSubmit={handleSubmit} method="POST">
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Họ và Tên</label>
            <input type="text" name="ho_ten" className="form-control" placeholder="Họ và Tên" onChange={handleInputChange} value={ho_ten || ""} />
          </div>
          <div className="col mb-3">
            <label className="form-label">Ngày Sinh {formattedDate}</label>
            <input type="date" name="ngay_sinh" className="form-control" onChange={handleInputChange} value={ngay_sinh || ""} />
          </div>
        </div>
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Giới Tính</label>
            <select name="gioi_tinh" className="form-control" onChange={handleInputChange} value={gioi_tinh || ""}>
              <option value="">Chọn Giới Tính</option>
              <option value="1">Nam</option>
              <option value="2">Nữ</option>
            </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">Số Điện Thoại</label>
            <input type="text" name="so_dien_thoai" className="form-control" placeholder="Số Điện Thoại" onChange={handleInputChange} value={so_dien_thoai || ""} />
          </div>
        </div>
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleInputChange} value={email || ""} />
          </div>
          <div className="col mb-3">
            <label className="form-label">Địa Chỉ</label>
            <input type="text" name="dia_chi" className="form-control" placeholder="Địa Chỉ" onChange={handleInputChange} value={dia_chi || ""} />
          </div>
        </div>
        <div className="row">
           <div className="col">
            <label className="form-label">Hình ảnh bệnh nhân</label>
            <input type="file" name="hinh_anh_bn" onChange={handleFileChange}  className="form-control" />
          </div>
          <div className="col mb-3">
            <label className="form-label">CMND</label>
            <input type="text" name="cmnd" className="form-control" placeholder="CMND" onChange={handleInputChange} value={cmnd || ""} />
          </div>
        </div>
        <div className="row">
           <div className="col">
            <label className="form-label">Ngày vào khám: {formattedDateinput}</label>
            <input type="date" name="ngay_vao_kham"  className="form-control" onChange={handleInputChange} value={ngay_vao_kham || ""}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Ngày xuất phòng: {formattedDateoutput}</label>
            <input type="date" name="ngay_xuat_phong" className="form-control"  onChange={handleInputChange} value={ngay_xuat_phong || ""} />
          </div>
        </div>
        <div className='row'>
        <img style={{ borderRadius: '10px', marginLeft: '10px' }} src={hinh_anh_bn} width='150' height='180' className="img img-responsive" />
        </div>
        <div className="row">
          <div className="d-grid">
            <button className="btn btn-warning" style={{ marginLeft: '10px' ,marginTop:'15px' }}>Cập nhật</button>
          </div>
        </div>
      </form>
    </div>
  );
}


