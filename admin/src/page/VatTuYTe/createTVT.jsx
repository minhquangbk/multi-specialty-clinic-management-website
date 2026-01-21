import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate  } from 'react-router-dom';

const initialState = {
    ten_thuoc: "",
    gia: "",
    so_luong: "",
    don_vi: "",
    id_loai_thuoc: "",
    ngay_them: "",
    hinh_anh: "",
    mo_ta:""
}

export default function CreateThuoc() {

    const [state, setState] = useState(initialState);

    const [loaiThuocOptions, setloaiThuocOptions] = useState([]);

    const { ten_thuoc, gia, so_luong, don_vi, id_loai_thuoc, hinh_anh,mo_ta } = state;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loaiThuocResponse = await axios.get("http://localhost:5000/api/getallLoaiTVT");
                setloaiThuocOptions(loaiThuocResponse.data);

            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu");
            }
        };
        fetchData();
    }, []);

    // Tạo ngày hiện tại ở định dạng YYYY-MM-DD
    const today = new Date();
    const ngay_them = today.toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!ten_thuoc || !gia || !so_luong || !don_vi || !id_loai_thuoc || !hinh_anh) {
            toast.error("Vui lòng nhập đủ thông tin");
        } else {
            axios.post("http://localhost:5000/api/createTVT", {
                ten_thuoc, gia, so_luong, don_vi, id_loai_thuoc, ngay_them, hinh_anh,mo_ta
            }).then(() => {
                setState({
                    ten_thuoc: "", gia: "", so_luong: "", don_vi: "", id_loai_thuoc: "", hinh_anh: "",mo_ta:"",
                });
            }).catch((err) => toast.error(err.response.data));
            toast.success("Thêm thuốc thành công!");
            setTimeout(() => navigate("/IndexTVT"), 500);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setState({ ...state, hinh_anh: `/images/${file.name}` });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thêm thuốc vật tư</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className='row mb-3'>
                <img style={{ borderRadius: '10px', marginLeft: '10px' }} src={hinh_anh} width='150' height='180' className="img img-responsive" />
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="ten_thuoc" onChange={handleInputChange} value={ten_thuoc} className="form-control" placeholder="Tên thuốc" />
                    </div>
                    <div className="col">
                        <input type="text" name="gia" onChange={handleInputChange} value={gia} className="form-control" placeholder="Giá" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" name="so_luong" onChange={handleInputChange} value={so_luong} className="form-control" placeholder="Số lượng" />
                    </div>
                    <div className="col">
                        <input type="text" name="don_vi" onChange={handleInputChange} value={don_vi} className="form-control" placeholder="Đơn vị" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <select name="id_loai_thuoc" onChange={handleInputChange} value={id_loai_thuoc} className="form-control">
                            <option disabled value="">Chọn loại thuốc</option>
                            {loaiThuocOptions.map(lt => (
                                <option key={lt.id_loai_thuoc} value={lt.id_loai_thuoc}>{lt.ten_loai_thuoc}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <input type="file" name="hinh_anh" onChange={handleFileChange} className="form-control" placeholder="Hình ảnh thuốc" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <textarea style={{ minHeight: '120px' }} type="text" name="mo_ta" onChange={handleInputChange} value={mo_ta} className="form-control" placeholder="Mô tả" />
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
