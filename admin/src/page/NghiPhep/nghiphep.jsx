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
    id_khoa:"",
    trang_thai_nghi:0,

};

export default function XinNghiBacSi() {
    const [state, setState] = useState(initialState);
    const [idUser, setidUser] = useState(initialState);
    const [khoaOptions, setKhoaOptions] = useState([]);
    const { ho_ten, loai_nghi, lydo_nghi, batdau_nghi, ketthuc_nghi, id_khoa } = state;
    const navigate = useNavigate();
    const { user } = useUser();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const idUserRes = await axios.get(`http://localhost:5000/api/getinfobyiduser/${user.id}`);
                const idUser = idUserRes.data?.id_user;
                setidUser(idUser)

                if (!idUser) {
                    toast.error("Không tìm thấy ID người dùng thực tế");
                    return;
                }

                const bacSiRes = await axios.get(`http://localhost:5000/api/getbacsi/${idUser}`);
                setState({ ...bacSiRes.data[0] });

                const khoaResponse = await axios.get("http://localhost:5000/api/getalldmkhoa");
                setKhoaOptions(khoaResponse.data);
            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu");
                console.error(error);
            }
        };

        if (user?.id) {
            fetchData();
        }
    }, [user.id]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    // Tạo ngày hiện tại ở định dạng YYYY-MM-DD
    const today = new Date();
    const ngay_gui = today.toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loai_nghi || !lydo_nghi || !batdau_nghi || !ketthuc_nghi) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/createbacsioff", {
                id_bac_si:idUser,
                loai_nghi,
                lydo_nghi,
                batdau_nghi,
                ketthuc_nghi,
                ngay_gui,
                trang_thai_nghi:0
            });
            toast.success("Đã gửi đơn xin nghỉ!");
            navigate("/IndexNghiPhepBacSi");
        } catch (err) {
            toast.error("Lỗi gửi đơn xin nghỉ");
        }
    };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Đơn xin nghỉ phép bác sĩ</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className=" row mb-3">
                    <div className="col">
                         <label className="form-label">Họ tên</label>
                         <input type="text" name="ho_ten" className="form-control" value={ho_ten || ""} disabled />
                    </div>

                    <div className="col">
                        <label className="form-label">Chuyên Khoa</label>
                        <select name="id_khoa" onChange={handleInputChange} value={id_khoa || "" } className="form-control">
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
                        <input type="date" name="batdau_nghi" className="form-control" value={state.batdau_nghi} onChange={handleInputChange} />
                    </div>
                    <div className="col">
                        <label className="form-label">Ngày kết thúc nghỉ</label>
                        <input type="date" name="ketthuc_nghi" className="form-control" value={state.ketthuc_nghi} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Loại nghỉ</label>
                    <select name="loai_nghi" className="form-control" value={state.loai_nghi} onChange={handleInputChange}>
                        <option value="">-- Chọn loại nghỉ --</option>
                        <option value="Nghỉ phép năm">Nghỉ phép năm</option>
                        <option value="Nghỉ bệnh">Nghỉ bệnh</option>
                        <option value="Nghỉ không lương">Nghỉ không lương</option>
                        <option value="Việc cá nhân">Việc cá nhân</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Lý do nghỉ</label>
                    <textarea name="lydo_nghi" className="form-control" placeholder="Nhập lý do nghỉ..." value={state.lydo_nghi} onChange={handleInputChange}></textarea>
                </div>

                <div className="d-grid">
                    <button className="btn btn-primary">Gửi đơn xin nghỉ</button>
                </div>
            </form>
        </div>
    );
}
