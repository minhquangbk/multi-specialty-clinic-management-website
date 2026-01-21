import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Viewdm() {
  const[khoa ,setData] = useState({});

  const {id_khoa} = useParams();

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/getdmkhoa/${id_khoa}`)
    .then((resp) => setData({...resp.data[0]}));
  },[id_khoa]);

  return (
    <div>
      <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thông tin khoa</h3>
      </div>
      <hr />
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Mã khoa</label>
          <input
            type="text"
            name="id_khoa"
            className="form-control"
            placeholder="Mã khoa"
            value={id_khoa}
            readonly
          />
        </div>
        <div className="col mb-3">
          <label className="form-label">Tên khoa</label>
          <input
            type="text"
            name="ten_khoa"
            className="form-control"
            placeholder="Tên Khoa"
            value={khoa.ten_khoa}
            readonly
          />
        </div>
        <div className="col mb-3">
          <label className="form-label">Mô tả</label>
          <input
            type="text"
            name="mo_ta"
            className="form-control"
            placeholder="Mô tả"
            value={khoa.mo_ta}
            readonly
          />
        </div>
      </div>
    </div>
  );
}
