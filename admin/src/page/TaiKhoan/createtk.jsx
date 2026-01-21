import axios from 'axios';
import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
    ten_nguoi_dung: "",
    mat_khau: "",
    email: "",
    sdt: "",
    anh_nguoi_dung: "",
    type: "",
    id_benh_nhan: "",
    id_bac_si: "",
    confirmmatkhau:""
};

export default function CreateTaiKhoan() {
    const [state, setState] = useState(initialState);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const {
        ten_nguoi_dung,
        mat_khau,
        email,
        sdt,
        anh_nguoi_dung,
        type,
        id_benh_nhan,
        id_bac_si,
        confirmmatkhau
    } = state;

    console.log(state)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ten_nguoi_dung || !mat_khau || !email || !sdt) {
            toast.error("Vui lòng nhập đầy đủ các trường bắt buộc");
            return;
        }

        if (mat_khau !== confirmmatkhau) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            const { data: allAccounts } = await axios.get("http://localhost:5000/api/getalltaikhoan");
            const emailExists = allAccounts.some(account => account.email === email);

            if (emailExists) {
                toast.error("Tài khoản đã tồn tại trong hệ thống!");
                return;
            }

            await axios.post("http://localhost:5000/api/createaccount-with-details", {
                ten_nguoi_dung,
                mat_khau,
                email,
                anh_nguoi_dung,
                sdt,
                type,
                id_benh_nhan: id_benh_nhan || null,
                id_bac_si: id_bac_si || null
            });

            toast.success("Tạo tài khoản thành công!");
            localStorage.removeItem('thongTinTaiKhoanTuBenhNhan');
            localStorage.removeItem('thongTinTaiKhoanTuBacSi');
            setState(initialState);
            setTimeout(() => navigate("/IndexTaiKhoan"), 500);
        } catch (err) {
            toast.error("Đã xảy ra lỗi khi tạo tài khoản");
        }
    };

    useEffect(() => {
    const dataBN = localStorage.getItem('thongTinTaiKhoanTuBenhNhan');
    const dataBS = localStorage.getItem('thongTinTaiKhoanTuBacSi');

    if (dataBN) {
        const parsed = JSON.parse(dataBN);
        setState(prev => ({
        ...prev,
        ten_nguoi_dung: parsed.ten_nguoi_dung || "",
        email: parsed.email || "",
        sdt: parsed.sdt || "",
        anh_nguoi_dung: parsed.anh_nguoi_dung || "",
        id_benh_nhan: parsed.id_benh_nhan || "",
        type:parsed.type || ""
        }));
    }

    if (dataBS) {
        const parsed = JSON.parse(dataBS);
        setState(prev => ({
        ...prev,
        ten_nguoi_dung: parsed.ten_nguoi_dung || "",
        email: parsed.email || "",
        sdt: parsed.sdt || "",
        anh_nguoi_dung: parsed.anh_nguoi_dung || "",
        id_bac_si: parsed.id_bac_si || "",
        type:parsed.type || ""
        }));
    }
    }, []);

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Tạo Tài Khoản</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
               <div className="row mb-3">
            <img style={{ borderRadius: '10px', marginLeft: '10px' }} src={anh_nguoi_dung} width="150" height="180" className="img img-responsive" alt="avatar" />
            </div>

            <div className="row mb-3">
            <div className="col"><input type="text" name="ten_nguoi_dung" value={ten_nguoi_dung} onChange={handleInputChange} className="form-control" placeholder="Tên người dùng *" /></div>
            <div className="col"><input type="text" name="sdt" value={sdt} onChange={handleInputChange} className="form-control" placeholder="Số điện thoại *" /></div>
            </div>

            <div className="row mb-3">
            <div className="col position-relative">
                <input type={showPassword ? "text" : "password"} name="mat_khau" value={mat_khau} onChange={handleInputChange} className="form-control pe-5" placeholder="Mật khẩu" />
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`} style={{ top: "50%", right: "15px", transform: "translateY(-50%)", cursor: "pointer", color: "#999" }} onClick={() => setShowPassword(!showPassword)}></i>
            </div>
            <div className="col position-relative">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmmatkhau" value={confirmmatkhau} onChange={handleInputChange} className="form-control pe-5" placeholder="Nhập lại mật khẩu" />
                <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`} style={{ top: "50%", right: "15px", transform: "translateY(-50%)", cursor: "pointer", color: "#999" }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
            </div>
            </div>

            <div className="row mb-3">
            <div className="col"><input type="email" name="email" value={email} onChange={handleInputChange} className="form-control" placeholder="Email *" /></div>
            <div className="col">
                <select name="type" value={type} onChange={handleInputChange} className="form-control">
                <option value="">Chọn loại tài khoản *</option>
                <option value="2">Bệnh nhân</option>
                <option value="1">Bác sĩ</option>
                <option value="0">Quản trị viên</option>
                </select>
            </div>
            </div>

            <div className="row">
            <div className="d-grid">
                <button style={{ marginLeft: '10px' }} type="submit" className="btn btn-primary">Thêm tài khoản</button>
            </div>
            </div>

            </form>
        </div>
    );
}
