import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
    id_benh_nhan: "",
    chan_doan: "",
    phuong_phap_dieu_tri: "",
    ghi_chu: "",
    ngay_lap: "",
    tien_su_benh: "",
    trieu_chung: ""
};

export default function EditHoSoBenhAn() {
    const [state, setState] = useState(initialState);
    const { id_benh_nhan, chan_doan, phuong_phap_dieu_tri, ghi_chu, ngay_lap, tien_su_benh, trieu_chung } = state;
    const [hoTenBenhNhan, setHoTenBenhNhan] = useState('');
    const { id_ho_so } = useParams();
    const navigate = useNavigate();

    // useEffect(() => {
    //     axios.get(`http://localhost:5000/api/gethosobenhan/${id_ho_so}`)
    //         .then((resp) => setState({ ...resp.data[0] }));
    // }, [id_ho_so]);

    useEffect(() => {
    axios.get(`http://localhost:5000/api/gethosobenhan/${id_ho_so}`)
      .then((resp) => {
        const data = resp.data[0];
        setState(data);

        if (data && data.id_benh_nhan) {
          axios.get(`http://localhost:5000/api/getbenhnhan/${data.id_benh_nhan}`)
            .then((benhNhanResp) => {
              if (Array.isArray(benhNhanResp.data) && benhNhanResp.data.length > 0) {
                setHoTenBenhNhan(benhNhanResp.data[0].ho_ten);
              } else {
                console.error('Không có bệnh nhân với id này hoặc dữ liệu không đúng');
              }
            })
            .catch((error) => console.error("Error fetching patient name:", error));
        }
      })
      .catch((error) => console.error("Error fetching medical record:", error));
    }, [id_ho_so]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!id_benh_nhan || !chan_doan || !phuong_phap_dieu_tri || !ngay_lap || !trieu_chung) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
        } else {
            if (window.confirm("Bạn có muốn cập nhật hồ sơ bệnh án?")) {
                axios.put(`http://localhost:5000/api/updatehosobenhan/${id_ho_so}`, {
                    id_benh_nhan, chan_doan, phuong_phap_dieu_tri, ghi_chu, ngay_lap, tien_su_benh, trieu_chung
                }).then(() => {
                    setState(initialState);
                    toast.success("Cập nhật hồ sơ bệnh án thành công!");
                    setTimeout(() => navigate("/IndexHoSoBenhAn"), 500);
                }).catch((err) => toast.error(err.response.data));
            }
        }
    };

    const date = new Date(ngay_lap);

    const formattedDate = date.toLocaleDateString('en-GB');

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Cập nhật Hồ Sơ Bệnh Án</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit} method="POST">
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Tên Bệnh Nhân</label>
                        <input type="text" name="" className="form-control" placeholder="Tên Bệnh Nhân" onChange={handleInputChange} value={hoTenBenhNhan || ""} disabled />
                    </div>
                    <div className="col">
                        <label className="form-label">Ngày Lập hồ sơ : {formattedDate}</label>
                        <input type="date" name="ngay_lap" className="form-control" onChange={handleInputChange} value={ngay_lap || ""} />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Chẩn Đoán</label>
                        <input type="text" name="chan_doan" className="form-control" placeholder="Chẩn Đoán" onChange={handleInputChange} value={chan_doan || ""} />
                    </div>
                    <div className="col">
                        <label className="form-label">Phương Pháp Điều Trị</label>
                        <input type="text" name="phuong_phap_dieu_tri" className="form-control" placeholder="Phương Pháp Điều Trị" onChange={handleInputChange} value={phuong_phap_dieu_tri || ""} />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Ghi Chú</label>
                        <textarea name="ghi_chu" className="form-control" placeholder="Ghi Chú" onChange={handleInputChange} value={ghi_chu || ""}></textarea>
                    </div>
                    <div className="col">
                        <label className="form-label">Tiền Sử Bệnh</label>
                        <textarea name="tien_su_benh" className="form-control" placeholder="Tiền Sử Bệnh" onChange={handleInputChange} value={tien_su_benh || ""}></textarea>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Triệu Chứng</label>
                        <textarea name="trieu_chung" className="form-control" placeholder="Triệu Chứng" onChange={handleInputChange} value={trieu_chung || ""}></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="d-grid">
                        <button className="btn btn-warning" style={{ marginLeft: '10px', marginTop: '15px' }}>Cập nhật</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
