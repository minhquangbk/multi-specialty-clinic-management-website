import axios from 'axios';
import React, { useState , useEffect } from 'react';
import { useNavigate , useParams , Link} from 'react-router-dom';
import { toast , Flip } from 'react-toastify';


const initialState = {
    id_benh_nhan: "",
    chan_doan: "",
    phuong_phap_dieu_tri: "",
    ghi_chu: "",
    ngay_lap: "",
    tien_su_benh: "",
    trieu_chung: ""
};

export default function CreateHoSoBenhAn() {
    const [state, setState] = useState(initialState);
    const [datathuoc, setDatathuoc] = useState([]);
    const [datalichkham, setDatalichkham] = useState([]);
    const [chiTiet, setDataDichVu] = useState([]);
    console.log(datathuoc)

    const {  chan_doan, phuong_phap_dieu_tri, ghi_chu, tien_su_benh, trieu_chung } = state;
    const navigate = useNavigate();
    const { id_lich_kham } = useParams();

        // Lấy thông tin lịch khám và danh sách bác sĩ theo khoa ban đầu
    useEffect(() => {
        axios.get(`http://localhost:5000/api/getlk/${id_lich_kham}`)
            .then((resp) => {
                const data = resp.data?.[0]; // Sử dụng optional chaining để tránh lỗi khi data undefined
                setDatalichkham(data);
            })
            .catch(() => toast.error("Không thể lấy thông tin lịch khám"));
    }, [id_lich_kham]);

    useEffect(() => {
       // Thay đổi cách lấy dữ liệu thành một mảng
       axios.get(`http://localhost:5000/api/getctlk/${id_lich_kham}`)
           .then((resp) => setDataDichVu(resp.data))
           .catch((error) => console.error(error));

   }, [id_lich_kham]);

    useEffect(() => {
        // Thay đổi cách lấy dữ liệu thành một mảng
        axios.get(`http://localhost:5000/api/getctbillthuoc/${id_lich_kham}`)
            .then((resp) => setDatathuoc(resp.data))
            .catch((error) => console.error(error));

    }, [id_lich_kham]);


    useEffect(() => {
        const savedData = localStorage.getItem("hoSoBenhAnData");
        if (savedData) {
            setState(JSON.parse(savedData));
        }
    }, []);

    const tinhTongTien = () => {
        const tongDichVu = chiTiet.reduce((tong, item) => {
            const gia = parseFloat(item.gia || 0);
            const soLuong = parseInt(item.so_luong || 0, 10);
            return tong + gia * soLuong;
        }, 0);

        const tongThuoc = datathuoc.reduce((tong, item) => {
            const gia = parseFloat(item.gia || 0);
            const soLuong = parseInt(item.so_luong || 0, 10);
            return tong + gia * soLuong;
        }, 0);

        return tongDichVu + tongThuoc;
    };

    try {
        // Gửi yêu cầu cập nhật bằng JSON
        const tong_tien = tinhTongTien()
        console.log(tong_tien)
        axios.put(`http://localhost:5000/api/updatepricelk/${id_lich_kham}`, {
            tong_tien: tong_tien,
        });
      } catch (err) {
        toast.error(err.response?.data || "Lỗi xảy ra trong quá trình cập nhật");
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if ( !chan_doan || !phuong_phap_dieu_tri || !trieu_chung) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
        } else {
            // Tạo ngày hiện tại ở định dạng YYYY-MM-DD
            const today = new Date();
            const ngay_lap = today.toISOString().split('T')[0];
            axios.post("http://localhost:5000/api/createhosobenhan", {
                id_benh_nhan:datalichkham.id_benh_nhan,id_bac_si:datalichkham.id_bac_si,id_lich_kham:id_lich_kham, chan_doan, phuong_phap_dieu_tri, ghi_chu, ngay_lap, tien_su_benh, trieu_chung
            }).then(() => {
                setState(initialState);
                toast.success("Thêm kết quả khám bệnh thành công!");
                localStorage.removeItem("hoSoBenhAnData");
                setTimeout(() => navigate(`/UpdatelkBacSi/${id_lich_kham}`), 500);
            }).catch((err) => toast.error(err.response.data));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Cập nhật state
        const updatedState = { ...state, [name]: value };
        setState(updatedState);

        // Lưu vào localStorage
        localStorage.setItem("hoSoBenhAnData", JSON.stringify(updatedState));
    };

    const InputValue = () => {
        toast.success('Hiện không có dữ liệu ở thiết bị khám bệnh! ')
    }

     const formatDate = (dateString) => {

        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };  

    const deleteThuoc = (id_hoa_don) => {
        if (window.confirm("Bạn có muốn xóa dịch vụ này không ?")) {
            axios.delete(`http://localhost:5000/api/deletethuocbill/${id_hoa_don}`)
                .then(() => {
                    toast.success('Xóa thuốc khỏi đơn thành công!', {
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
                    // Cập nhật lại dữ liệu sau khi xóa
                    setDatathuoc((prevData) => prevData.filter(item => item.id_hoa_don !== id_hoa_don));
                })
                .catch((error) => console.error("Xóa thuốc thất bại!", error));
        }
    }

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
                <h3 className="m-0">Thêm kết quả khám bệnh</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{marginTop:'15px'}} className="table-responsive">
                        {chiTiet.length > 0 ? (
                            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>Tên dịch vụ</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chiTiet.map((item) => (
                                        <tr key={item.id_hoa_don}>
                                            <td>{item.ten_dich_vu}</td>
                                            <td>{item.so_luong}</td>
                                            <td>{formatCurrency(item.gia)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-muted">Khách hàng chưa sử dụng dịch vụ khám nào.</p>
                        )}
                    </div>
                <div className="row mb-3">
                    <div className="col">
                        <p>Họ tên bệnh nhân</p>
                        <input type="text" name="ho_ten_bn" onChange={handleInputChange} value={datalichkham.ho_ten_bn} className="form-control" placeholder="Họ tên bệnh nhân" readOnly />
                    </div>
                    <div className="col">
                        <p>Ngày khám</p>
                        <input type="date" name="ngay_kham" onChange={handleInputChange} value={formatDate(datalichkham.ngay_kham)} className="form-control" placeholder="Ngày Lập"  readOnly/>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <p>Tiền sử bệnh</p>
                        <textarea name="tien_su_benh" onChange={handleInputChange} value={tien_su_benh} className="form-control" placeholder="Nhập tiền sử bệnh..." />
                    </div>
                    <div className="col">
                        <p>Triệu chứng</p>
                        <textarea name="trieu_chung" onChange={handleInputChange} value={trieu_chung} className="form-control" placeholder="Nhập triệu chứng bệnh..." />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <p>Chuẩn đoán</p>
                        <textarea type="text" name="chan_doan" onChange={handleInputChange} value={chan_doan} className="form-control" placeholder="Nhập chuẩn đoán..." />
                    </div>
                    <div className="col">
                        <p>Phương pháp điều trị</p>
                        <textarea type="text" name="phuong_phap_dieu_tri" onChange={handleInputChange} value={phuong_phap_dieu_tri} className="form-control" placeholder="Nhập phương pháp điều trị..." />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <p>Ghi chú của bác sĩ</p>
                        <textarea name="ghi_chu" onChange={handleInputChange} value={ghi_chu} className="form-control" placeholder="Nhập ghi chú..." />
                    </div>
                </div>

                <div className="row">
                    <div className="d-grid">
                        <Link onClick={InputValue} style={{ marginLeft: '10px' , marginBottom:'15px' }} className="btn btn-warning">Xuất kể quả từ thiết bị khám bệnh</Link>
                    </div>
                    <div className="d-grid">
                        <Link to={`/Indexaddthuoc/${id_lich_kham}`} style={{ marginLeft: '10px' , marginBottom:'15px' }} type="submit" className="btn btn-success" >Thêm thuốc điều trị</Link>
                    </div>
                </div>

                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Tên thuốc/vật tư</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>Chi tiết</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datathuoc.map((item, index) => {
                                return (
                                    <tr key={item.id_thuoc_vat_tu}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                style={{ borderRadius: '5px' }}
                                                src={item.hinh_anh_thuoc}
                                                width='60'
                                                height='60'
                                                alt="Hình ảnh thuốc/vật tư"
                                            />
                                        </td>
                                        <td>{item.ten_thuoc}</td>
                                        <td>{item.so_luong}</td>
                                        <td>{formatCurrency(item.gia)}</td>
                                        <td>
                                            <Link to={`/ViewTVT/${item.id_thuoc_vat_tu}`} className="btn btn-primary">Chi Tiết</Link>
                                        </td>
                                        <td>
                                            <button
                                                type='button'
                                                className='btn btn-danger'
                                                onClick={() => deleteThuoc(item.id_hoa_don)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                <div className="row">
                    <div className="d-grid">
                        <button style={{ marginLeft: '10px' }} type="submit" className="btn btn-primary">Thêm kết quả khám</button>
                    </div>
                    <div className="d-grid">
                        <Link to={`/CreateChuyenTuyen/${id_lich_kham}`} style={{ marginLeft: '10px' }}  className="btn btn-primary">Chuyển cơ sở y tế</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
