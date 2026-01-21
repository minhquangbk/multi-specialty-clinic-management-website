import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
    ten_dich_vu: "",
    gia: "",
    hinh_anh_dv: "",
    mo_ta: "",
    loi_ich_kham: "",
    huong_dan_kham: "",
    id_khoa: "",
    uu_dai:""
};

export default function Editgdv() {
    const [state, setState] = useState(initialState);
    const [file, setFile] = useState(null);
    const [khoaList, setKhoaList] = useState([]); // state lưu danh sách khoa
    const { ten_dich_vu, gia, hinh_anh_dv, mo_ta, loi_ich_kham, huong_dan_kham, id_khoa,uu_dai } = state;
    const { id_dich_vu } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để lấy danh sách các khoa
        axios.get("http://localhost:5000/api/getalldmkhoa")
            .then((response) => setKhoaList(response.data))
            .catch((error) => {
                console.error(error);
                toast.error("Lỗi khi lấy danh sách khoa");
            });

        // Gọi API để lấy thông tin dịch vụ theo id_dich_vu
        axios.get(`http://localhost:5000/api/getgdvid/${id_dich_vu}`)
            .then((resp) => setState({ ...resp.data[0] }))
            .catch((err) => toast.error(err.response.data));
    }, [id_dich_vu]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setState({ ...state, hinh_anh_dv: `/images/${file.name}` });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!ten_dich_vu || !gia || !hinh_anh_dv || !mo_ta || !loi_ich_kham || !huong_dan_kham || !id_khoa) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
        } else {
            if (window.confirm("Bạn có muốn cập nhật thông tin?")) {
                axios.put(`http://localhost:5000/api/updategdv/${id_dich_vu}`, {
                    ten_dich_vu, gia, hinh_anh_dv, mo_ta, loi_ich_kham, huong_dan_kham, id_khoa,uu_dai
                })
                .then(() => {
                    setState(initialState);
                    toast.success("Cập nhật dịch vụ thành công!");
                    setTimeout(() => navigate("/Indexgdv"), 500);
                })
                .catch((err) => toast.error(err.response.data));
            }
        }
    };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Cập nhật dịch vụ khám</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Tên dịch vụ</label>
                        <input type="text" name="ten_dich_vu" className="form-control" onChange={handleInputChange} placeholder="Tên dịch vụ" value={ten_dich_vu || ""} />
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Giá</label>
                        <input type="text" name="gia" className="form-control" onChange={handleInputChange} placeholder="Giá" value={gia || ""} />
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Chọn khoa</label>
                        <select
                            name="id_khoa"
                            value={id_khoa || ""}
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

                    <div className="col mb-3">
                        <label className="form-label">Ưu Đãi</label>
                        <input type="text" name="uu_dai" className="form-control" onChange={handleInputChange} placeholder="Ưu đãi" value={uu_dai || ""} />
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Lợi ích sàng lọc</label>
                        <textarea style={{ minHeight: '120px' }}  type="text" name="loi_ich_kham" className="form-control" onChange={handleInputChange} placeholder="Thông số 1" value={loi_ich_kham || ""} />
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Hướng dẫn khám</label>
                        <textarea style={{ minHeight: '120px' }}  type="text" name="huong_dan_kham" className="form-control" onChange={handleInputChange} placeholder="Thông số 2" value={huong_dan_kham || ""} />
                    </div>
                </div>
                <div className='row'>
                    <div className="col mb-3">
                        <label className="form-label">Mô tả</label>
                        <textarea style={{ minHeight: '110px' }}  type="text" name="mo_ta" className="form-control" onChange={handleInputChange} placeholder="Mô tả" value={mo_ta || ""} />
                    </div>
                </div>
                <div className="row">
                    <img style={{ borderRadius: '10px', marginLeft: '10px' }} src={hinh_anh_dv} width='150' height='180' className="img img-responsive" alt={ten_dich_vu} />
                    <div className="col mb-3">
                        <label className="form-label">Ảnh dịch vụ</label>
                        <input type="file" name="hinh_anh_dv" className="form-control" onChange={handleFileChange} placeholder="Ảnh dịch vụ" />
                    </div>
                </div>
                <div className="row">
                    <div className="d-grid">
                        <button style={{ marginLeft: '10px', marginTop: '30px' }} className="btn btn-warning">Cập nhật</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
