import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    muc_luong:""
};

export default function EditBacSi() {
    const [state, setState] = useState(initialState);
    const [khoaOptions, setKhoaOptions] = useState([]);
    const [bangCapOptions, setBangCapOptions] = useState([]);
    const [file, setFile] = useState(null); // Trạng thái lưu trữ file hình ảnh
    const { ho_ten, id_khoa, so_dien_thoai, email, dia_chi, id_bang_cap, ngay_vao_lam, hinh_anh_bs, chuc_danh, mo_ta, gioi_tinh, ngay_sinh, cmnd, muc_luong } = state;
    const { id_bac_si } = useParams();
    const navigate = useNavigate();
    console.log(state)

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getbacsi/${id_bac_si}`)
            .then((resp) => setState({ ...resp.data[0] }));
        
        const fetchOptions = async () => {
            try {
                const khoaResponse = await axios.get("http://localhost:5000/api/getalldmkhoa");
                setKhoaOptions(khoaResponse.data);

                const bangCapResponse = await axios.get("http://localhost:5000/api/getalltrinhdo");
                setBangCapOptions(bangCapResponse.data);
            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu");
            }
        };
        fetchOptions();
    }, [id_bac_si]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setState({ ...state, hinh_anh_bs: `/images/${file.name}` });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Kiểm tra các trường bắt buộc
        if (!ho_ten || !id_khoa || !so_dien_thoai || !email || !dia_chi || !id_bang_cap || !hinh_anh_bs || !chuc_danh || !mo_ta || !gioi_tinh || !cmnd) {
          toast.error("Vui lòng nhập đủ thông tin");
        } else {
          if (window.confirm("Bạn có muốn cập nhật thông tin?")) {
            // Tạo dữ liệu JSON để gửi đi
            const data = {
              ho_ten,
              id_khoa,
              so_dien_thoai,
              email,
              dia_chi,
              id_bang_cap,
              hinh_anh_bs,
              chuc_danh,
              mo_ta,
              gioi_tinh,
              cmnd, 
              muc_luong
            };
            
            try {
              // Gửi yêu cầu cập nhật bằng JSON
              await axios.put(`http://localhost:5000/api/updatebacsi/${id_bac_si}`, data);
              toast.success("Cập nhật thông tin bác sĩ thành công!");
              setTimeout(() => navigate("/IndexBacSi"), 500);
            } catch (err) {
              toast.error(err.response?.data || "Lỗi xảy ra trong quá trình cập nhật");
            }
          }
        }
      };
      
      
    const formatDate = (dateString) => {
        const date = new Date(dateString);
    
        const day = date.getDate();
        const month = date.getMonth() + 1; // Tháng từ 0 đến 11
        const year = date.getFullYear();
    
        const monthNames = [
          "tháng 1", "tháng 2", "tháng 3", "tháng 4", 
          "tháng 5", "tháng 6", "tháng 7", "tháng 8", 
          "tháng 9", "tháng 10", "tháng 11", "tháng 12"
        ];
    
        return `${day} ${monthNames[month - 1]} năm ${year}`;
      };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Cập nhật bác sĩ</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Họ tên</label>
                        <input type="text" name="ho_ten" onChange={handleInputChange} value={ho_ten || ""} className="form-control" placeholder="Họ tên" />
                    </div>
                    <div className="col">
                        <label className="form-label">Giới tính</label>
                        <select name="gioi_tinh" onChange={handleInputChange} value={gioi_tinh || ""} className="form-control">
                            <option value="">Chọn giới tính</option>
                            <option value="1">Nam</option>
                            <option value="2">Nữ</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Ngày sinh</label>
                        <input type="text" name="ngay_sinh"  value={formatDate(ngay_sinh) || ""} className="form-control" />
                    </div>
                    <div className="col">
                        <label className="form-label">Địa chỉ</label>
                        <input type="text" name="dia_chi" onChange={handleInputChange} value={dia_chi || ""} className="form-control" placeholder="Địa chỉ" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Số điện thoại</label>
                        <input type="text" name="so_dien_thoai" onChange={handleInputChange} value={so_dien_thoai || ""} className="form-control" placeholder="Số điện thoại" />
                    </div>
                    <div className="col">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" onChange={handleInputChange} value={email || ""} className="form-control" placeholder="Email" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">ID Khoa</label>
                        <select name="id_khoa" onChange={handleInputChange} value={id_khoa || ""} className="form-control">
                            <option value="">Chọn khoa</option>
                        
                            {khoaOptions.map(khoa => (
                                <option key={khoa.id_khoa} value={khoa.id_khoa}>{khoa.ten_khoa}</option>
                            ))}
                            
                        </select>
                    </div>
                
                    <div className="col">
                        <label className="form-label">ID Bằng cấp</label>
                        <select name="id_bang_cap" onChange={handleInputChange} value={id_bang_cap || ""} className="form-control">
                            <option value="">Chọn bằng cấp</option>
                            {bangCapOptions.map(bangCap => (
                                <option key={bangCap.id_bang_cap} value={bangCap.id_bang_cap}>{bangCap.ten_bang_cap}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Ngày vào làm</label>
                        <input type="text" name="ngay_vao_lam" value={formatDate(ngay_vao_lam) || ""} className="form-control" />
                    </div>
                    <div className="col">
                        <label className="form-label">Chức danh</label>
                        <input type="text" name="chuc_danh" onChange={handleInputChange} value={chuc_danh || ""} className="form-control" placeholder="Chức danh" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Mức lương</label>
                        <input name="muc_luong" onChange={handleInputChange} value={muc_luong || ""} className="form-control" placeholder="Mức lương" />
                    </div>                    <div className="col">
                        <label className="form-label">CMND</label>
                        <input name="cmnd" onChange={handleInputChange} value={cmnd || ""} className="form-control" placeholder="Chứng minh nhân dân" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Mô tả</label>
                        <textarea name="mo_ta" onChange={handleInputChange} value={mo_ta || ""} className="form-control" placeholder="Mô tả" />
                    </div>
   
                </div>
                <div className='row mb-3'>
                    <img style={{ borderRadius: '10px', marginLeft: '10px' }} src={hinh_anh_bs} width='150' height='180' className="img img-responsive" />
                    <div className="col">
                        <label className="form-label">Hình ảnh bác sĩ</label>
                        <input type="file" name="hinh_anh_bs" onChange={handleFileChange} className="form-control" />
                    </div>

                </div>
                <div className="row">
                    <div className="d-grid">
                        <button style={{ marginLeft: '10px' }} className="btn btn-warning">Cập nhật</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
