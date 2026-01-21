import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
    ten_bang_cap: ""
};

export default function CreateTrinhDo() {
    const [state, setState] = useState(initialState);
    const { ten_bang_cap } = state;

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!ten_bang_cap) {
            toast.error("Vui lòng nhập tên bằng cấp");
        } else {
            axios.post("http://localhost:5000/api/createtrinhdo", {
                ten_bang_cap
            }).then(() => {
                setState(initialState);
                toast.success("Thêm trình độ thành công!");
                setTimeout(() => navigate("/Indextrinhdobs"), 500);
            }).catch((err) => toast.error(err.response.data));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thêm Trình Độ</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col">
                        <input 
                            type="text" 
                            name="ten_bang_cap" 
                            onChange={handleInputChange} 
                            value={ten_bang_cap} 
                            className="form-control" 
                            placeholder="Tên Bằng Cấp" 
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="d-grid">
                        <button style={{ marginLeft: '10px' }} type="submit" className="btn btn-primary">Thêm</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
