import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
   ten_phong_kham: "",
   so_phong: "",
   so_dien_thoai: "",
   mo_ta: "",
   id_khoa: ""
};

export default function CreatePhongKham() {
    const [state, setState] = useState(initialState);
    const [khoaOptions, setKhoaOptions] = useState([]); // State for department options

    const { ten_phong_kham, so_phong, so_dien_thoai, mo_ta, id_khoa } = state;

    const navigate = useNavigate();

    // Fetch department data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const khoaResponse = await axios.get("http://localhost:5000/api/getalldmkhoa");
                setKhoaOptions(khoaResponse.data); // Set department options
            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu khoa");
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!ten_phong_kham || !so_phong || !so_dien_thoai || !mo_ta || !id_khoa) {
            toast.error("Vui lòng nhập đủ thông tin");
        } else {
            axios.post("http://localhost:5000/api/createphongkham", {
                ten_phong_kham,
                so_phong,
                so_dien_thoai,
                mo_ta,
                id_khoa
            })
            .then(() => {
                setState(initialState);
                toast.success("Thêm phòng khám thành công!");
                setTimeout(() => navigate("/IndexPhongKham"), 500);
            })
            .catch((err) => toast.error(err.response.data));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    return (
        <div>
            <h3 className="mb-0">Thêm phòng khám</h3>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="ten_phong_kham" onChange={handleInputChange} value={ten_phong_kham} className="form-control" placeholder="Tên phòng khám" />
                    </div>
                    <div className="col">
                        <input type="text" name="so_phong" onChange={handleInputChange} value={so_phong} className="form-control" placeholder="Số phòng" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="so_dien_thoai" onChange={handleInputChange} value={so_dien_thoai} className="form-control" placeholder="Số điện thoại" />
                    </div>
                    <div className="col">
                        <select name="id_khoa" onChange={handleInputChange} value={id_khoa} className="form-control">
                            <option value="">Chọn khoa</option>
                            {khoaOptions.map(khoa => (
                                <option key={khoa.id_khoa} value={khoa.id_khoa}>{khoa.ten_khoa}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <textarea name="mo_ta" onChange={handleInputChange} value={mo_ta} className="form-control" placeholder="Mô tả phòng khám"></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="d-grid">
                        <button style={{ marginLeft: '10px' }}  type="submit" className="btn btn-primary">Thêm</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
