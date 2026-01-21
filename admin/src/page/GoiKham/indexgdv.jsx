import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, Flip } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Indexgdv() {
    const [data, setData] = useState([]);
    const [dmKhoaList, setDmKhoaList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const loadData = async () => {
        const response = await axios.get("http://localhost:5000/api/getallgdv");
        setData(response.data);
    };

    const loadDmKhoa = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getalldmkhoa");
            setDmKhoaList(response.data);
        } catch (error) {
            console.error("Error fetching danh mục khoa data:", error);
        }
    };

    useEffect(() => {
        loadData();
        loadDmKhoa();
    }, []);

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm) {
            loadData();
        } else {
            try {
                const response = await axios.get(`http://localhost:5000/api/searchgdv/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Error searching data", error);
            }
        }
    };

    const handleChuyenKhoaSearch = async (e) => {
            const selectedValue = e.target.value;
            console.log(selectedValue)
            if (!selectedValue) {
              loadData(); // Tải lại toàn bộ nếu không chọn gì
            } else {
              try {
                const response = await axios.get(`http://localhost:5000/api/getgdvbyidkhoa/${selectedValue}`);
                setData(response.data);
              } catch (error) {
                console.error("Lỗi khi tìm kiếm theo id khoa:", error);
              }
            }
     };

    const handleLoaiDichVuSearch = async (e) => {
    const name = e.target.value.trim();

    if (!name) {
        loadData(); // Nếu không có tên => load toàn bộ
    } else {
        try {
        const response = await axios.get(`http://localhost:5000/api/searchgdvprice`, {
            params: { name } 
        });
        setData(response.data);
        } catch (error) {
        console.error("Lỗi khi tìm kiếm theo loại dịch vụ", error);
        }
    }
    };

    const deleteDV = (id_dich_vu) => {
        if (window.confirm("Bạn có muốn xóa dịch vụ này không ?")) {
            axios.delete(`http://localhost:5000/api/deletegdv/${id_dich_vu}`)
                .then(() => {
                    toast.success('Xóa dịch vụ thành công !', {
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

    const getTenKhoaById = (id_khoa) => {
        const khoa = dmKhoaList.find(k => k.id_khoa === id_khoa);
        return khoa ? khoa.ten_khoa : "N/A";
    };

    const exportToExcel = () => {
    const formattedData = data.map((item, index) => ({
        "STT": index + 1,
        "Tên dịch vụ": item.ten_dich_vu || "",
        "Giá": item.gia ? item.gia.toLocaleString("vi-VN") + " VNĐ" : "",
        "Mô tả": item.mo_ta || "",
        "Lợi ích khám": item.loi_ich_kham || "",
        "Hướng dẫn khám": item.huong_dan_kham || "",
        "Thông báo": item.thong_bao || "",
        "Ưu đãi": item.uu_dai || "",
        "Chuyên khoa": getTenKhoaById(item.id_khoa),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Đặt độ rộng cho từng cột
    worksheet["!cols"] = [
        { wch: 5 },     // STT
        { wch: 25 },    // Tên dịch vụ
        { wch: 15 },    // Giá
        { wch: 40 },    // Mô tả
        { wch: 40 },    // Lợi ích khám
        { wch: 40 },    // Hướng dẫn khám
        { wch: 30 },    // Thông báo
        { wch: 20 },    // Ưu đãi
        { wch: 20 },    // Chuyên khoa
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách dịch vụ");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "Danh_sach_dich_vu_kham.xlsx");
};

    return (
        <div className="card shadow mb-4">
            <div className="d-flex align-items-center justify-content-between card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Dữ Liệu Dịch Vụ Khám</h6>
                <div className="d-flex align-items-center">
                    <button onClick={exportToExcel} className="btn btn-success d-flex align-items-center" style={{ height: '38px' }}>
                    <i className="fas fa-file-excel mr-2"></i>Xuất Excel
                    </button>
                    <Link to="/Creategdv" className="btn btn-primary ml-2 d-flex align-items-center" style={{ height: '38px' }}>
                    Thêm dịch vụ
                    </Link>
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
                    placeholder="Nhập tên dịch vụ"
                    />
                </div>

                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                    <label className="mb-0 mr-2">Tìm kiếm:</label>
                    <select  onChange={handleChuyenKhoaSearch} defaultValue=""  className="form-control form-control-sm">
                    <option disabled value="">Chuyên khoa</option>
                    <option value="">Hiển thị tất cả chuyên khoa</option>
                    {dmKhoaList.map((dept) => (
                        <option key={dept.id_khoa} value={dept.id_khoa}>
                            {dept.ten_khoa}
                        </option>
                    ))}
                    </select>
                </div>
                
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                    <label className="mb-0 mr-2">Tìm kiếm:</label>
                    <select onChange={handleLoaiDichVuSearch} className="form-control form-control-sm">
                        <option value="">Loại dịch vụ khám</option>
                        <option value="">Hiển thị tất cả</option>
                        <option value="nam">Nam giới</option>
                        <option value="nữ">Nữ giới</option>
                        <option value="trẻ em">Trẻ em</option>
                        <option value="cao">Người cao tuổi</option>
                        <option value="nhiệm">Xét nhiệm</option>
                        <option value="tim">Tim mạch</option>
                        <option value="công">Công ty</option>
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
                    <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Tên dịch vụ</th>
                                <th>Chuyên khoa</th>
                                <th>Chi tiết</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => {
                                return (
                                    <tr key={item.id_dich_vu}>
                                        <td>{index+1}</td>
                                        <td><img style={{ borderRadius: '5px' }} src={item.hinh_anh_dv} width='60' height='60' className="img img-responsive" /></td>
                                        <td>{item.ten_dich_vu}</td>
                                        <td>{getTenKhoaById(item.id_khoa)}</td>
                                        <td><Link to={`/Viewgdv/${item.id_dich_vu}`} type="button" className="btn btn-primary">Chi Tiết</Link></td>
                                        <td><Link to={`/Updategdv/${item.id_dich_vu}`} className="btn btn-warning">Sửa</Link></td>
                                        <td>
                                            <button type='submit' onClick={() => deleteDV(item.id_dich_vu)} className='btn btn-danger'>Xóa</button>
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
