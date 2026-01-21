import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initialState = {
    ten_dich_vu: "",
    gia: "",
    mo_ta: "",
    hinh_anh_dv: "",
    loi_ich_kham: "",
    huong_dan_kham: "",
    id_khoa: "" // Thêm id_khoa vào state
};

export default function Creategdv() {
    const [state, setState] = useState(initialState);
    const [khoaList, setKhoaList] = useState([]);  // state lưu danh sách khoa
    const { ten_dich_vu, gia, mo_ta, hinh_anh_dv, loi_ich_kham, huong_dan_kham, id_khoa } = state;

    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để lấy danh sách các khoa
        axios.get("http://localhost:5000/api/getalldmkhoa")
            .then((response) => {
                setKhoaList(response.data);
            })
            .catch((error) => {
                console.error(error);
                toast.error("Lỗi khi lấy danh sách khoa");
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!ten_dich_vu || !gia || !mo_ta || !hinh_anh_dv || !loi_ich_kham || !huong_dan_kham || !id_khoa) {
            toast.error("Vui lòng nhập đủ thông tin");
        } else {
            axios.post("http://localhost:5000/api/creategdv", {
                ten_dich_vu, gia, mo_ta, hinh_anh_dv, loi_ich_kham, huong_dan_kham, id_khoa
            }).then(() => {
                setState(initialState);
                toast.success("Thêm dịch vụ thành công!");
                setTimeout(() => navigate("/Indexgdv"), 500);
            }).catch((err) => toast.error(err.response.data));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setState({ ...state, hinh_anh_dv: `/images/${file.name}` });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thêm dịch vụ khám</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
            
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="ten_dich_vu" onChange={handleInputChange} value={ten_dich_vu} className="form-control" placeholder="Tên dịch vụ khám" />
                    </div>
                    <div className="col">
                        <input type="text" name="gia" onChange={handleInputChange} value={gia} className="form-control" placeholder="Giá" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="loi_ich_kham" onChange={handleInputChange} value={loi_ich_kham} className="form-control" placeholder="Lợi ích sàng lọc" />
                    </div>
                    <div className="col">
                        <input type="text" name="huong_dan_kham" onChange={handleInputChange} value={huong_dan_kham} className="form-control" placeholder="Hướng dẫn khám" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="file" name="hinh_anh_dv" onChange={handleFileChange} className="form-control" placeholder="Hình ảnh dịch vụ" />
                    </div>
                    <div className="col">
                        <select
                            name="id_khoa"
                            value={id_khoa}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="">Chọn khoa</option>
                            {khoaList.map((khoa) => (
                                <option key={khoa.id_khoa} value={khoa.id_khoa}>
                                    {khoa.ten_khoa}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <textarea name="mo_ta" onChange={handleInputChange} value={mo_ta} className="form-control" placeholder="Mô tả"></textarea>
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
