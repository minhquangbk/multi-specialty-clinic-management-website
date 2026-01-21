import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast, Flip } from 'react-toastify';

export default function Indexadddichvu() {
    const [data, setData] = useState([]); // Dữ liệu các gói dịch vụ
    const [lichKham, setLichKham] = useState(null); // Dữ liệu chi tiết lịch khám
    const [selectedServices, setSelectedServices] = useState([]); // Lưu các dịch vụ đã chọn
    const { id_lich_kham } = useParams(); // Lấy id lịch khám từ URL

    const loadLichKham = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/getlk/${id_lich_kham}`);
            const lichKhamData = response.data[0];
            setLichKham(lichKhamData);
        } catch (error) {
            console.error("Error loading lich_kham data", error);
        }
    };

    const loadData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getallgdv");
            setData(response.data);
        } catch (error) {
            console.error("Error loading all services data", error);
        }
    };

    useEffect(() => {
        loadLichKham();
        loadData();
    }, [id_lich_kham]);

    useEffect(() => {
        if (lichKham) {
            console.log("Chuyen Khoa:", lichKham.chuyen_khoa);
        }
    }, [lichKham]);

    const filteredServices = data.filter(service => {
        if (!lichKham || !lichKham.chuyen_khoa) return false; 
        return service.id_khoa === lichKham.chuyen_khoa; 
    });

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };

    // Hàm xử lý khi chọn checkbox
    const handleCheckboxChange = (service) => {
        setSelectedServices(prevSelected => {
            if (prevSelected.includes(service)) {
                return prevSelected.filter(item => item !== service);
            } else {
                return [...prevSelected, service];
            }
        });
    };

    // Hàm gửi dữ liệu chi tiết lịch khám khi nhấn nút
    const addServices = async () => {
        for (const service of selectedServices) {
            const requestData = {
                id_lich_kham: id_lich_kham,
                id_dich_vu: service.id_dich_vu,
                ten_dich_vu: service.ten_dich_vu,
                gia: service.gia,
                hinh_anh_dv: service.hinh_anh_dv,
                so_luong: "1",
                id_khoa: lichKham.chuyen_khoa
            };
            try {
                await axios.post("http://localhost:5000/api/createctlk", requestData);
                toast.success(`${service.ten_dich_vu} đã được thêm thành công!`, { transition: Flip });
            } catch (error) {
                toast.error(`Lỗi khi thêm dịch vụ ${service.ten_dich_vu}: ${error.message}`, { transition: Flip });
            }
        }
        setSelectedServices([]); // Reset danh sách dịch vụ đã chọn
    };

    return (
        <div className="card shadow mb-4">
            <div className="d-flex align-items-center justify-content-between card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                    <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
                    <Link to={`/Indexadddichvukham/${id_lich_kham}`} className="link-effect text-decoration-none">Tất cả dịch vụ</Link> /
                    <Link to={`/Indexadddichvutheochuyenkhoa/${id_lich_kham}`} className="link-effect text-decoration-none">Dịch vụ theo chuyên khoa đã đặt</Link>
                </h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Tên dịch vụ</th>
                                <th>Giá</th>
                                <th>Chi tiết dịch vụ</th>
                                <th>Lựa chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((item, index) => (
                                <tr key={item.id_dich_vu}>
                                    <td>{index + 1}</td>
                                    <td><img style={{ borderRadius: '5px' }} src={item.hinh_anh_dv} width='60' height='60' className="img img-responsive" /></td>
                                    <td>{item.ten_dich_vu}</td>
                                    <td>{formatCurrency(item.gia)}</td>
                                    <td><Link to={`/Viewgdv/${item.id_dich_vu}`} type="button" className="btn btn-primary">Chi Tiết</Link></td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedServices.includes(item)}
                                            onChange={() => handleCheckboxChange(item)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <div className="d-grid">
                        <button
                            style={{ marginLeft: '10px', marginTop: '20px' }}
                            type="button"
                            className="btn btn-primary"
                            onClick={addServices}
                        >
                            Thêm dịch vụ khám sử dụng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
