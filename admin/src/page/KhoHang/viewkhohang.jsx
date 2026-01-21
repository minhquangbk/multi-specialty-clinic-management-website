import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Viewkhohang() {
  const [khohang, setData] = useState({});
  const { id_kho } = useParams(); // Sử dụng id_kho thay vì ma_kho_hang

  useEffect(() => {
    axios.get(`http://localhost:5000/api/getkhohang/${id_kho}`)
      .then((res) => setData({ ...res.data[0] }));
  }, [id_kho]);

  const date = new Date(khohang.ngay_nhap);
  const formattedDate = date.toLocaleDateString('en-GB');

  return (
    <div>
      <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thông tin kho hàng</h3>
      </div>
      <hr />
      <div className='row'>
        <img
          style={{ borderRadius: '10px', marginLeft: '10px' }}
          src={khohang.hinh_anh_vt} // Đường dẫn hình ảnh thuốc/vật tư
          width='150'
          height='180'
          alt="Ảnh thuốc/vật tư"
          className="img img-responsive"
        />
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Mã thuốc/vật tư</label>
          <input
            type="text"
            name="id_thuoc_vat_tu"
            className="form-control"
            placeholder="Mã thuốc/vật tư"
            value={khohang.id_thuoc_vat_tu || ''}
            readOnly
          />
        </div>
        <div className="col mb-3">
          <label className="form-label">Tên thuốc/vật tư</label>
          <input
            type="text"
            name="ten_thuoc_vat_tu"
            className="form-control"
            placeholder="Tên thuốc/vật tư"
            value={khohang.ten_thuoc_vat_tu || ''}
            readOnly
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Số lượng</label>
          <input
            type="text"
            name="so_luong"
            className="form-control"
            placeholder="Số lượng"
            value={khohang.so_luong || ''}
            readOnly
          />
        </div>
        <div className="col mb-3">
          <label className="form-label">Ngày nhập kho</label>
          <input
            type="text"
            name="ngay_nhap"
            className="form-control"
            placeholder="Ngày nhập kho"
            value={formattedDate || ''}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
