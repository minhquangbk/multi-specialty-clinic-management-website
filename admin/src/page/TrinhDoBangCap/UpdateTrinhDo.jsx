import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
  ten_bang_cap: ""
};

export default function EditTrinhDo() {
  const [state, setState] = useState(initialState);
  const { ten_bang_cap } = state;
  const { id_bang_cap } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/gettrinhdo/${id_bang_cap}`)
      .then((resp) => setState({ ...resp.data[0] }))
      .catch((err) => toast.error("Không tìm thấy dữ liệu"));
  }, [id_bang_cap]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!ten_bang_cap) {
      toast.error("Vui lòng nhập tên bằng cấp");
    } else {
      if (window.confirm("Bạn có muốn cập nhật thông tin trình độ này?")) {
        axios.put(`http://localhost:5000/api/updatetrinhdo/${id_bang_cap}`, {
          ten_bang_cap
        }).then(() => {
          setState(initialState);
          toast.success("Cập nhật trình độ thành công!");
          setTimeout(() => navigate("/Indextrinhdobs"), 500);
        }).catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div>
      <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Cập nhật thông tin Trình Độ</h3>
            </div>
      <hr />
      <form onSubmit={handleSubmit} method="POST">
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Tên Bằng Cấp</label>
            <input 
              type="text" 
              name="ten_bang_cap" 
              className="form-control" 
              placeholder="Tên Bằng Cấp" 
              onChange={handleInputChange} 
              value={ten_bang_cap || ""} 
            />
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
