import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
   id_benh_nhan: "",
   id_bac_si: "",
   ngay_kham: "",
   gio_kham: "",
   ghi_chu: "",
   ho_ten_bn: "",
   sdt_bn: "",
   dia_chi_bn: "",
   ngay_sinh: "",
   chuyen_khoa: "",
   trang_thai: "",
   tong_tien: "",
   gioi_tinh:"",
};

export default function CreateLichKham() {
    const [state, setState] = useState(initialState);
    const [khoaOptions, setKhoaOptions] = useState([]);
    const [bacSiOptions, setBacSiOptions] = useState([]);
    const { id_benh_nhan, id_bac_si, ngay_kham, gio_kham, ghi_chu, ho_ten_bn, sdt_bn, dia_chi_bn, ngay_sinh, chuyen_khoa,gioi_tinh } = state;
    console.log(state)
    
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy dữ liệu bệnh nhân từ localStorage nếu có
        const benhNhanLS = JSON.parse(localStorage.getItem("benhNhanDangKy"));
        if (benhNhanLS) {
            const date = new Date(benhNhanLS.ngay_sinh);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;

            setState((prev) => ({
                ...prev,
                id_benh_nhan: benhNhanLS.id_benh_nhan,
                ho_ten_bn: benhNhanLS.ho_ten,
                ngay_sinh: formattedDate,
                sdt_bn: benhNhanLS.so_dien_thoai,
                dia_chi_bn: benhNhanLS.dia_chi,
                gioi_tinh:benhNhanLS.gioi_tinh
            }));
        }
        // Load các danh sách chọn
        const fetchOptions = async () => {
            try {
                const khoaRes = await axios.get("http://localhost:5000/api/getalldmkhoa");
                setKhoaOptions(khoaRes.data);
            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu");
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
  if (chuyen_khoa) {
    axios
      .get(`http://localhost:5000/api/getdoctors/${chuyen_khoa}`)
      .then((resp) => setBacSiOptions(resp.data))
      .catch(() => toast.error("Không thể lấy danh sách bác sĩ"));
    } else {
        setBacSiOptions([]);
    }
    }, [chuyen_khoa]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!id_benh_nhan || !id_bac_si || !ngay_kham || !gio_kham || !ho_ten_bn || !sdt_bn || !dia_chi_bn || !ngay_sinh || !chuyen_khoa ) {
            toast.error("Vui lòng nhập đủ thông tin");
        } else {
            axios.post("http://localhost:5000/api/createlichkham", {
                id_benh_nhan,
                id_bac_si,
                ngay_kham,
                gio_kham,
                ghi_chu,
                ho_ten_bn,
                sdt_bn,
                dia_chi_bn,
                ngay_sinh,
                chuyen_khoa,
                trang_thai:1,
                ngay_dat_lich,
                tong_tien:0,
                trang_thai_thanh_toan:1,
                gioi_tinh
                
            })
            .then(() => {
                setState(initialState);
                toast.success("Thêm lịch khám thành công!");
                setTimeout(() => navigate("/IndexLichKham"), 500);
                localStorage.removeItem('benhNhanDangKy');
            })
            .catch((err) => toast.error(err.response.data));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

        const convertTimeFormat = (time) => {
        if (!time) {
            console.error("Time is undefined or null");
            return ""; // Hoặc giá trị mặc định nếu time không tồn tại
        }
        
        // Đảm bảo time là chuỗi trước khi gọi split
        const timeString = String(time);
        const [hours, minutes] = timeString.split(":");
        
        // Thêm xử lý logic nếu cần
        return `${hours}:${minutes}`;
    };

        // Tạo ngày hiện tại ở định dạng YYYY-MM-DD
    const today = new Date();
    const ngay_dat_lich = today.toISOString().split('T')[0];
    

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thêm lịch khám</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Họ tên bệnh nhân:</label>
                        <input type="text" name="ho_ten_bn" onChange={handleInputChange} value={ho_ten_bn} className="form-control" placeholder="Họ tên bệnh nhân" />
                    </div>
                    <div className="col">
                        <label className="form-label">Số điện thoại:</label>
                        <input type="text" name="sdt_bn" onChange={handleInputChange} value={sdt_bn} className="form-control" placeholder="Số điện thoại" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Ngày sinh:</label>
                        <input type="date" name="ngay_sinh" onChange={handleInputChange} value={ngay_sinh} className="form-control" placeholder="Ngày sinh" />
                    </div>
                    <div className="col">
                        <label className="form-label">Địa chỉ:</label>
                        <input type="text" name="dia_chi_bn" onChange={handleInputChange} value={dia_chi_bn} className="form-control" placeholder="Địa chỉ bệnh nhân" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Chuyên khoa:</label>
                        <select name="chuyen_khoa" onChange={handleInputChange} value={chuyen_khoa} className="form-control">
                            <option value="">Chọn khoa</option>
                            {khoaOptions.map(khoa => (
                                <option key={khoa.id_khoa} value={khoa.id_khoa}>{khoa.ten_khoa}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <label className="form-label">Bác sĩ:</label>
                        <select name="id_bac_si" onChange={handleInputChange} value={id_bac_si} className="form-control">
                            <option value="">Chọn bác sĩ</option>
                            {bacSiOptions.map(bacSi => (
                                <option key={bacSi.id_bac_si} value={bacSi.id_bac_si}>{bacSi.ho_ten}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                         <label className="form-label">Ngày khám:</label>
                        <input type="date" name="ngay_kham" onChange={handleInputChange} value={ngay_kham} className="form-control" placeholder="Ngày khám" />
                    </div>
                    <div className="col">
                        <label className="form-label">Giờ khám: {convertTimeFormat(gio_kham)}</label>
                        <select onChange={handleInputChange} value={gio_kham} name='gio_kham' className='form-control'>
                            <option value="">Chọn giờ khám</option>
                            <option value="8:00">8:00 - Sáng</option>
                            <option value="8:30">8:30</option>
                            <option value="9:00">9:00</option>
                            <option value="9:30">9:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="13:30">13:30 - Chiều</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Ghi chú:</label>
                        <textarea name="ghi_chu" onChange={handleInputChange} value={ghi_chu} className="form-control" placeholder="Ghi chú"></textarea>
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
