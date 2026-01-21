import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
    id_thuoc_vat_tu: "",
    ten_thuoc_vat_tu: "",
    so_luong: "",
    ngay_nhap: "",
    hinh_anh_vt: ""
};

export default function EditKhoHang() {
    const [state, setState] = useState(initialState);
    const { id_thuoc_vat_tu, ten_thuoc_vat_tu, so_luong, ngay_nhap, hinh_anh_vt } = state;
    const { id_kho } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy thông tin hiện tại của kho hàng
        axios.get(`http://localhost:5000/api/getkhohang/${id_kho}`)
            .then((resp) => setState({ ...resp.data[0] }))
            .catch(() => toast.error("Lỗi khi tải dữ liệu kho hàng"));
    }, [id_kho]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setState({ ...state, hinh_anh_vt: `/images/${file.name}` });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!id_thuoc_vat_tu || !ten_thuoc_vat_tu || !so_luong || !ngay_nhap || !hinh_anh_vt) {
            toast.error("Vui lòng nhập đủ thông tin");
            return;
        }

        if (window.confirm("Bạn có muốn cập nhật thông tin kho hàng?")) {
            const data = { id_thuoc_vat_tu, ten_thuoc_vat_tu, so_luong, ngay_nhap, hinh_anh_vt };

            try {
                await axios.put(`http://localhost:5000/api/updatekhohang/${id_kho}`, data);
                toast.success("Cập nhật thông tin kho hàng thành công!");
                setTimeout(() => navigate("/IndexKhoHang"), 500);
            } catch (err) {
                toast.error(err.response?.data || "Lỗi xảy ra trong quá trình cập nhật");
            }
        }
    };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h1 className="mb-0">Cập nhật kho hàng</h1>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Tên Thuốc/Vật tư</label>
                        <input type="text" name="ten_thuoc_vat_tu" onChange={handleInputChange} value={ten_thuoc_vat_tu || ""} className="form-control" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Số Lượng</label>
                        <input type="number" name="so_luong" onChange={handleInputChange} value={so_luong || ""} className="form-control" />
                    </div>
                    <div className="col">
                        <label className="form-label">Ngày Nhập</label>
                        <input type="date" name="ngay_nhap" onChange={handleInputChange} value={ngay_nhap || ""} className="form-control" />
                    </div>
                </div>
                <div className="row mb-3">
                    <img src={hinh_anh_vt} alt="Hình ảnh sản phẩm" width="150" height="180" style={{ borderRadius: '10px', marginLeft: '10px' }} />
                    <div className="col">
                        <label className="form-label">Hình Ảnh Vật Tư</label>
                        <input type="file" name="hinh_anh_vt" onChange={handleFileChange} className="form-control" />
                    </div>
                </div>
                <div className="row">
                    <div className="d-grid">
                        <button className="btn btn-warning" style={{ marginLeft: '10px' }}>Cập nhật</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
