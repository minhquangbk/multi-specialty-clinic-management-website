import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { toast ,Flip } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Indexbenhnhan() {
    const [data,setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const loadData = async() =>{
        const response = await axios.get("http://localhost:5000/api/getallbenhnhan");
        setData(response.data);
    };

    useEffect(()=>{
        loadData();
    },[]);

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm) {
            loadData();
        } else {
            try {
                const response = await axios.get(`http://localhost:5000/api/searchbenhnhan/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Error searching data", error);
            }
        }
    };

    const handleSearchPhone = async (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm) {
            loadData();
        } else {
            try {
                const response = await axios.get(`http://localhost:5000/api/searchbenhnhan/sodienthoai/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Error searching data", error);
            }
        }
    };

    const exportToExcel = () => {
    const formattedData = data.map((item, index) => ({
        "STT": index + 1,
        "Họ tên": item.ho_ten,
        "Ngày sinh": new Date(item.ngay_sinh).toLocaleDateString("vi-VN"),
        "Giới tính": item.gioi_tinh === 1 ? "Nam" : item.gioi_tinh === 2 ? "Nữ" : "Khác",
        "Địa chỉ": item.dia_chi,
        "Số điện thoại": item.so_dien_thoai,
        "Email": item.email,
        "CMND": item.cmnd,
        "Ngày vào": new Date(item.ngay_vao_kham).toLocaleDateString("vi-VN"),
        "Ngày xuất phòng": new Date(item.ngay_xuat_phong).toLocaleDateString("vi-VN")
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    worksheet["!cols"] = [
        { wch: 5 },   // STT
        { wch: 20 },  // Họ tên
        { wch: 15 },  // Ngày sinh
        { wch: 10 },  // Giới tính
        { wch: 30 },  // Địa chỉ
        { wch: 15 },  // SĐT
        { wch: 25 },  // Email
        { wch: 15 },  // CMND
        { wch: 15 },  // Ngày vào
        { wch: 20 },  // Ngày xuất phòng
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách bệnh nhân");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "DanhSachBenhNhan.xlsx");
    };

    const deleteKH = (id_benh_nhan) => {
        if(window.confirm("Bạn có muốn xóa sản phẩm này không ?")){
            axios.delete(`http://localhost:5000/api/deletebenhnhan/${id_benh_nhan}`)
            toast.success('Xóa sản phẩm thành công !', {
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
            setTimeout(()=>loadData(),500);
        }
    }
  return (
    <div class="card shadow mb-4">
        <div class="d-flex align-items-center justify-content-between card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Dữ Liệu Bệnh Nhân</h6>
            <div className="d-flex align-items-center">
                <button onClick={exportToExcel} className="btn btn-success d-flex align-items-center" style={{ height: '38px' }}>
                <i className="fas fa-file-excel mr-2"></i>Xuất Excel
                </button>
                <Link to="/Createbenhnhan" className="btn btn-primary ml-2 d-flex align-items-center" style={{ height: '38px' }}>
                Thêm Bệnh Nhân
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
                    onChange={handleSearch}
                    className="form-control form-control-sm"
                    placeholder="Nhập tên bệnh nhân"
                    />
                </div>

                {/* Tìm theo số điện thoại */}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                    <label className="mb-0 mr-2">Theo số điện thoại:</label>
                    <input
                    type="text"
                    onChange={handleSearchPhone}
                    className="form-control form-control-sm"
                    placeholder="Nhập số điện thoại"
                    />
                </div>

                </div>
            </form>
            </div>
        <div class="card-body">
            <div class="table-responsive">
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
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên bệnh nhân</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Chi tiết</th>
                            <th>Sửa</th>
                            <th>Xóa</th>

                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((item,index)=>{
                            return( 
                            <tr key={item.id_benh_nhan}>
                                <td>{index+1}</td>
                                <td>{item.ho_ten}</td>
                                <td>{item.so_dien_thoai}</td>
                                <td>{item.dia_chi}</td>
                                <td><Link to={`/Viewbenhnhan/${item.id_benh_nhan}`} type="button" class="btn btn-primary">Chi Tiết</Link></td>
                                <td><Link to={`/Updatebenhnhan/${item.id_benh_nhan}`} class="btn btn-warning">Sửa</Link></td>
                                <td>
                                        <button type='submit' onClick={()=>deleteKH(item.id_benh_nhan)} class='btn btn-danger'>Xóa</button>
                                </td>
                            </tr>)
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
  )
}
