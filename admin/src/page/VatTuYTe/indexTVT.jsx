import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, Flip } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function IndexThuocVatTu() {
    const [data, setData] = useState([]);
    const [loaiThuocOptions, setloaiThuocOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

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


    const exportToExcel = () => {
        const formattedData = data.map((item, index) => ({
            "STT": index + 1,
            "Tên thuốc/vật tư": item.ten_thuoc,
            "Loại thuốc": loaiThuocOptions.find(loai => loai.id_loai_thuoc === item.id_loai_thuoc)?.ten_loai_thuoc || "Không rõ",
            "Số lượng": item.so_luong,
            "Đơn vị": item.don_vi,
            "Giá": item.gia?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0đ",
            "Ngày thêm": new Date(item.ngay_them).toLocaleDateString("vi-VN"),
            "Mô tả": item.mo_ta || ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        worksheet["!cols"] = [
            { wch: 5 },   // STT
            { wch: 25 },  // Tên thuốc/vật tư
            { wch: 20 },  // Loại thuốc
            { wch: 10 },  // Số lượng
            { wch: 10 },  // Đơn vị
            { wch: 15 },  // Giá
            { wch: 15 },  // Ngày thêm
            { wch: 40 }   // Mô tả
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách thuốc-vật tư");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "DanhSachThuocVatTu.xlsx");
    };

    const deleteThuocVatTu = (id_thuoc_vat_tu) => {
        if (window.confirm("Bạn có muốn xóa thuốc/vật tư này không?")) {
            axios.delete(`http://localhost:5000/api/deleteTVT/${id_thuoc_vat_tu}`)
                .then(() => {
                    toast.success('Xóa thuốc/vật tư thành công!', {
                        position: "top-right",
                        autoClose: 500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Flip,
                    });
                    setTimeout(() => loadData(), 500);
                })
                .catch(error => console.error("Error deleting data", error));
        }
    }

    return (
        <div className="card shadow mb-4">
            <div className="d-flex align-items-center justify-content-between card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Dữ Liệu Thuốc/Vật Tư</h6>
                <div className="d-flex align-items-center">
                    <button onClick={exportToExcel} className="btn btn-success d-flex align-items-center" style={{ height: '38px' }}>
                    <i className="fas fa-file-excel mr-2"></i>Xuất Excel
                    </button>
                    <Link to="/CreateTVT" className="btn btn-primary ml-2 d-flex align-items-center" style={{ height: '38px' }}>
                    Thêm thuốc/vật tư
                    </Link>
                </div>
            </div>
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
            <div className="card-body">
                <div className="table-responsive">
                    <div>
                        <label className="mr-2">Số bản ghi/trang:</label>
                        <select
                        className="form-control form-control-sm d-inline-block"
                        style={{ width: "80px" }}
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(parseInt(e.target.value));
                            setCurrentPage(1); // reset về trang đầu
                        }}
                        >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        </select>
                    </div>
                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Tên thuốc/vật tư</th>
                                <th>Số lượng</th>
                                <th>Đơn vị</th>
                                <th>Chi tiết</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => {
                                return (
                                    <tr key={item.id_thuoc_vat_tu}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                style={{ borderRadius: '5px' }}
                                                src={item.hinh_anh}
                                                width='60'
                                                height='60'
                                                alt="Hình ảnh thuốc/vật tư"
                                            />
                                        </td>
                                        <td>{item.ten_thuoc}</td>
                                        <td>{item.so_luong}</td>
                                        <td>{item.don_vi}</td>
                                        <td>
                                            <Link to={`/ViewTVT/${item.id_thuoc_vat_tu}`} className="btn btn-primary">Chi Tiết</Link>
                                        </td>
                                        <td>
                                            <Link to={`/UpdateTVT/${item.id_thuoc_vat_tu}`} className="btn btn-warning">Sửa</Link>
                                        </td>
                                        <td>
                                            <button
                                                type='button'
                                                onClick={() => deleteThuocVatTu(item.id_thuoc_vat_tu)}
                                                className='btn btn-danger'
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <nav>
                        <ul className="pagination justify-content-center mt-3">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                                &laquo;
                            </button>
                            </li>

                            {[...Array(totalPages).keys()].map(number => (
                            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                <button onClick={() => setCurrentPage(number + 1)} className="page-link">
                                {number + 1}
                                </button>
                            </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                                &raquo;
                            </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}
