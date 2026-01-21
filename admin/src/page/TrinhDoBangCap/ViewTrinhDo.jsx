import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ViewTrinhDo() {
  const [trinhDo, setData] = useState({});
  const { id_bang_cap } = useParams();
  console.log(id_bang_cap)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/gettrinhdo/${id_bang_cap}`)
      .then((resp) => setData({ ...resp.data[0] }))
      .catch((err) => console.error("Không thể tải dữ liệu:", err));
  }, [id_bang_cap]);

  return (
    <div>
      <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thông tin Trình Độ</h3>
      </div>
      <hr />
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Tên Bằng Cấp</label>
          <input 
            type="text" 
            name="ten_bang_cap" 
            className="form-control" 
            placeholder="Tên Bằng Cấp" 
            value={trinhDo.ten_bang_cap || ''} 
            readOnly 
          />
        </div>
      </div>
    </div>
  );
}
