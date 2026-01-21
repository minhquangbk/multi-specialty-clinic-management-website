import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../until/userContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPhone } from "react-icons/fa";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng từ 0 đến 11
    const year = date.getFullYear();

    const monthNames = [
        "tháng 1", "tháng 2", "tháng 3", "tháng 4",
        "tháng 5", "tháng 6", "tháng 7", "tháng 8",
        "tháng 9", "tháng 10", "tháng 11", "tháng 12",
    ];

    return `${day} ${monthNames[month - 1]} năm ${year}`;
};

// Loading component
const Loading = () => (
    <div style={{marginTop:"100px"}} className="loading">
        <p>Đang tải dữ liệu...</p>
    </div>
);

// Error component
const Error = ({ message }) => (
    <div className="error">
        <p style={{ color: "red", marginTop:"110px", fontSize:'20px' }}>{message}</p>
    </div>
);

const initialState = {
trang_thai:"",
noi_dung_huy:"",
ghi_chu:"",
};

// Main component
export default function OrderCart() {
    const [state, setState] = useState(initialState);
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [databacsi, setDatabacsi] = useState([]);
    const [dataphong, setDataphongkham] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const {noi_dung_huy,ghi_chu} = state;
    const [id_lich_kham, setSelectedLichKhamId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [daHien, setDaHien] = useState(false);
    const [idUser, setIdUser] = useState(null);

    const navigate = useNavigate();
    console.log(idUser)
    console.log(orders);
    console.log(id_lich_kham, noi_dung_huy , ghi_chu)

    useEffect(() => {
        const fetchIdUser = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/getinfobyiduser/${user.id}`);
            const data = await res.json();

            if (data && data.id_user) {
            setIdUser(data.id_user); // Lưu id_user (bác sĩ hoặc bệnh nhân)
            }
        } catch (error) {
            console.error('Lỗi khi lấy id_user:', error);
        }
        };

        if (user?.id) {
        fetchIdUser();
        }
    }, [user]);

    const loadData = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            const response = await axios.get(
                `http://localhost:5000/api/orderDetailsByCustomer/${idUser}`
            );

            const filteredOrders = response.data.filter(
                (order) => order.trang_thai !== 4 && order.trang_thai !== 5
            );

            if (filteredOrders.length === 0) {
                setError("Hiện chưa có thông tin lịch khám nào của bạn tồn tại trên hệ thống !");
            } else {
                setError(null); // Xoá lỗi cũ nếu có
            }

            setOrders(filteredOrders);
        } catch (err) {
            setError("Không có dữ liệu!");
            setOrders([]); // Đảm bảo không hiển thị dữ liệu cũ
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };
    


    const loadDataBacsi = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/getallbs");
            setDatabacsi(response.data);
        } catch (err) {
            console.error("Error fetching bác sĩ data:", err);
        }
    };

    const loadDataRoom = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/getallphongkham"
            );
            setDataphongkham(response.data);
        } catch (err) {
            console.error("Error fetching phòng khám data:", err);
        }
    };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    const statusToSend = 4;
    if ( !noi_dung_huy || !ghi_chu) {
      toast.error("Vui lòng nhập thông tin hủy lịch khám");
    } else {
      if (window.confirm("Bạn có muốn hủy lịch khám?")) {
        axios.put(`http://localhost:5000/api/cancelAppointment/${id_lich_kham}`, {
          trang_thai:statusToSend ,noi_dung_huy,ghi_chu
        }).then(() => {
          setState(initialState);
          toast.success("Hủy lịch khám thành công!");
          setTimeout(() => navigate("/"), 500);
          setShowCancelModal(false);
        }).catch((err) => toast.error(err.response.data));
      }
    }
  }

    useEffect(() => {
    if (idUser) {
        loadData();
    }
    }, [idUser]);

    useEffect(() => {
        if (user?.id) {
            loadDataRoom();
            loadDataBacsi();
        }
    }, [user]);


    // Format currency
    const formatCurrency = (number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(number);
    };

    const convertTimeFormat = (time) => {
        if (!time) {
            console.error("Time is undefined or null");
            return ""; // Hoặc giá trị mặc định nếu time không tồn tại
        }

        const timeString = String(time);
        const [hours, minutes] = timeString.split(":");
        return `${hours}:${minutes}`;
    }


    return (
        <Fragment>
            <div className="container-cart">
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Error message={error} />
                ) : (
                    <div className='layout-order'>
                        {orders.map((order) => (
                            <div key={order.ma_don_hang} className="order-section">
                                <div className="address-details">
                                    <h3><i className=""></i> Thông tin cá nhân</h3>
                                    <div className="address-item">
                                        <label>Tên bệnh nhân:</label>
                                        <span>{order.ho_ten_bn}</span>
                                    </div>
                                    <div className="address-item">
                                        <label>Số điện thoại:</label>
                                        <span>{order.sdt_bn}</span>
                                    </div>
                                    <div className="address-item">
                                        <label>Địa chỉ chi tiết:</label>
                                        <span>{order.dia_chi_bn}</span>
                                    </div>
                                    <div className="address-item">
                                        <label>Trạng thái:</label>
                                        <span> <td>
                                        {parseInt(order.trang_thai) === 1 
                                            ? "Dịch vụ khám của bạn đang đợi xác nhận" 
                                            : parseInt(order.trang_thai) === 2 
                                            ? "Bác sĩ đã xắp xếp lịch khám cho bạn" 
                                            : "Bác sĩ đang xắp xếp lịch khám"}
                                        </td>
                                        </span>
                                    </div>
                                    <div className="address-item">
                                    <label>Ngày khám:</label>
                                    <span>{order.ngay_kham ? formatDate(order.ngay_kham) : "Chưa có"}</span>
                                    </div>

                                    <div className="address-item">
                                    <label>Giờ khám:</label>
                                    <span>{order.gio_kham ? convertTimeFormat(order.gio_kham) : "Chưa có"}</span>
                                    </div>

                                    <div className="address-item">
                                        <label>Bác sĩ khám bệnh:</label>
                                        <span>
                                            {
                                                databacsi.find((bs) => bs.id_bac_si === order.id_bac_si)?.ho_ten || "Chưa có"
                                            }
                                        </span>
                                    </div>
                                    <div className="address-item">
                                        <label>Phòng khám:</label>
                                        <span>
                                            {
                                                (() => {
                                                    const phong = dataphong.find((phong) => phong.id_phong_kham === order.id_phong_kham);
                                                    return phong ? `Số phòng:${phong.so_phong} - ${phong.ten_phong_kham}` : "Chưa có";
                                                })()
                                            }
                                        </span>
                                    </div>
                                     <div class="address-item-button">
                                        <button onClick={() =>{ setSelectedLichKhamId(order.id_lich_kham);  setShowCancelModal(true);}} class="btn-huylichkham">Hủy lịch khám bệnh</button>
                                      <button className="btn-lienhephongkham" onClick={() => setDaHien(!daHien)}>
                                       {daHien ? <><FaPhone /> 0976516898</> : "Liên hệ phòng khám"}
                                      </button>
                                    </div>
                                </div>
                                <div className="product-table">
                                    {order.orderDetails.length > 0 ? (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Tên dịch vụ khám</th>
                                                    <th>Ảnh dịch vụ khám</th>
                                                    <th>Số Lượng</th>
                                                    <th>Thành Tiền</th>
                                                    {/* <th>Thao tác</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.orderDetails.map((item) => (
                                                    <tr key={item.ma_chi_tiet_don_hang}>
                                                        <td className="table-cart-1">{item.ten_dich_vu}</td>
                                                        <td>
                                                            <img 
                                                                src={item.hinh_anh_dv} 
                                                                className="product-image" 
                                                                alt="Product" 
                                                                loading="lazy" // Lazy load image
                                                            />
                                                        </td>
                                                        <td>{item.so_luong}</td>
                                                        <td>{formatCurrency(item.gia)}</td>
                                                        {/* <td><i className="fas fa-pen"></i></td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="no-orders">
                                            <p style={{textAlign:'center' ,fontSize:'20px',marginTop:'40px'}} p>Hiện chưa có dịch vụ nào được đặt.</p>
                                        </div>
                                    )}


                                    {showCancelModal && (
                                    <form onSubmit={handleSubmit} class="cancel-modal-custom">
                                        <div class="cancel-modal-header">
                                            <span>Lý Do Hủy</span>
                                            <span onClick={()=>{setShowCancelModal(false);}} class="cancel-modal-close">×</span>
                                        </div>
                                        <div class="cancel-modal-body">
                                            <label class="cancel-option">
                                            <input onChange={handleInputChange} type="radio" name="noi_dung_huy" value="Tôi bị trùng lịch, không thể đến khám"/>
                                            Tôi bị trùng lịch, không thể đến khám
                                            </label>
                                            <label class="cancel-option">
                                            <input onChange={handleInputChange} type="radio" name="noi_dung_huy" value="Tôi muốn đặt lại vào khung giờ khác"/>
                                            Tôi muốn đặt lại vào khung giờ khác
                                            </label>
                                            <label class="cancel-option">
                                            <input onChange={handleInputChange} type="radio" name="noi_dung_huy" value="Tôi đã khỏi bệnh, không cần khám nữa"/>
                                            Tôi đã khỏi bệnh, không cần khám nữa
                                            </label>
                                            <label class="cancel-option">
                                            <input onChange={handleInputChange} type="radio" name="noi_dung_huy" value="Bác sĩ/phòng khám thay đổi lịch"/>
                                            Bác sĩ/phòng khám thay đổi lịch
                                            </label>
                                            <label class="cancel-option">
                                            <input onChange={handleInputChange} type="radio" name="noi_dung_huy" value="Lý do khác"/>
                                            Lý do khác
                                            </label>
                                            <input onChange={handleInputChange} style={{width:'750px', height:'50px'}} type="text" name='ghi_chu' placeholder='Nhập nội dung...' />
                                        </div>
                                        <div class="cancel-modal-footer">
                                            <button class="cancel-confirm-btn" >Xác nhận</button>
                                        </div>
                                    </form>
                                    )}

                                    <div className="product-table-custom-summary">
                                    <h2 className="product-table-custom-title">Tổng quan</h2>
                                    <div className="product-table-custom-info">
                                        <p><strong>Số lượng:</strong> {order.orderDetails.length} dịch vụ</p>
                                        <p><strong>Tổng tiền:</strong> {formatCurrency(order.tong_tien , 0)}</p>
                                    </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Fragment>
    );
}
