import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function IndexNghiPhep() {
    const [data, setData] = useState([]);
    const [datanghiphep, setDatanghiphep] = useState([]);
    const [dmKhoaList, setDmKhoaList] = useState([]);
    const [doctorLevels, setdoctorLevels] = useState([]);
    const [doctorDepartment, setdoctorDepartment] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = datanghiphep.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(datanghiphep.length / itemsPerPage);



    const loadData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getallbs");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching bác sĩ data:", error);
        }
    };

    const loadDataNghiPhep = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getallbsoff");
            setDatanghiphep(response.data);
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
    
        //load dữ liệu khoa bác sĩ
        const loadDepartment = async () => {
            const response = await axios.get("http://localhost:5000/api/getalldmkhoa");
            setdoctorDepartment(response.data);
        };

    

    useEffect(() => {
        loadData();
        loadDmKhoa();
        loadDepartment();
        loadDataNghiPhep();
    }, []);


    const getTenKhoaById = (id_khoa) => {
        const khoa = dmKhoaList.find(k => k.id_khoa === id_khoa);
        return khoa ? khoa.ten_khoa : "N/A";
    };

    return (
        <div className="card shadow mb-4">
            <div className="d-flex align-items-center justify-content-between card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Dữ Liệu Nghỉ Phép</h6>
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
                    className="form-control form-control-sm"
                    placeholder="Nhập dữ liệu tìm kiếm"
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
                                <th>Tên bác sĩ</th>
                                <th>Chuyên Khoa</th>
                                <th>Loại nghỉ</th>
                                <th>Bắt đầu</th>
                                <th>Kết thúc</th>
                                <th>Ngày gửi</th>
                                <th>Trạng thái</th>
                                <th>Cập nhật</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datanghiphep.length === 0 ? (
                                <tr><td colSpan="9" className="text-center">Không có dữ liệu nghỉ phép</td></tr>
                                ) : (
                                currentItems.map((nghi, index) => {
                                    const bacsi = data.find(b => b.id_bac_si === nghi.id_bac_si);

                                    return (
                                    <tr key={nghi.id_nghi_phep}>
                                        <td>{index + 1}</td>
                                        <td>{bacsi ? bacsi.ho_ten : 'Không tìm thấy'}</td>
                                        <td>{bacsi ? getTenKhoaById(bacsi.id_khoa) : 'Không rõ'}</td>
                                        <td>{nghi.loai_nghi}</td>
                                        <td>{new Date(nghi.batdau_nghi).toLocaleDateString()}</td>
                                        <td>{new Date(nghi.ketthuc_nghi).toLocaleDateString()}</td>
                                        <td>{new Date(nghi.ngay_gui).toLocaleDateString()}</td>
                                        <td>
                                            {
                                            nghi.trang_thai_nghi === 0 ? 'Chờ duyệt' :
                                            nghi.trang_thai_nghi === 1 ? 'Đã duyệt' :
                                            'Từ chối'}

                                        </td>
                                        <td>
                                            <Link to={`/UpdateNghiPhep/${nghi.id_nghi_phep}`} className="btn btn-warning">
                                                Cập nhật
                                            </Link>
                                        </td>
                                    </tr>
                                    );
                                })
                                )}
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
