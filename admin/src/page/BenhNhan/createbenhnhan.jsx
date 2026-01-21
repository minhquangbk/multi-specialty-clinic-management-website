import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
    ho_ten: "",
    ngay_sinh: "",
    gioi_tinh: "",
    dia_chi: "",
    so_dien_thoai: "",
    email: "",
    cmnd: "",
    hinh_anh_bn:""
};

export default function CreateBenhNhan() {
    const [state, setState] = useState(initialState);
    const { ho_ten, ngay_sinh, gioi_tinh, dia_chi, so_dien_thoai, email, cmnd ,hinh_anh_bn } = state;

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!ho_ten || !ngay_sinh || !gioi_tinh || !dia_chi || !so_dien_thoai || !email || !cmnd) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
        } else {
            axios.post("http://localhost:5000/api/createbenhnhan", {
                ho_ten, ngay_sinh, gioi_tinh, dia_chi, so_dien_thoai, email, cmnd ,hinh_anh_bn
            }).then(() => {
                setState(initialState);
                toast.success("Thêm bệnh nhân thành công!");
                setTimeout(() => navigate("/IndexBenhNhan"), 500);
            }).catch((err) => toast.error(err.response.data));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setState({ ...state, hinh_anh_bn: `/images/${file.name}` });
    };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thêm Bệnh Nhân</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
            <div className='row mb-3'>
                <img style={{ borderRadius: '10px', marginLeft: '10px' }} src={hinh_anh_bn} width='150' height='180' className="img img-responsive" />
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="ho_ten" onChange={handleInputChange} value={ho_ten} className="form-control" placeholder="Họ và Tên" />
                    </div>
                    <div className="col">
                        <input type="date" name="ngay_sinh" onChange={handleInputChange} value={ngay_sinh} className="form-control" placeholder="Ngày Sinh" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <select name="gioi_tinh" onChange={handleInputChange} value={gioi_tinh} className="form-control">
                            <option value="">Chọn Giới Tính</option>
                            <option value="1">Nam</option>
                            <option value="2">Nữ</option>
                        </select>
                    </div>
                    <div className="col">
                        <input type="text" name="cmnd" onChange={handleInputChange} value={cmnd} className="form-control" placeholder="CMND" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="so_dien_thoai" onChange={handleInputChange} value={so_dien_thoai} className="form-control" placeholder="Số điện thoại" />
                    </div>
                    <div className="col">
                        <input type="email" name="email" onChange={handleInputChange} value={email} className="form-control" placeholder="Email" />
                    </div>
                </div>
                <div className="row mb-3">
                <div className="col">
                    <input type="file" name="hinh_anh_bn" onChange={handleFileChange} className="form-control" />
                </div>
                    <div className="col">
                        <input type="text" name="dia_chi" onChange={handleInputChange} value={dia_chi} className="form-control" placeholder="Địa chỉ" />
                    </div>
                </div>
                
                <div className="row">
                    <div className="d-grid">
                        <button style={{ marginLeft: '10px' }} type="submit" className="btn btn-primary">Thêm</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
