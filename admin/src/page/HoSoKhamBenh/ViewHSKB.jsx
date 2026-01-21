import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ViewHoSoBenhAn() {
  const [hoSoBenhAn, setHoSoBenhAn] = useState({});
  const [hoTenBenhNhan, setHoTenBenhNhan] = useState('');
  const { id_ho_so } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/gethosobenhan/${id_ho_so}`)
      .then((resp) => {
        const data = resp.data[0];
        setHoSoBenhAn(data);

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

  const ngayLapDate = new Date(hoSoBenhAn.ngay_lap);
  const formattedNgayLap = ngayLapDate.toLocaleDateString('en-GB');

  return (
    <div>
      <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thông tin Hồ Sơ Bệnh Án</h3>
      </div>
      <hr />
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Mã Hồ Sơ</label>
          <input type="text" name="id_ho_so" className="form-control" placeholder="Mã Hồ Sơ" value={hoSoBenhAn.id_ho_so || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Tên Bệnh Nhân</label>
          <input type="text" name="ho_ten_benh_nhan" className="form-control" placeholder="Tên Bệnh Nhân" value={hoTenBenhNhan || ''} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Ngày Lập</label>
          <input type="text" name="ngay_lap" className="form-control" placeholder="Ngày Lập" value={formattedNgayLap || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Tiền sử bệnh lý</label>
          <input type="text" name="bac_si" className="form-control" placeholder="Tiền sử bệnh lý" value={hoSoBenhAn.tien_su_benh} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Chẩn Đoán</label>
          <input type="text" name="chan_doan" className="form-control" placeholder="Chẩn Đoán" value={hoSoBenhAn.chan_doan || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Ghi Chú</label>
          <input type="text" name="ghi_chu" className="form-control" placeholder="Ghi Chú" value={hoSoBenhAn.ghi_chu || ''} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Tình Trạng Bệnh Nhân</label>
          <input type="text" name="tinh_trang" className="form-control" placeholder="Tình Trạng Bệnh Nhân" value={hoSoBenhAn.trieu_chung || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Phương Pháp Điều Trị</label>
          <input type="text" name="phuong_phap" className="form-control" placeholder="Phương Pháp Điều Trị" value={hoSoBenhAn.phuong_phap_dieu_tri || ''} readOnly />
        </div>
      </div>
    </div>
  );
}
