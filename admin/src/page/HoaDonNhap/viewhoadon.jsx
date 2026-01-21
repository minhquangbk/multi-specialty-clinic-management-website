import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Viewhoadonnhap() {
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };

    const [chiTiet, setData] = useState([]);
    const [loading, setLoading] = useState(true);  // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi
    const { id_hoa_don } = useParams();

    useEffect(() => {
        // Thay thế gọi API với dữ liệu ảo
        setLoading(true);
        setError(null);

        const fakeData = [
            {
                ma_chi_tiet_don_hang: 1,
                anh_san_pham: 'https://www.pharmart.vn/images/product/origin/thuoc-paracetamol-500mg-thephaco-giam-dau-ha-sot-65efb19b37e20.jpg',
                ten_san_pham: 'Thuốc Paracetamol 500mg',
                don_vi: 'Viên',
                so_luong: 100,
                don_gia: 5000
            },
            {
                ma_chi_tiet_don_hang: 2,
                anh_san_pham: 'https://baoholaodonglasa.com/wp-content/uploads/2024/04/khau-trang-y-te-4-lop.jpg',
                ten_san_pham: 'Khẩu trang y tế',
                don_vi: 'Hộp',
                so_luong: 50,
                don_gia: 2000
            },
            {
                ma_chi_tiet_don_hang: 3,
                anh_san_pham: 'https://cdn.tgdd.vn/Products/Images/12119/299884/con-90-do-hd-50ml-thumb-1-600x600.jpg',
                ten_san_pham: 'Cồn y tế 70%',
                don_vi: 'Chai',
                so_luong: 20,
                don_gia: 10000
            },
            {
                ma_chi_tiet_don_hang: 4,
                anh_san_pham: 'https://cdn.tgdd.vn/Products/Images/8758/131207/gac-bao-thach-5x6x12-thumb-1-1-600x600.jpg',
                ten_san_pham: 'Băng gạc y tế',
                don_vi: 'Cuộn',
                so_luong: 150,
                don_gia: 3000
            },
            {
                ma_chi_tiet_don_hang: 5,
                anh_san_pham: 'https://lavela.com.vn/upload/images/san_pham/kabin/banh-xop/banh-que/che-chuoi/thit-bo/thu-vi/ca-chien/mam-sach/NRT/Sofree-01.jpg',
                ten_san_pham: 'Nước rửa tay',
                don_vi: 'Chai',
                so_luong: 30,
                don_gia: 25000
            },
        ];

        setData(fakeData);  // Thiết lập dữ liệu ảo
        setLoading(false);  // Dừng trạng thái loading
    }, [id_hoa_don]);


    return (
        <div>
            <div  style={{marginBottom:'20px'}} className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Chi tiết đơn hàng nhập</h3>
            </div>
            <div className="card shadow mb-4">
               
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th>Tên vật tư</th>
                                    <th>Đơn vị</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chiTiet.length > 0 ? (
                                    chiTiet.map((item) => (
                                        <tr key={item.ma_chi_tiet_don_hang}>
                                            <td>
                                                <img 
                                                    style={{ borderRadius: '5px' }} 
                                                    src={item.anh_san_pham || 'https://via.placeholder.com/60'} 
                                                    width="60" 
                                                    height="60" 
                                                    className="img img-responsive" 
                                                    alt="Hình ảnh sản phẩm"
                                                />
                                            </td>
                                            <td>{item.ten_san_pham}</td>
                                            <td>{item.don_vi}</td>
                                            <td>{item.so_luong}</td>
                                            <td>{formatCurrency(item.don_gia)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
