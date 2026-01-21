import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link , useParams} from 'react-router-dom';
import { Flip, toast } from 'react-toastify';

export default function IndexlichkhambenhBacSi() {
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };  
    
    const [data , setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const{id_bac_si} = useParams()

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const loadData =  async() =>{
        const response = await axios.get(`http://localhost:5000/api/getctlkbyidbacsi/${id_bac_si}`);
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
                    const response = await axios.get(`http://localhost:5000/api/searchhd/${searchTerm}`);
                    setData(response.data);
                } catch (error) {
                    console.error("Error searching data", error);
                }
            }
        };

            
        const handleDateSearch = async (e) => {
            const selectedDate = e.target.value; // yyyy-mm-dd
            if (!selectedDate) {
                loadData();
            } else {
                try {
                    const response = await axios.get(`http://localhost:5000/api/getlichkham/${selectedDate}`);
                    setData(response.data);
                } catch (error) {
                    console.error("Lỗi khi tìm kiếm theo ngày:", error);
                }
            }
        };

        const handleStatusSearch = async (e) => {
            const selectedStatus = e.target.value;
            if (!selectedStatus) {
              loadData(); // Tải lại toàn bộ nếu không chọn gì
            } else {
              try {
                const response = await axios.get(`http://localhost:5000/api/getlichkham/trangthai/${selectedStatus}`);
                setData(response.data);
              } catch (error) {
                console.error("Lỗi khi tìm kiếm theo trạng thái:", error);
              }
            }
          };
          
        
        const deleteLK = (id_lich_kham) =>{
            if(window.confirm("Bạn có muốn xóa danh mục này không ?")){
                axios.delete(`http://localhost:5000/api/deletelichkham/${id_lich_kham}`);
                toast.success('Xóa lịch khám bệnh thành công !', {
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
        <h6 class="m-0 font-weight-bold text-primary">Dữ Liệu Lịch Khám</h6>
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
                    placeholder="Nhập tên bệnh nhân"
                    />
                </div>

                {/* Tìm theo ngày */}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                    <label className="mb-0 mr-2">Theo ngày:</label>
                    <input
                    type="date"
                    onChange={handleDateSearch}
                    className="form-control form-control-sm"
                    />
                </div>

                {/* Tìm theo trạng thái */}
                <div className="d-flex align-items-center mr-4 mb-2" style={{ whiteSpace: 'nowrap' }}>
                <label className="mb-0 mr-2">Trạng thái:</label>
                <select
                    className="form-control form-control-sm"
                    onChange={handleStatusSearch}
                    defaultValue=""
                >
                    <option value="">-- Tất cả --</option>
                    <option value="1">Chưa duyệt</option>
                    <option value="2">Đã duyệt</option>
                    <option value="3">Đang sắp xếp</option>
                    <option value="4">Khách hàng đã hủy lịch</option>
                    <option value="5">Hoàn tất khám bệnh</option>
                </select>
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
                        <th>Tên KH</th>
                        <th>Ngày đặt</th>
                        {/* <th>Tổng tiền</th> */}
                        {/* <th>Địa chỉ</th>
                        <th>Ghi chú</th> */}
                        <th>Trạng thái</th>
                        <th>Chi tiết</th>
                        <th>Duyệt</th>
                        <th>Xóa</th>

                    </tr>
                </thead>

                <tbody>
                {currentItems.map((item,index)=>{
                    return(   
                    <tr key={item.id_lich_kham}>
                        <td>{index+1}</td>
                        <td>{item.ho_ten_bn}</td>
                        <td>{new Date(item.ngay_dat_lich).toLocaleDateString('en-GB')}</td>
                        <td>
                        {parseInt(item.trang_thai) === 1 
                        ? "Chưa duyệt" 
                        : parseInt(item.trang_thai) === 2 
                        ? "Đã duyệt" 
                        : parseInt(item.trang_thai) === 3 
                        ? "Đang sắp xếp lịch" 
                        : parseInt(item.trang_thai) === 4
                        ? "Khách đã hủy"
                        : parseInt(item.trang_thai) === 5
                        ? "Hoàn tất khám bệnh"
                        : "Trạng thái không xác định"}
                        </td>
                        <td><Link to={`/Viewctlk/${item.id_lich_kham}`} type="button" class="btn btn-primary">Xem</Link></td>
                        <td><Link to={`/UpdatelkBacSi/${item.id_lich_kham}`} type="button" class="btn btn-warning">Duyệt</Link></td>
                        <td>
                                <button type='submit' onClick={()=> deleteLK(item.id_lich_kham)} class='btn btn-danger'>Xóa</button>
                    
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
