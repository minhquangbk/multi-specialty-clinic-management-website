import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ViewPhongKham() {
  const [phongkham, setPhongKham] = useState({});
  const [chuyenkhoa, setChuyenKhoa] = useState({});
  const { id_phong_kham } = useParams();

  useEffect(() => {
    // Fetch data for the medical room by ID
    axios.get(`http://localhost:5000/api/getphongkham/${id_phong_kham}`)
      .then((res) => {
        setPhongKham(res.data[0]);
      });
  }, [id_phong_kham]);

  useEffect(() => {
    // Fetch department data if `id_khoa` is available in the medical room
    if (phongkham.id_khoa) {
      axios.get(`http://localhost:5000/api/getdmkhoa/${phongkham.id_khoa}`)
        .then((resp) => {
          setChuyenKhoa(resp.data[0]);
        });
    }
  }, [phongkham.id_khoa]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
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
      <h3 className="mb-0">Thông tin phòng khám</h3>
      <hr />
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Tên phòng khám</label>
          <input type="text" name="ten_phong_kham" className="form-control" placeholder="Tên phòng khám" value={phongkham.ten_phong_kham || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Số phòng</label>
          <input type="text" name="so_phong" className="form-control" placeholder="Số phòng" value={phongkham.so_phong || ''} readOnly />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Số điện thoại</label>
          <input type="text" name="so_dien_thoai" className="form-control" placeholder="Số điện thoại" value={phongkham.so_dien_thoai || ''} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Chuyên khoa</label>
          <input type="text" name="chuyen_khoa" className="form-control" placeholder="Chuyên khoa" value={chuyenkhoa.ten_khoa || ''} readOnly />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Mô tả</label>
          <textarea name="mo_ta" className="form-control" placeholder="Mô tả" value={phongkham.mo_ta || ''} readOnly />
        </div>
      </div>
    </div>
  );
}
