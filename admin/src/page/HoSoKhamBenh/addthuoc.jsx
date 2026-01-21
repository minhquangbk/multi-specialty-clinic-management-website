import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast, Flip } from 'react-toastify';

export default function Indexaddthuoc() {
    const [data, setData] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [selectedServices, setSelectedServices] = useState([]);
    const [loaiThuocOptions, setloaiThuocOptions] = useState([]);
    const { id_lich_kham } = useParams();
    console.log(selectedServices)

    const loadData = async () => {
        const response = await axios.get("http://localhost:5000/api/getallTVT");
        setData(response.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loaiThuocResponse = await axios.get("http://localhost:5000/api/getallLoaiTVT");
                setloaiThuocOptions(loaiThuocResponse.data);

            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu");
            }
        };
        fetchData();
    }, []);

    const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({
        ...prev,
        [id]: Math.max(1, Number(value))
    }));
    };

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm) {
            loadData();
        } else {
            try {
                const response = await axios.get(`http://localhost:5000/api/searchTVT/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Error searching data", error);
            }
        }
    };

    const handleLoaiThuocSearch = async (e) => {
            const selectedValue = e.target.value;
            console.log(selectedValue)
            if (!selectedValue) {
              loadData(); // Tải lại toàn bộ nếu không chọn gì
            } else {
              try {
                const response = await axios.get(`http://localhost:5000/api/getTVTidbyloaithuoc/${selectedValue}`);
                setData(response.data);
              } catch (error) {
                console.error("Lỗi khi tìm kiếm theo loại thuốc:", error);
              }
            }
     };

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

    // Tạo ngày hiện tại ở định dạng YYYY-MM-DD
    const today = new Date();
    const ngay_ban = today.toISOString().split('T')[0];

    // Hàm gửi dữ liệu chi tiết lịch khám khi nhấn nút
    const addServices = async () => {
        for (const service of selectedServices) {
            const requestData = {
                id_lich_kham: id_lich_kham,
                id_thuoc_vat_tu: service.id_thuoc_vat_tu,
                ten_thuoc: service.ten_thuoc,
                gia: service.gia,
                hinh_anh_thuoc: service.hinh_anh,
                so_luong:quantities[service.id_thuoc_vat_tu] || 1,
                ngay_ban ,
            };
            console.log(requestData)
            try {
            await axios.post("http://localhost:5000/api/createctbillthuoc", requestData);
            toast.success(`Thuốc ${service.ten_thuoc} đã được thêm thành công!`, { transition: Flip });
            } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            toast.error(`Lỗi khi thêm ${service.ten_thuoc}: ${errorMsg}`, { transition: Flip });
            }
        }
        setSelectedServices([]); // Reset danh sách dịch vụ đã chọn
    };

    return (
        <div className="card shadow mb-4">
            <div className="d-flex align-items-center justify-content-between card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}> Danh sách thuốc</i>
                </h6>
            </div>
            <div className="card-body">
                <div className="card-header">
             <form className="w-100">
                <div className="d-flex align-items-center flex-wrap">

                {/* Tìm theo tên  */}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                    <label className="mb-0 mr-2">Tìm kiếm:</label>
                    <input
                    type="text"
                    onChange={handleSearch}
                    className="form-control form-control-sm"
                    placeholder="Nhập tên thuốc"
                    />
                </div>

                {/* Tìm theo trạng thái */}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                <label className="mb-0 mr-2">Tìm kiếm theo loại thuốc:</label>
                <select
                    className="form-control form-control-sm"
                    onChange={handleLoaiThuocSearch}
                    defaultValue=""
                >
                <option disabled value="">Chọn loại thuốc</option>
                <option value="">Hiển thị tất cả</option>
                            {loaiThuocOptions.map(lt => (
                            <option key={lt.id_loai_thuoc} value={lt.id_loai_thuoc}>{lt.ten_loai_thuoc}</option>
                ))}
                </select>
                </div>
                </div>
            </form>
            </div>
                <div className="table-responsive">
                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Tên thuốc</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Chi tiết dịch vụ</th>
                                <th>Lựa chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item.id_thuoc_vat_tu}>
                                    <td>{index + 1}</td>
                                    <td><img style={{ borderRadius: '5px' }} src={item.hinh_anh} width='60' height='60' className="img img-responsive" /></td>
                                    <td>{item.ten_thuoc}</td>
                                    <td>{formatCurrency(item.gia)}</td>
                                    <td>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantities[item.id_thuoc_vat_tu] || 1}
                                        onChange={(e) => handleQuantityChange(item.id_thuoc_vat_tu, e.target.value)}
                                        style={{ width: "60px", textAlign: "center" }}
                                    />
                                    </td>
                                    <td><Link to={`/Viewgdv/${item.id_thuoc_vat_tu}`} type="button" className="btn btn-primary">Chi Tiết</Link></td>
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
                            Thêm thuốc điều trị
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
