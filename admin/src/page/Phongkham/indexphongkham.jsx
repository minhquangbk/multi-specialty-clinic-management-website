import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast, Flip } from 'react-toastify';

export default function IndexPhongKham() {
    const [data, setData] = useState([]);
    const [dmKhoaList, setDmKhoaList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const loadData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getallphongkham");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching phòng khám data:", error);
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
                const response = await axios.get(`http://localhost:5000/api/searchphongkham/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Error searching data", error);
            }
        }
    };

    const deletePhongKham = (id_phong_kham) => {
        if (window.confirm("Bạn có muốn xóa phòng khám này không?")) {
            axios.delete(`http://localhost:5000/api/deletephongkham/${id_phong_kham}`)
                .then(() => {
                    toast.success('Xóa phòng khám thành công!', {
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
                .catch((err) => console.error("Error deleting phòng khám:", err));
        }
    };

    const getTenKhoaById = (id_khoa) => {
        const khoa = dmKhoaList.find(k => k.id_khoa === id_khoa);
        return khoa ? khoa.ten_khoa : "N/A";
    };

    return (
        <div className="card shadow mb-4">
            <div className="d-flex align-items-center justify-content-between card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Dữ Liệu Phòng Khám</h6>
                <Link to="/CreatePhongKham" className="btn btn-primary">Thêm Phòng Khám</Link>
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
                    placeholder="Nhập tên phòng"
                    />
                </div>


                {/* Tìm theo khoa*/}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                <label className="mb-0 mr-2">Theo Khoa:</label>
                <select
                    className="form-control form-control-sm"
                    defaultValue=""
                >
                    <option value="">-- Tất cả --</option>
                    <option value="khoa-noi-ngoai">Khoa Nội Ngoại</option>
                    <option value="khoa-nhi">Khoa Nhi</option>
                    <option value="khoa-xet-nghiem">Khoa Xét Nghiệm</option>
                    <option value="nha-khoa">Nha Khoa</option>
                    <option value="sanh-tu-van-khoa">Sảnh tư vấn khoa</option>
                    <option value="khoa-tong-quat">Khoa Tổng Quát</option>
                    <option value="tai-mui-hong">Tai Mũi Họng</option>
                    <option value="khoa-ho-hap">Khoa Hô Hấp</option>
                    <option value="khoa-san">Khoa sản</option>
                    <option value="khoa-dinh-duong">Khoa dinh dưỡng</option>
                </select>
                </div>


                </div>
            </form>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <div className="d-flex justify-content-between align-items-center mb-2">
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
                    </div>

                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên Phòng Khám</th>
                                <th>Chuyên Khoa</th>
                                <th>Chi tiết</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={item.id_phong_kham}>
                                    <td>{index + 1}</td>
                                    <td>{item.ten_phong_kham}</td>
                                    <td>{getTenKhoaById(item.id_khoa)}</td>
                                    <td>
                                        <Link to={`/ViewPhongKham/${item.id_phong_kham}`} type="button" className="btn btn-primary">
                                            Chi Tiết
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/UpdatePhongKham/${item.id_phong_kham}`} className="btn btn-warning">
                                            Sửa
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            type='button'
                                            onClick={() => deletePhongKham(item.id_phong_kham)}
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
