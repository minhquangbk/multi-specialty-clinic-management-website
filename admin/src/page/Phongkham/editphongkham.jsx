import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
    ten_phong_kham: "",
    so_phong: "",
    so_dien_thoai: "",
    id_khoa: "",
    mo_ta: "",
};

export default function EditPhongKham() {
    const [state, setState] = useState(initialState);
    const [khoaOptions, setKhoaOptions] = useState([]);
    const { ten_phong_kham, so_phong, so_dien_thoai, id_khoa, mo_ta } = state;
    const { id_phong_kham } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getphongkham/${id_phong_kham}`)
            .then((resp) => setState({ ...resp.data[0] }));
        
        const fetchOptions = async () => {
            try {
                const khoaResponse = await axios.get("http://localhost:5000/api/getalldmkhoa");
                setKhoaOptions(khoaResponse.data);
            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu");
            }
        };
        fetchOptions();
    }, [id_phong_kham]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Kiểm tra các trường bắt buộc
        if (!ten_phong_kham || !so_phong || !so_dien_thoai || !id_khoa || !mo_ta) {
            toast.error("Vui lòng nhập đủ thông tin");
        } else {
            if (window.confirm("Bạn có muốn cập nhật thông tin phòng khám?")) {
                // Tạo dữ liệu JSON để gửi đi
                const data = {
                    ten_phong_kham,
                    so_phong,
                    so_dien_thoai,
                    id_khoa,
                    mo_ta
                };
                
                try {
                    // Gửi yêu cầu cập nhật thông tin phòng khám
                    await axios.put(`http://localhost:5000/api/updatephongkham/${id_phong_kham}`, data);
                    toast.success("Cập nhật thông tin phòng khám thành công!");
                    setTimeout(() => navigate("/IndexPhongKham"), 500);
                } catch (err) {
                    toast.error(err.response?.data || "Lỗi xảy ra trong quá trình cập nhật");
                }
            }
        }
    };

    return (
        <div>
            <h1 className="mb-0">Cập nhật phòng khám</h1>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Tên phòng khám</label>
                        <input type="text" name="ten_phong_kham" onChange={handleInputChange} value={ten_phong_kham || ""} className="form-control" placeholder="Tên phòng khám" />
                    </div>
                    <div className="col">
                        <label className="form-label">Số phòng</label>
                        <input type="text" name="so_phong" onChange={handleInputChange} value={so_phong || ""} className="form-control" placeholder="Số phòng" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Số điện thoại</label>
                        <input type="text" name="so_dien_thoai" onChange={handleInputChange} value={so_dien_thoai || ""} className="form-control" placeholder="Số điện thoại" />
                    </div>
                    <div className="col">
                        <label className="form-label">ID Khoa</label>
                        <select name="id_khoa" onChange={handleInputChange} value={id_khoa || ""} className="form-control">
                            <option value="">Chọn khoa</option>
                            {khoaOptions.map(khoa => (
                                <option key={khoa.id_khoa} value={khoa.id_khoa}>{khoa.ten_khoa}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Mô tả</label>
                        <textarea name="mo_ta" onChange={handleInputChange} value={mo_ta || ""} className="form-control" placeholder="Mô tả" />
                    </div>
                </div>
                <div className="row">
                    <div className="d-grid">
                        <button style={{ marginLeft: '10px' }}  className="btn btn-warning">Cập nhật</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
