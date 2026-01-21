import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast, Flip } from 'react-toastify';

export default function Viewlichkhambenh() {
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };  
    
    const [chiTiet, setData] = useState([]);
    const { id_lich_kham } = useParams();

    useEffect(() => {
        // Thay đổi cách lấy dữ liệu thành một mảng
        axios.get(`http://localhost:5000/api/getctlk/${id_lich_kham}`)
            .then((resp) => setData(resp.data))
            .catch((error) => console.error(error));

    }, [id_lich_kham]);

    const tinhTongTien = () => {
        if (chiTiet.length === 0) return 0; // Nếu không có dữ liệu, trả về 0

        return chiTiet.reduce((tong, item) => {
            const gia = parseFloat(item.gia || 0); // Chuyển giá trị "gia" thành số
            const soLuong = parseInt(item.so_luong || 0, 10); // Chuyển giá trị "so_luong" thành số nguyên
            return tong + gia * soLuong; // Tính tiền từng mục và cộng vào tổng
        }, 0);
    };

    try {
        // Gửi yêu cầu cập nhật bằng JSON
        const tong_tien = tinhTongTien()
        console.log(tong_tien)
        axios.put(`http://localhost:5000/api/updatepricelk/${id_lich_kham}`, {
            tong_tien: tong_tien,
        });
      } catch (err) {
        toast.error(err.response?.data || "Lỗi xảy ra trong quá trình cập nhật");
        
    }

    const deleteDichVu = (id_hoa_don) => {
        if (window.confirm("Bạn có muốn xóa dịch vụ này không ?")) {
            axios.delete(`http://localhost:5000/api/deletedetailbill/${id_hoa_don}`)
                .then(() => {
                    toast.success('Xóa dịch vụ thành công!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Flip,
                    });
                    // Cập nhật lại dữ liệu sau khi xóa
                    setData((prevData) => prevData.filter(item => item.id_hoa_don !== id_hoa_don));
                })
                .catch((error) => console.error("Xóa dịch vụ thất bại!", error));
        }
    }

    return (
        <div>
            <div className="card shadow mb-4">
                <div className="d-flex align-items-center justify-content-between card-header py-3">
                <div className="d-flex align-items-center">
                <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
              
                <h6 className="m-0 font-weight-bold text-primary">Chi tiết lịch khám và dịch vụ sử dụng</h6>
                </div>
                    <Link to={`/Indexadddichvukham/${id_lich_kham}`} className="btn btn-primary">Thêm dịch vụ khám</Link>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        {chiTiet.length > 0 ? (
                            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>Hình ảnh</th>
                                        <th>Tên dịch vụ</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                        <th>Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chiTiet.map((item) => (
                                        <tr key={item.id_hoa_don}>
                                            <td>
                                                <img 
                                                    style={{ borderRadius: '5px' }} 
                                                    src={item.hinh_anh_dv} 
                                                    width="60" 
                                                    height="60" 
                                                    className="img img-responsive" 
                                                    alt="Dịch vụ"
                                                />
                                            </td>
                                            <td>{item.ten_dich_vu}</td>
                                            <td>{item.so_luong}</td>
                                            <td>{formatCurrency(item.gia)}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-danger" 
                                                    onClick={() => deleteDichVu(item.id_hoa_don)} 
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-muted">Khách hàng chưa sử dụng dịch vụ khám nào.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
