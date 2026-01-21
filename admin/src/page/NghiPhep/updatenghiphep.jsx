import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../until/userContext';

const initialState = {
    ho_ten: "",
    loai_nghi: "",
    lydo_nghi: "",
    batdau_nghi: "",
    ketthuc_nghi: "",
    id_khoa: "",
    trang_thai_nghi: "",
    id_bac_si: "",
};

export default function UpdateNghiBacSi() {
    const [state, setState] = useState(initialState);
    const [khoaOptions, setKhoaOptions] = useState([]);
    const { ho_ten, loai_nghi, lydo_nghi, batdau_nghi, ketthuc_nghi, id_khoa,trang_thai_nghi,id_bac_si } = state;
    const navigate = useNavigate();
    const { user } = useUser();
    const { id_nghi_phep } = useParams();

    useEffect(() => {

    const fetchData = async () => {
        try {
            // Lấy đơn nghỉ phép
            const res1 = await axios.get(`http://localhost:5000/api/getbacsioffidnghiphep/${id_nghi_phep}`);
            const donNghi = res1.data[0];

            if (!donNghi) {
                toast.error("Không tìm thấy đơn nghỉ phép!");
                return;
            }

            // Định dạng ngày đúng chuẩn yyyy-MM-dd
            const formatDate = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return date.toISOString().split("T")[0];
            };

            // Lấy thông tin bác sĩ tương ứng
            const res2 = await axios.get(`http://localhost:5000/api/getbacsi/${donNghi.id_bac_si}`);
            const bacSi = res2.data[0];

            setState({
                ...donNghi,
                batdau_nghi: formatDate(donNghi.batdau_nghi),
                ketthuc_nghi: formatDate(donNghi.ketthuc_nghi),
                ho_ten: bacSi?.ho_ten || "",
                id_khoa: bacSi?.id_khoa || ""
            });
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi lấy dữ liệu cập nhật");
        }
    };

        const fetchKhoaOptions = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/getalldmkhoa");
                setKhoaOptions(res.data);
            } catch {
                toast.error("Lỗi khi lấy danh sách khoa");
            }
        };

        fetchData();
        fetchKhoaOptions();
    }, [id_nghi_phep]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loai_nghi || !lydo_nghi || !batdau_nghi || !ketthuc_nghi) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/updatebacsioff/${id_nghi_phep}`, {
                trang_thai_nghi, id_bac_si
            });

            toast.success("Đã cập nhật đơn nghỉ!");
            navigate("/IndexNghiPhep");
        } catch {
            toast.error("Cập nhật thất bại");
        }
    };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h1 className="mb-0">Cập nhật đơn xin nghỉ phép</h1>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Họ tên</label>
                        <input type="text" name="ho_ten" className="form-control" value={ho_ten || ""} disabled />
                    </div>

                    <div className="col">
                        <label className="form-label">Chuyên Khoa</label>
                        <select name="id_khoa" onChange={handleInputChange} value={id_khoa || ""} className="form-control" disabled>
                            <option value="">Chọn khoa</option>
                            {khoaOptions.map(khoa => (
                                <option key={khoa.id_khoa} value={khoa.id_khoa}>{khoa.ten_khoa}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Ngày bắt đầu nghỉ</label>
                        <input type="date" name="batdau_nghi" className="form-control" value={batdau_nghi || ""} onChange={handleInputChange} />
                    </div>
                    <div className="col">
                        <label className="form-label">Ngày kết thúc nghỉ</label>
                        <input type="date" name="ketthuc_nghi" className="form-control" value={ketthuc_nghi || ""} onChange={handleInputChange} />
                    </div>
                </div>

                <div className=" row mb-3">
                    <div className="col">
                    <label className="form-label">Loại nghỉ</label>
                    <select name="loai_nghi" className="form-control" value={loai_nghi || ""} onChange={handleInputChange}>
                        <option value="">-- Chọn loại nghỉ --</option>
                        <option value="Nghỉ phép năm">Nghỉ phép năm</option>
                        <option value="Nghỉ bệnh">Nghỉ bệnh</option>
                        <option value="Nghỉ không lương">Nghỉ không lương</option>
                        <option value="Việc cá nhân">Việc cá nhân</option>
                    </select>
                    </div>
                         <div className="col mb-3">
                        <label className="form-label">Trạng thái </label>
                        <select name="trang_thai_nghi" className="form-control" onChange={handleInputChange} value={trang_thai_nghi || ""}>
                            <option value="0">Chưa Duyệt</option>
                            <option value="1">Đã Duyệt</option>
                        </select>
                    </div>
 

                </div>

                <div className="mb-3">
                    <label className="form-label">Lý do nghỉ</label>
                    <textarea name="lydo_nghi" className="form-control" placeholder="Nhập lý do nghỉ..." value={lydo_nghi || ""} onChange={handleInputChange}></textarea>
                </div>

                <div className="d-grid">
                    <button className="btn btn-success">Cập nhật đơn nghỉ</button>
                </div>
            </form>
        </div>
    );
}
