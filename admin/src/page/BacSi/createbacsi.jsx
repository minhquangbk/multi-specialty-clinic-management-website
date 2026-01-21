import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
   ho_ten: "",
   id_khoa: "",
   so_dien_thoai: "",
   email: "",
   dia_chi: "",
   id_bang_cap: "",
   ngay_vao_lam: "",
   hinh_anh_bs: "",
   chuc_danh: "",
   mo_ta: "",
   gioi_tinh: "",
   ngay_sinh: "",
   cmnd: "",
   muc_luong: ""
};

export default function CreateBacSi() {
    const [state, setState] = useState(initialState);
    const [bangCapOptions, setBangCapOptions] = useState([]); 
    const [khoaOptions, setKhoaOptions] = useState([]);

    const { ho_ten, id_khoa, so_dien_thoai, email, dia_chi, id_bang_cap, ngay_vao_lam, hinh_anh_bs, chuc_danh, mo_ta, gioi_tinh, ngay_sinh, cmnd, muc_luong} = state;
    console.log(state)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bangCapResponse = await axios.get("http://localhost:5000/api/getalltrinhdo");
                setBangCapOptions(bangCapResponse.data); 

                const khoaResponse = await axios.get("http://localhost:5000/api/getalldmkhoa");
                setKhoaOptions(khoaResponse.data); 
            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu");
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!ho_ten || !id_khoa || !so_dien_thoai || !email || !dia_chi || !id_bang_cap || !ngay_vao_lam || !hinh_anh_bs || !chuc_danh || !mo_ta || !gioi_tinh || !ngay_sinh || !cmnd) {
            toast.error("Vui lòng nhập đủ thông tin");
        } else {
            axios.post("http://localhost:5000/api/createbacsi", {
                ho_ten,
                id_khoa,
                so_dien_thoai,
                email,
                dia_chi,
                id_bang_cap,
                ngay_vao_lam,
                hinh_anh_bs,
                chuc_danh,
                mo_ta,
                gioi_tinh,
                ngay_sinh,
                cmnd,
                muc_luong,
                trang_thai:1
            })
            .then(() => {
                setState(initialState);
                toast.success("Thêm bác sĩ thành công!");
                setTimeout(() => navigate("/IndexBacSi"), 500);
            })
            .catch((err) => toast.error(err.response.data));
        }
    };
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setState({ ...state, hinh_anh_bs: `/images/${file.name}` });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thêm bác sĩ</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className='row mb-3'>
                <img style={{ borderRadius: '10px', marginLeft: '10px' }} src={hinh_anh_bs} width='150' height='180' className="img img-responsive" />
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="ho_ten" onChange={handleInputChange} value={ho_ten} className="form-control" placeholder="Tên bác sĩ" />
                    </div>
                    <div className="col">
                        <select name="gioi_tinh" onChange={handleInputChange} value={gioi_tinh} className="form-control">
                            <option value="">Chọn giới tính</option>
                            <option value="1">Nam</option>
                            <option value="0">Nữ</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <p>Ngày sinh</p>
                        <input type="date" name="ngay_sinh" onChange={handleInputChange} value={ngay_sinh} className="form-control" placeholder="Ngày sinh" />
                    </div>
                    <div className="col">
                        <p>Ngày vào làm</p>
                        <input type="date" name="ngay_vao_lam" onChange={handleInputChange} value={ngay_vao_lam} className="form-control" placeholder="Ngày vào làm" />
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
                        <select name="id_bang_cap" onChange={handleInputChange} value={id_bang_cap} className="form-control">
                            <option value="">Chọn trình độ bằng cấp</option>
                            {bangCapOptions.map(bangCap => (
                                <option key={bangCap.id_bang_cap} value={bangCap.id_bang_cap}>{bangCap.ten_bang_cap}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <select name="id_khoa" onChange={handleInputChange} value={id_khoa} className="form-control">
                            <option value="">Chọn khoa làm việc</option>
                            {khoaOptions.map(khoa => (
                                <option key={khoa.id_khoa} value={khoa.id_khoa}>{khoa.ten_khoa}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="chuc_danh" onChange={handleInputChange} value={chuc_danh} className="form-control" placeholder="Chức danh" />
                    </div>
                    <div className="col">
                        <input type="text" name="dia_chi" onChange={handleInputChange} value={dia_chi} className="form-control" placeholder="Địa chỉ" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="cmnd" onChange={handleInputChange} value={cmnd} className="form-control" placeholder="Căn cước công dân" />
                    </div>
                    <div className="col">
                        <input type="file" name="hinh_anh_bs" onChange={handleFileChange} className="form-control" placeholder="Ảnh bác sĩ" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <textarea name="mo_ta" onChange={handleInputChange} value={mo_ta} className="form-control" placeholder="Mô tả về chuyên môn hoặc kinh nghiệm"></textarea>
                    </div>
                    <div className="col">
                        <input name="muc_luong" onChange={handleInputChange} value={muc_luong} className="form-control" placeholder="Mức lương"></input>
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
