import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast, Flip } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

export default function IndexBacSi() {
    const [data, setData] = useState([]);
    const [dmKhoaList, setDmKhoaList] = useState([]);
    const [doctorLevels, setdoctorLevels] = useState([]);
    const [doctorDepartment, setdoctorDepartment] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    //tạo usestate chứa list search
    const [searchParams, setSearchParams] = useState({
        searchTerm: "",
        id_khoa: "",
        gioi_tinh: "",
        id_bang_cap: "",
    });
    
    const loadData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getallbs");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching bác sĩ data:", error);
        }
    };

    const loadDmKhoa = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getalldmkhoa");
            setDmKhoaList(response.data);
        } catch (error) {
            console.error("Error fetching danh mục khoa data:", error);
        }
    };

        //load dữ liệu trình độ bác sĩ
        const loadLevel = async () => {
            const response = await axios.get("http://localhost:5000/api/getalltrinhdo");
            setdoctorLevels(response.data);
        };
    
        //load dữ liệu khoa bác sĩ
        const loadDepartment = async () => {
            const response = await axios.get("http://localhost:5000/api/getalldmkhoa");
            setdoctorDepartment(response.data);
        };
    
        const handleSearch = async () => {
            const { searchTerm, id_khoa, gioi_tinh, id_bang_cap } = searchParams;
            const query = new URLSearchParams({
                searchTerm,
                id_khoa,
                gioi_tinh,
                id_bang_cap,
            }).toString();
    
            try {
                const response = await axios.get(`http://localhost:5000/api/searchdoctors?${query}`);
                setData(response.data);
            } catch (error) {
                console.error("Error searching data", error);
            }
        };
    
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setSearchParams((prev) => ({ ...prev, [name]: value }));
        };
    

    useEffect(() => {
        loadData();
        loadDmKhoa();
        loadDepartment();
        loadLevel();
    }, []);

    
    // Gọi API khi searchParams thay đổi, sử dụng debounce
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            handleSearch();
        }, 500); // Chờ 500ms trước khi thực hiện tìm kiếm

        return () => clearTimeout(debounceTimeout); // Xóa timeout nếu searchParams thay đổi trước khi timeout hoàn tất
    }, [searchParams]);


    const exportToExcel = () => {
        const formattedData = data.map((item, index) => ({
            "STT": index + 1,
            "Họ tên": item.ho_ten,
            "Ngày sinh": item.ngay_sinh ? new Date(item.ngay_sinh).toLocaleDateString("vi-VN") : "",
            "Giới tính": item.gioi_tinh === 1 ? "Nam" : item.gioi_tinh === 2 ? "Nữ" : "Khác",
            "CMND": item.cmnd || "",
            "Số điện thoại": item.so_dien_thoai || "",
            "Email": item.email || "",
            "Địa chỉ": item.dia_chi || "",
            "Ngày vào làm": item.ngay_vao_lam ? new Date(item.ngay_vao_lam).toLocaleDateString("vi-VN") : "",
            "Chức danh": item.chuc_danh || "",
            "Mô tả": item.mo_ta || "",
            "Chuyên khoa": getTenKhoaById(item.id_khoa),
            "Trình độ": (doctorLevels.find(lv => lv.id_bang_cap === item.id_bang_cap)?.ten_bang_cap) || "",
            "Trạng thái": parseInt(item.trang_thai) === 1
                ? "Hoạt động"
                : parseInt(item.trang_thai) === 2
                ? "Nghỉ phép"
                : "Không xác định"
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        worksheet["!cols"] = [
            { wch: 5 },    // STT
            { wch: 20 },   // Họ tên
            { wch: 15 },   // Ngày sinh
            { wch: 10 },   // Giới tính
            { wch: 15 },   // CMND
            { wch: 15 },   // Số điện thoại
            { wch: 25 },   // Email
            { wch: 30 },   // Địa chỉ
            { wch: 15 },   // Ngày vào làm
            { wch: 20 },   // Chức danh
            { wch: 25 },   // Mô tả
            { wch: 20 },   // Chuyên khoa
            { wch: 20 },   // Trình độ
            { wch: 15 },   // Trạng thái
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách bác sĩ");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Danh_sach_bac_si.xlsx");
    };

    const deleteNV = (id_bac_si) => {
        if (window.confirm("Bạn có muốn xóa nhân viên này không?")) {
            axios.delete(`http://localhost:5000/api/deletebacsi/${id_bac_si}`)
                .then(() => {
                    toast.success('Xóa nhân viên thành công!', {
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
                    loadData();
                })
                .catch((err) => console.error("Error deleting bác sĩ:", err));
        }
    };

    const getTenKhoaById = (id_khoa) => {
        const khoa = dmKhoaList.find(k => k.id_khoa === id_khoa);
        return khoa ? khoa.ten_khoa : "N/A";
    };

    return (
        <div className="card shadow mb-4">
            <div className="d-flex align-items-center justify-content-between card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Dữ Liệu Bác Sĩ</h6>
            <div className="d-flex align-items-center">
                <button onClick={exportToExcel} className="btn btn-success d-flex align-items-center" style={{ height: '38px' }}>
                <i className="fas fa-file-excel mr-2"></i>Xuất Excel
                </button>
                <Link to="/CreateBacSi" className="btn btn-primary ml-2 d-flex align-items-center" style={{ height: '38px' }}>
                Thêm Bác Sĩ
                </Link>
            </div>
            </div>
            <div className="card-header">
             <form className="w-100">
                <div className="d-flex align-items-center flex-wrap">

                {/* Tìm theo tên */}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                    <label className="mb-0 mr-2">Tìm kiếm:</label>
                    <input
                    type="text"
                    name="searchTerm"
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                    placeholder="Nhập dữ liệu tìm kiếm"
                    />
                </div>

                {/* Tìm theo giới tính */}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                <label className="mb-0 mr-2">Giới tính:</label>
                <select
                    name="gioi_tinh"
                    className="form-control form-control-sm"
                    onChange={handleInputChange}
                    defaultValue=""
                >
                     <option value="">Giới tính</option>
                    <option value="">Hiển thị tất cả giới tính</option>
                    <option value="1">Nam</option>
                    <option value="2">Nữ</option>
                </select>
                </div>

                {/* Tìm theo khoa*/}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                <label className="mb-0 mr-2">Theo Khoa:</label>
                <select
                    name="id_khoa"
                    className="form-control form-control-sm"
                    defaultValue=""
                    onChange={handleInputChange}
                >
                    <option  value="">Chọn chuyên khoa</option>
                    <option value="">Hiển thị tất cả chuyên khoa</option>
                    {doctorDepartment.map((dept) => (
                        <option key={dept.id_khoa} value={dept.id_khoa}>
                            {dept.ten_khoa}
                        </option>
                    ))}
                </select>
                </div>

                {/* Tìm theo bằng cấp*/}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                <label className="mb-0 mr-2">Bằng cấp:</label>
                <select
                     name="id_bang_cap"
                    className="form-control form-control-sm"
                    defaultValue=""
                    onChange={handleInputChange}
                >
                   <option value="">Trình độ</option>
                    <option value="">Hiển thị tất cả trình độ</option>
                    {doctorLevels.map((level) => (
                        <option key={level.id_bang_cap} value={level.id_bang_cap}>
                            {level.ten_bang_cap}
                        </option>
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
                                <th>Hình Ảnh</th>
                                <th>Tên bác sĩ</th>
                                <th>Chuyên Khoa</th>
                                <th>Trạng Thái</th>
                                <th>Chi tiết</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={item.id_bac_si}>
                                    <td>{index+1}</td>
                                    <td>
                                        <img
                                            style={{ borderRadius: '5px' }}
                                            src={item.hinh_anh_bs}
                                            width='60'
                                            height='60'
                                            className="img img-responsive"
                                            alt="Bác sĩ"
                                        />
                                    </td>
                                    <td>{item.ho_ten}</td>
                                    <td>{getTenKhoaById(item.id_khoa)}</td>
                                        <td>
                                        <span
                                            className={
                                            parseInt(item.trang_thai) === 1
                                                ? "text-success"
                                                : parseInt(item.trang_thai) === 2
                                                ? "text-danger"
                                                : "text-muted"
                                            }
                                        >
                                            {parseInt(item.trang_thai) === 1
                                            ? "Hoạt động"
                                            : parseInt(item.trang_thai) === 2
                                            ? "Nghỉ phép"
                                            : "Trạng thái không xác định"}
                                        </span>
                                        </td>

                                    <td>
                                        <Link to={`/ViewBacSi/${item.id_bac_si}`} type="button" className="btn btn-primary">
                                            Chi Tiết
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/UpdateBacSi/${item.id_bac_si}`} className="btn btn-warning">
                                            Sửa
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            type='button'
                                            onClick={() => deleteNV(item.id_bac_si)}
                                            className='btn btn-danger'>
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
