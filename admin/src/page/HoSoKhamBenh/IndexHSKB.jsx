import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Flip } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function IndexHoSoBenhAn() {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [benhNhanData, setBenhNhanData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);


    const loadHoSoData = async () => {
        const response = await axios.get("http://localhost:5000/api/getallhosobenhan");
        setData(response.data);
        setOriginalData(response.data);
    };

    const loadBenhNhanData = async () => {
        const response = await axios.get("http://localhost:5000/api/getallbenhnhan");
        const benhNhanMap = response.data.reduce((acc, benhNhan) => {
            acc[benhNhan.id_benh_nhan] = benhNhan.ho_ten;
            return acc;
        }, {});
        setBenhNhanData(benhNhanMap);
    };
    

    useEffect(() => {
        loadHoSoData();
        loadBenhNhanData();
    }, []);

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm) {
            loadHoSoData();
        } else {
            try {
                const response = await axios.get(`http://localhost:5000/api/searchhosobenhan/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Error searching data", error);
            }
        }
    };

    const handleDateSearch = async (e) => {
        const selectedDate = e.target.value; // yyyy-mm-dd
        if (!selectedDate) {
            loadHoSoData();
        } else {
            try {
                const response = await axios.get(`http://localhost:5000/api/gethosobenhanbydate/${selectedDate}`);
                setData(response.data);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm theo ngày:", error);
            }
        }
    };

    const handleSearchByName = (e) => {
        const keyword = e.target.value.toLowerCase();
        if (!keyword) {
          setData(originalData); // reset lại toàn bộ khi không có từ khóa
        } else {
          const filtered = originalData.filter((item) => {
            const tenBenhNhan = benhNhanData[item.id_benh_nhan]?.toLowerCase() || "";
            return tenBenhNhan.includes(keyword);
          });
          setData(filtered);
        }
      };
      
      
    
    const deleteHBA = (id_ho_so) => {
        if (window.confirm("Bạn có muốn xóa hồ sơ bệnh án này không?")) {
            axios.delete(`http://localhost:5000/api/deletehosobenhan/${id_ho_so}`)
            .then(() => {
                toast.success('Xóa hồ sơ bệnh án thành công!', {
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
                setTimeout(() => loadHoSoData(), 500);
            })
            .catch((error) => toast.error("Xóa hồ sơ bệnh án thất bại!"));
        }
    };

    const exportToExcel = () => {
        const formattedData = data.map((item, index) => ({
            "STT": index + 1,
            "Tên bệnh nhân": benhNhanData[item.id_benh_nhan] || "Không rõ",
            "Ngày lập": item.ngay_lap ? new Date(item.ngay_lap).toLocaleDateString("vi-VN") : "",
            "Chẩn đoán": item.chan_doan || "",
            "Phương pháp điều trị": item.phuong_phap_dieu_tri || "",
            "Tiền sử bệnh": item.tien_su_benh || "",
            "Triệu chứng": item.trieu_chung || "",
            "Ghi chú": item.ghi_chu || ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        worksheet["!cols"] = [
            { wch: 5 },    // STT
            { wch: 25 },   // Tên bệnh nhân
            { wch: 15 },   // Ngày lập
            { wch: 30 },   // Chẩn đoán
            { wch: 30 },   // Phương pháp điều trị
            { wch: 30 },   // Tiền sử bệnh
            { wch: 30 },   // Triệu chứng
            { wch: 30 }    // Ghi chú
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "HoSoBenhAn");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Danh_sach_ho_so_benh_an.xlsx");
    };

    return (
        <div className="card shadow mb-4">
            <div className="d-flex align-items-center justify-content-between card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Dữ Liệu Hồ Sơ Bệnh Án</h6>
                <div className="d-flex align-items-center">
                    <button onClick={exportToExcel} className="btn btn-success d-flex align-items-center" style={{ height: '38px' }}>
                    <i className="fas fa-file-excel mr-2"></i>Xuất Excel
                    </button>
                </div>
            </div>
            <div className="card-header">
             <form className="w-100">
                <div className="d-flex align-items-center flex-wrap">

                {/* Tìm theo ID */}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                    <label className="mb-0 mr-2">Tìm kiếm:</label>
                    <input
                    type="text"
                    onChange={handleSearch}
                    className="form-control form-control-sm"
                    placeholder="Nhập id"
                    />
                </div>

                {/* Tìm theo tên */}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                    <label className="mb-0 mr-2">Tìm kiếm:</label>
                    <input
                    type="text"
                    onChange={handleSearchByName}
                    className="form-control form-control-sm"
                    placeholder="Nhập tên bệnh nhân"
                    />
                </div>

                {/* Tìm theo ngày */}
                <div className="d-flex align-items-center mb-2" style={{ whiteSpace: 'nowrap' }}>
                    <label className="mb-0 mr-2">Ngày:</label>
                    <input
                    type="date"
                    onChange={handleDateSearch}
                    className="form-control form-control-sm"
                    />
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
                                <th>Tên Bệnh Nhân</th>
                                <th>Ngày Lập</th>
                                <th>Chẩn Đoán</th>
                                <th>Chi Tiết</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={item.id_ho_so}>
                                    <td>{index + 1}</td>
                                    {/* Lấy tên bệnh nhân từ benhNhanData */}
                                    <td>{benhNhanData[item.id_benh_nhan] || "Không có tên"}</td>
                                    <td>{new Date(item.ngay_lap).toLocaleDateString('en-GB')}</td>
                                    <td>{item.chan_doan}</td>
                                    <td>
                                        <Link to={`/Viewhosobenhan/${item.id_ho_so}`} className="btn btn-primary">
                                            Chi Tiết
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/Updatehosobenhan/${item.id_ho_so}`} className="btn btn-warning">
                                            Sửa
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => deleteHBA(item.id_ho_so)}
                                            className="btn btn-danger"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
