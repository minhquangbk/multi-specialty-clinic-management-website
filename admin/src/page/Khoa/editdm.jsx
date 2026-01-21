import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const initiaState = {
  ten_khoa :"",
  mo_ta:"",
};

export default function Editdm() {

const [state, setState] = useState(initiaState);

const{ ten_khoa , mo_ta} = state;

const {id_khoa} = useParams();

const  navigate = useNavigate();

useEffect(()=>{
  axios.get(`http://localhost:5000/api/getdmkhoa/${id_khoa}`)
  .then((resp) => setState({...resp.data[0]}));
},[id_khoa]);

const handleInputChange = (e) =>{
  const{name, value} = e.target;
  setState({...state,[name]:value});
}

const handleSubmit = (e) => {
  e.preventDefault();

  if(!ten_khoa){
    toast.error("Vui lòng nhập đầy đủ thông tin");

  } else{
    if(window.confirm("Bạn có muốn cập nhật thông tin  ?")){
      axios.put(`http://localhost:5000/api/updatedmkhoa/${id_khoa}`,{
        ten_khoa , mo_ta
      }).then(()=>{
        setState({ten_danh_muc :"", mo_ta:""})
      }).catch((err) => toast.error(err.response.data));
      toast.success("Sửa khoa thành công !")
      setTimeout(() => navigate("/Indexdm"),500);
    }
  }
}
  return (
    <div>
          <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Sửa khoa</h3>
            </div>
              <hr />
              <form onSubmit={handleSubmit} enctype="multipart/form-data">
                  <div className="row mb-3">
                      <div className="col">
                          <input type="text" name="ten_khoa" id ="ten_khoa" onChange={handleInputChange} value={ten_khoa || ""} className="form-control" placeholder="Nhập tên khoa..."/>
                      </div>
                  </div>
                  <div className="row mb-3">
                      <div className="col">
                          <input type="text" name="mo_ta" id ="mo_ta" onChange={handleInputChange} value={mo_ta || ""} className="form-control" placeholder="Nhập mô tả..."/>
                      </div>
                  </div>

                  <div className="row">
                      <div className="d-grid">
                          <button style={{marginLeft: '10px'}} type="submit" className="btn btn-warning">Cập nhật</button>
                      </div>
                  </div>
                  
              </form>
      
          </div>
    </div>
  )
}
