import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Flip, toast } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Indexkhohang() {

    const [data ,setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    
    const loadData =  async() =>{
        const response = await axios.get("http://localhost:5000/api/getallkhohang");
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
                    const response = await axios.get(`http://localhost:5000/api/searchkhohang/${searchTerm}`);
                    setData(response.data);
                } catch (error) {
                    console.error("Error searching data", error);
                }
            }
        };
        

        const deleteKH = (id_kho) =>{
            if(window.confirm("Bạn có muốn xóa sản phẩm này không ?")){
                axios.delete(`http://localhost:5000/api/deletekhohang/${id_kho}`);
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

        const exportToExcel = () => {
            const formattedData = data.map((item, index) => ({
                "STT": index + 1,
                "Tên sản phẩm": item.ten_thuoc_vat_tu || "",
                "Số lượng": item.so_luong || 0,
                "Ngày nhập": item.ngay_nhap ? new Date(item.ngay_nhap).toLocaleDateString("vi-VN") : "",
                "Hình ảnh": item.hinh_anh_vt || "",
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            worksheet["!cols"] = [
                { wch: 5 },     // STT
                { wch: 30 },    // Tên sản phẩm
                { wch: 12 },    // Số lượng
                { wch: 15 },    // Ngày nhập
                { wch: 50 },    // Hình ảnh
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "KhoHang");

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(fileData, "Danh_sach_kho_hang.xlsx");
        };

  return (
    <div>
      <div class="card shadow mb-4">
        <div class="d-flex align-items-center justify-content-between card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Dữ Liệu Kho Hàng</h6>
            <div className="d-flex align-items-center">
                <button onClick={exportToExcel} className="btn btn-success d-flex align-items-center" style={{ height: '38px' }}>
                <i className="fas fa-file-excel mr-2"></i>Xuất Excel
                </button>
                <Link to="/Createkhohang" className="btn btn-primary ml-2 d-flex align-items-center" style={{ height: '38px' }}>
               Thêm kho hàng
                </Link>
            </div>
        </div>
        <div className="d-flex align-items-center  card-header ">
            <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <label htmlFor="">Tìm kiếm :</label>
                        <input style={{marginLeft:'5px'}}type="text" onChange={handleSearch} className="form-control form-control-sm" placeholder="nhập dữ liệu tìm kiếm" aria-label="Search" aria-describedby="basic-addon2"/>
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
                            <th>Ảnh sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Ngày sản xuất</th>
                            <th>Số lượng</th>
                            <th>Chi tiết</th>
                            <th>Sửa</th>
                            <th>Xóa</th>

                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((item,index)=>{
                            return( 
                            <tr key={item.id_kho}>
                                <td>{index+1}</td>
                                <td><img style={{borderRadius: '5px'}} src={item.hinh_anh_vt} width='60' height='60' className="img img-responsive" /></td>
                                <td>{item.ten_thuoc_vat_tu}</td>
                                <td>{item.ngay_nhap.slice(0, 10)}</td>
                                <td>{item.so_luong}</td>
                                <td><Link to={`/Viewkhohang/${item.id_kho}`} type="button" class="btn btn-primary">Chi Tiết</Link></td>
                                <td><Link to={`/Updatekhohang/${item.id_kho}`} class="btn btn-warning">Sửa</Link></td>
                                <td>
                                        <button type='submit' onClick={() => deleteKH(item.id_kho)} class='btn btn-danger'>Xóa</button>
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
    </div>
  )
}
