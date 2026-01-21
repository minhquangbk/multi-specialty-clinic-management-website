import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast, Flip } from 'react-toastify';
import { useUser } from '../../until/userContext';

export default function IndexNghiPhepBacSi() {
    const [data, setData] = useState([]);
    const { user } = useUser();
    console.log(data)

    const loadData = async () => {
    try {
        const res = await axios.get(`http://localhost:5000/api/getinfobyiduser/${user.id}`);
        const idUser = res.data?.id_user;

        if (!idUser) {
        console.error("Không tìm thấy id_user từ id_tai_khoan");
        return;
        }

        const response = await axios.get(`http://localhost:5000/api/getbacsioff/${idUser}`);
        setData(response.data);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
    }
};

    useEffect(() => {
        loadData();
    }, [user.id]);

    const deleteBill = (id_nghi_phep) => {
        if (window.confirm("Bạn có muốn hủy đơn nghỉ phép này không?")) {
            axios.delete(`http://localhost:5000/api/deletenghiphep/${id_nghi_phep}`)
                .then(() => {
                    toast.success('Hủy đơn thành công !', {
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

    return (
        <div className="card shadow mb-4">
            <div className="d-flex align-items-center justify-content-between card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Đơn Nghỉ Phép</h6>
                <Link to="/XinNghiPhep" className="btn btn-primary">Thêm Đơn</Link>
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
                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ngày Nghỉ Từ</th>
                                <th>Đến ngày</th>
                                <th>Trạng Thái</th>
                                <th>Loại</th>
                                <th>Ngày gửi</th>
                                <th>Hủy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item.id_nghi_phep}>
                                    <td>{index+1}</td>
                                    <td>{new Date(item.batdau_nghi).toLocaleDateString('en-GB')}</td>
                                    <td>{new Date(item.ketthuc_nghi).toLocaleDateString('en-GB')}</td>
                                    <td>
                                    {parseInt(item.trang_thai_nghi) === 0
                                    ? "Chưa duyệt" 
                                    : parseInt(item.trang_thai_nghi) === 1
                                    ? "Đã duyệt" 
                                    : "Trạng thái không xác định"}
                                    </td>
                                    <td>{item.loai_nghi}</td>
                                    <td>{new Date(item.ngay_gui).toLocaleDateString('en-GB')}</td>
                                    <td>
                                        <button
                                            type='button'
                                            onClick={() => deleteBill(item.id_nghi_phep)}
                                            className='btn btn-danger'>
                                            Hủy
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
