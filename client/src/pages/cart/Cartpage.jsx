import React, { Fragment, useEffect, useState ,useContext} from 'react'
import ActiveCart, { LoadData } from '../../until/cartactive';
import axios from "axios";
import { useUser } from '../../until/userContext';
import { toast } from 'react-toastify';
import QRPayment from '../../components/Checkout/Qr';
import { VisibilityContext } from '../../until/visibleContext';
import { useNavigate } from 'react-router-dom';
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "sub-vn"


export default function Cartpage() {

    ActiveCart();
    var list = JSON.parse(localStorage.getItem("cart")) || [];
    const { user } = useUser();
    const navigate = useNavigate();

    //Khởi tạo state chứa các biến đợi
    const [state, setState] = useState({
        ho_ten_bn: '',
        sdt_bn: '',
        dia_chi_bn: '',
        tinh_thanh: '',
        quan_huyen: '',
        phuong_xa: '',
        ghi_chu: '',
        ngay_sinh:'',
        gioi_tinh:'',
        tong_tien:0
    });

    const [coupons, setCoupons] = useState([]);
    const [updateTotalTrigger, setUpdateTotalTrigger] = useState(0);
    const [errors, setErrors] = useState({ ho_ten_bn: '', sdt_bn: '' });
    const [selectedPayment, setSelectedPayment] = useState("BuyLate");
    const [showQR, setShowQR] = useState(false);
    const { isVisible } = useContext(VisibilityContext);
    const [idUser, setIdUser] = useState(null);

    //Lấy địa chỉ theo thành phố - phường - xã
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
         
    const { ho_ten_bn, sdt_bn, dia_chi, ghi_chu,tong_tien,ngay_sinh,gioi_tinh } = state;

    const provinceName = provinces.find(p => p.code === selectedProvince)?.name;
    const districtName = districts.find(d => d.code === selectedDistrict)?.name;
    const wardName = wards.find(w => w.code === selectedWard)?.name;

    console.log(`${wardName}, ${districtName}, ${provinceName}`);

    useEffect(() => {
    setProvinces(getProvinces());
    }, []);

    useEffect(() => {
        if (selectedProvince) {
        setDistricts(getDistrictsByProvinceCode(selectedProvince));
        setSelectedDistrict(""); // reset quận
        setWards([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
        setWards(getWardsByDistrictCode(selectedDistrict));
        setSelectedWard(""); // reset phường
        }
    }, [selectedDistrict]);

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

    //Lấy giá trị của khách hàng nhập vào
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setState({ ...state, [name]: value });
      validateInput(name,value)
    };
    console.log('dữ liệu là : ',selectedPayment)
    
    const handlePayment = (e) =>{
        e.preventDefault();
        
        if (!user) {
            alert("Vui lòng đăng nhập để đặt dịch vụ!");
             navigate("/DangNhap");
            return; // Dừng thực thi hàm nếu chưa đăng nhập
        }

        if (!ho_ten_bn || !sdt_bn || !ngay_sinh || !dia_chi) {
        alert('Vui lòng điền đầy đủ thông tin trước khi tiếp tục.');
        return; // Không tiếp tục nếu có trường dữ liệu thiếu
        }
        
        if(window.confirm("Xác nhận lại thông tin dịch vụ , xác nhận đặt lịch ?")){

            const paymentMethod = selectedPayment;
            const phuong_xa = wardName;
            const quan_huyen = districtName;
            const tinh_thanh = provinceName;
            

            // So sánh giá trị và cập nhật trạng thái
            if (paymentMethod === "QrPay") {
              setShowQR(true);
              if(!isVisible){
                return;
              }
              else{
                const orderData = {
                    id_benh_nhan: idUser, // Thay đổi giá trị này thành ID của khách hàng
                    ngay_dat_lich: new Date().toISOString().slice(0, 10), // Lấy ngày hiện tại
                    tong_tien: tong_tien, // Tổng tiền
                    trang_thai: 1,
                    ho_ten_bn: ho_ten_bn,
                    dia_chi: `${dia_chi}, ${phuong_xa}, ${quan_huyen}, ${tinh_thanh}`,
                    ghi_chu: ghi_chu,
                    sdt_bn: sdt_bn,
                    ngay_sinh:ngay_sinh,
                    gioi_tinh:gioi_tinh,
                    trang_thai_thanh_toan:2,
                    loai_thanh_toan:paymentMethod,
                
                    chi_tiet_lich_kham: list.map(item => ({
                    id_dich_vu: Number(item.id),
                    ten_dich_vu: item.name, 
                    so_luong: item.quantity,
                    id_khoa:item.id_khoa,
                    gia: item.price,
                    hinh_anh_dv:item.img
                    }))
                }
                console.log(orderData)
                axios.post("http://localhost:5000/api/addOrder", orderData)
                .then( () => {setState({ho_ten_bn :"",sdt_bn:"",dia_chi:"",tinh_thanh:"",phuong_xa:"",quan_huyen:"",ghi_chu:"",ngay_sinh:"",gioi_tinh:""})
                    setTimeout(()=>{
                        list = [];
                        const vocher = {coupon_name: "novoucher", value: 0}
                        localStorage.setItem("cart", JSON.stringify(list));
                        localStorage.setItem("coupons", JSON.stringify([]));
                        const savedCoupons = JSON.parse(localStorage.getItem('coupons')) || [];
                        setCoupons(savedCoupons);
                        localStorage.setItem("voucher_sale", JSON.stringify(vocher));
                        LoadData();

                    },25000)
                    setTimeout(() => {
                        toast.success(`Dịch vụ đã được đặt!`, { autoClose: 1000 });
                    }, 30000);

                })
                .catch(error => {
                console.error(error);
                alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
                });
               }
              }

            else if (paymentMethod === "VnPay") {
                setShowQR(false);

                const orderData = {
                    id_benh_nhan: idUser,
                    ngay_dat_lich: new Date().toISOString().slice(0, 10),
                    tong_tien: tong_tien,
                    trang_thai: 1,
                    ho_ten_bn,
                    dia_chi: `${dia_chi}, ${phuong_xa}, ${quan_huyen}, ${tinh_thanh}`,
                    ghi_chu,
                    sdt_bn,
                    ngay_sinh,
                    gioi_tinh,
                    trang_thai_thanh_toan:2,
                    loai_thanh_toan: paymentMethod,
                    chi_tiet_lich_kham: list.map(item => ({
                        id_dich_vu: Number(item.id),
                        ten_dich_vu: item.name,
                        so_luong: item.quantity,
                        id_khoa: item.id_khoa,
                        gia: item.price,
                        hinh_anh_dv: item.img
                    }))
                };

                //Lưu tạm đơn hàng vào localStorage
                localStorage.setItem("pending_order", JSON.stringify(orderData));

                //Tạo link thanh toán VNPay
                axios.post('http://localhost:5000/api/create_payment_url', {
                    amount: tong_tien,
                    language: "vn"
                })
                .then(res => {
                    const paymentUrl = res.data.url;
                    if (paymentUrl) {
                        window.location.href = paymentUrl;
                    } else {
                        alert('Không tạo được link thanh toán VNPay');
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert('Lỗi khi gọi API thanh toán VNPay');
                });
            }

            else if (paymentMethod === "BuyLate") {
                setShowQR(false);
                const orderData = {
                   id_benh_nhan: idUser, // Thay đổi giá trị này thành ID của khách hàng
                   ngay_dat_lich: new Date().toISOString().slice(0, 10), // Lấy ngày hiện tại
                   tong_tien: tong_tien, // Tổng tiền
                   trang_thai: 1,
                   ho_ten_bn: ho_ten_bn,
                   dia_chi: `${dia_chi}, ${phuong_xa}, ${quan_huyen}, ${tinh_thanh}`,
                   ghi_chu: ghi_chu,
                   sdt_bn: sdt_bn,
                   ngay_sinh:ngay_sinh,
                   gioi_tinh:gioi_tinh,
                   trang_thai_thanh_toan:1,
                   loai_thanh_toan:paymentMethod,
               
                   chi_tiet_lich_kham: list.map(item => ({
                   id_dich_vu: Number(item.id),
                   ten_dich_vu: item.name, 
                   so_luong: item.quantity,
                   id_khoa:item.id_khoa,
                   gia: item.price,
                   hinh_anh_dv:item.img
                   }))
               }
               console.log(orderData)
               axios.post("http://localhost:5000/api/addOrder", orderData)
               .then( () => {setState({ho_ten_bn :"",sdt_bn:"",dia_chi:"",tinh_thanh:"",phuong_xa:"",quan_huyen:"",ghi_chu:"",ngay_sinh:"",gioi_tinh:""})

                       list = [];
                       const vocher = {coupon_name: "novoucher", value: 0}
                       localStorage.setItem("cart", JSON.stringify(list));
                       localStorage.setItem("coupons", JSON.stringify([]));
                       const savedCoupons = JSON.parse(localStorage.getItem('coupons')) || [];
                       setCoupons(savedCoupons);
                       localStorage.setItem("voucher_sale", JSON.stringify(vocher));
                       LoadData();
                       toast.success(`Dịch vụ đã được đặt!`, { autoClose: 1000 })
   
               })
               .catch(error => {
               console.error(error);
               alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
               });
           } 
            } 
            
          
    }

    useEffect(() => {
        const tongTienElement = document.querySelector('.btn-pay--price');
        if (tongTienElement) {
          const value = tongTienElement.innerText || tongTienElement.textContent;
          const numberValue = parseInt(value.replace(/[^\d]/g, ''), 10); // Loại bỏ các ký tự không phải số và chuyển đổi sang số nguyên
          setState((prevState) => ({ ...prevState, tong_tien: numberValue }));
        }
    }, [updateTotalTrigger]);
    console.log(tong_tien)

    useEffect(() => {
        // Load phiếu giảm giá từ localStorage
        const savedCoupons = JSON.parse(localStorage.getItem('coupons')) || [];
        setCoupons(savedCoupons);
        const vocher = {coupon_name: "novoucher", value: 0}
        localStorage.setItem("voucher_sale", JSON.stringify(vocher));
     }, []);

     useEffect(() => {
        const savedCoupons = JSON.parse(localStorage.getItem('coupons')) || [];
        setCoupons(savedCoupons);
        const savedVoucher = JSON.parse(localStorage.getItem('voucher_sale')) || { coupon_name: "novoucher", value: 0 };
        // Kiểm tra xem voucher có sẵn không và giữ lại
        if (savedVoucher) {
            // Gọi hàm LoadData nếu cần để cập nhật lại trạng thái
            LoadData();
        }
    }, []);
    
    const handleSelectCoupon = (coupon) => {
        const voucherData = {
            coupon_name: coupon.coupon_name,
            value: coupon.value,
        };
        localStorage.setItem("voucher_sale", JSON.stringify(voucherData));
        LoadData(); // Tải lại dữ liệu voucher sau khi thay đổi
        setUpdateTotalTrigger(prev => prev + 1);
    };
    
      const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value); // Cập nhật giá trị state
      };

      const validateInput = (name, value) => {
        let error = '';
    
        if (name === 'ho_ten_bn') {
            const textRegex = /^[\p{L}\s]*$/u; // Accepts all Unicode letters and spaces, including Vietnamese
            if (!textRegex.test(value.trim()) && value.trim() !== '') {
              error = 'Họ tên phải chứa các kí tự tiếng việt!';
            }
        }  else if (name === 'sdt_bn') {
            const phoneRegex = /^0\d{9}$/; // Allows exactly 10 digits starting with 0
            if (value.trim() !== '' && !phoneRegex.test(value.replace(/\s/g, ''))) {
              error = 'Số điện thoại phải bắt đầu bằng 0 và có 10 số!';
            }
          }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      };
      

  return (
    <Fragment>
        <div className="main">

                {/* <!-- Phần container --> */}
                <div className="cartPage-container">
                    <form className="info">
                        <div className="info-header">
                            <h2>Thông tin đăng ký khám bệnh</h2>
                        </div>
                        <div className="row info-body">
                            <div className="col p-6">
                                <input className="input-name"name="ho_ten_bn" onChange={handleInputChange} value={ho_ten_bn} placeholder="Họ tên" type="text" />
                                {errors.ho_ten_bn && <span className="error-message">{errors.ho_ten_bn}</span>}
                            </div>
                            <div className="col p-6">
                                <input className="input-phone" name="sdt_bn" onChange={handleInputChange} value={sdt_bn} placeholder="Số điện thoại" type="text"/>
                                {errors.sdt_bn && <span className="error-message">{errors.sdt_bn}</span>}
                            </div>
                            <div className="col p-6">
                                <input className="input-date"name="ngay_sinh" onChange={handleInputChange} value={ngay_sinh} type="date" />
                            </div>
                            <div className="col p-6">
                            <select  onChange={handleInputChange} value={gioi_tinh} name="gioi_tinh">
                                    <option value="">Chọn giới tính</option>
                                    <option value="1">Nam</option>
                                    <option value="2">Nữ</option>
                            </select>
                            </div>
                            <div className="col p-12">
                                <input className="input-adress" name="dia_chi" onChange={handleInputChange} value={dia_chi} placeholder="Địa chỉ" type="text"/>
                            </div>

                                <div className="adress col p-4">
                                    <select
                                    className="form-control"
                                    value={selectedProvince}
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                    >
                                    <option value="">Chọn Tỉnh/Thành Phố</option>
                                    {provinces.map((p) => (
                                        <option key={p.code} value={p.code}>{p.name}</option>
                                    ))}
                                    </select>
                                </div>
                                <div className="adress col p-4">
                                    <select
                                    className="form-control"
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    disabled={!selectedProvince}
                                    >
                                    <option value="">Chọn Quận/Huyện</option>
                                    {districts.map((d) => (
                                        <option key={d.code} value={d.code}>{d.name}</option>
                                    ))}
                                    </select>
                                </div>
                                <div className="adress col p-4">
                                    <select
                                    className="form-control"
                                    value={selectedWard}
                                    onChange={(e) => setSelectedWard(e.target.value)}
                                    disabled={!selectedDistrict}
                                    >
                                    <option value="">Chọn Phường/Xã</option>
                                    {wards.map((w) => (
                                        <option key={w.code} value={w.code}>{w.name}</option>
                                    ))}
                                    </select>
                                </div>

                            <div className="col p-12">
                                <input onChange={handleInputChange} value={ghi_chu} name="ghi_chu" className="input-adress" placeholder="Ghi chú thêm" type="text"/>
                            </div>
                        </div>
                        <div className="payments">
                            <h2 className="payments">Hình thức thanh toán
                            </h2>
                            <div className={`payments-item ${(selectedPayment === "BuyLate") ? "active" : ""}`}>
                                    <input
                                    type="radio"
                                    className="check"
                                    name="paymentMethod" // Group name cho các radio
                                    value="BuyLate"
                                    onClick={handlePaymentChange}
                                    />
                                    <img style={{height:'25px',width:'25px',marginRight:"60px"}} src="https://sohala.vn/upload/news/thanh-toan-khi-nhan-hang-6272.jpg" alt="" />
                                    <p className="payments-item__text">Thanh toán sau</p>
                                </div>
                            {/* ZaloPay */}
                                <div className={`payments-item ${(selectedPayment === "ZaloPay") ? "active" : ""}`}>
                                    <input
                                    type="radio"
                                    className="check"
                                    name="paymentMethod" // Group name cho các radio
                                    value="ZaloPay"     
                                    onClick={handlePaymentChange}
                                    />
                                    <img 
                                    style={{ width: "35px", height: "35px", marginRight:"45px"}}
                                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square-1024x1024.png" 
                                    alt="" />
                                    <p className="payments-item__text">Ví điện tử ZaloPay</p>
                                </div>

                            {/* QrPay */}
                                <div  className={`payments-item ${selectedPayment === "QrPay" ? "active" : ""}`}style={{ outline: "none", boxShadow: "none" }}>
                                    <input
                                    type="radio"
                                    className="check"
                                    name="paymentMethod" // Group name phải giống nhau
                                    value="QrPay"
                                    onClick={handlePaymentChange}
                                    />
                                    <img
                                    style={{ width: "35px", height: "35px", marginRight:"45px"}}
                                    src="../Images/icons/icon-qr.jfif"
                                    alt=""
                                    />
                                    <div className="payments-item__text">
                                    <p>Quét QR & Thanh toán bằng ứng dụng ngân hàng</p>
                                    </div>
                                </div>

                                {/* VNPay */}
                                <div className={`payments-item ${(selectedPayment === "VnPay") ? "active" : ""}`}>
                                    <input
                                    type="radio"
                                    className="check"
                                    name="paymentMethod" // Group name phải giống nhau
                                    value="VnPay"
                                    onClick={handlePaymentChange}
                                    />
                                    <img
                                    style={{ width: "55px" }}
                                    src="../Images/icons/Vnpay.png"
                                    alt=""
                                    />
                                    <div className="payments-item__text">
                                    <p>Thẻ ATM / Internet Banking</p>
                                    <p>Thẻ tín dụng (Credit card) / Thẻ ghi nợ (Debit card) VNPay QR</p>
                                    </div>
                                </div>
                            <p style={{paddingLeft: '5px'}}>Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả lại sản phẩm. Tìm hiểu thêm <a style={{fontWeight:'700'}} href="">tại đây</a>.</p>
                            <button type="submit" onClick={handlePayment} className="btn-pay">Thanh toán <span className="btn-pay--price"></span>(<span className="type-payment">ZaloPay</span>)</button>
                        </div>
                    </form>

                    {/* <!-- tạo khuôn đổ dữ liệu --> */}
                    <div className="list-product">
                        <div className="list-product__inner">
                            <h2>Giỏ hàng</h2>
                            <div className="list-product__item">
                                    <div className="list-product__item-img">
                                    <img src="https://media.coolmate.me/uploads/March2022/tshirtxcool-4-copy_160x181.jpg" alt=""/>
                                    </div>

                                    <div className="list-product__item-content">
                                    <div className="list-product__item-name">Áo thun cổ tròn Excool</div>
                                    <div className="list-product__item-type">Đen/L</div>
                                    <div style={{display:'flex', justifyContent: 'flex-start', margin: '28px 0 6px'}} className="">
                                        <div className="single-product-color single-product-select">
                                            <span>Đen</span>
                                            <i className="fa-solid fa-angle-down"></i>
                                        </div>
                                        <div className="single-product-size single-product-select">
                                            <span>L</span>
                                            <i className="fa-solid fa-angle-down"></i>
                                        </div >                          
                                    </div>
                                    <div style={{display:'flex',justifyContent: 'space-between',alignItems: 'center'}}>  
                                        <div className="quantity-product">
                                            <button>
                                                <svg data-v-0d8807a2="" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g data-v-0d8807a2=""><line data-v-0d8807a2="" stroke-width="1.5" id="svg_6" y2="8" x2="10" y1="8" x1="5" stroke="#000000" fill="none"></line></g></svg>
                                            </button>
                                            <span>1</span>
                                            <button>
                                                <svg data-v-0d8807a2="" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g data-v-0d8807a2=""><line data-v-0d8807a2="" stroke-width="1.5" y2="8" x2="12.9695" y1="8" x1="3.0305" stroke="#000000" fill="none"></line> <line data-v-0d8807a2="" stroke-width="1.5" transform="rotate(90, 8, 8)" y2="8" x2="13" y1="8" x1="3" stroke="#000000" fill="none"></line></g></svg>
                                            </button>
                                        </div>
                                        <div className="product-price">
                                            <div className="product-new-price">254.000đ</div>
                                            <div className="product-old-price">299.000đ</div>
                                        </div>
                                    </div>
                                    <div className="list-product__close">
                                        <i className="fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                                </div>
                                
                                
                            </div>   
                        <div className='discount-block'>
                             <div className="coupon-container">
                             {coupons.map((coupon, index) => (
                                <div className="coupon-card" key={index}>
                                    <div className="coupon-header">
                                        <span className="coupon-code">{coupon.coupon_name}</span>
                                        <span className="coupon-remaining">(Còn {coupon.remaining_count})</span>
                                    </div>
                                    <div className="coupon-description">
                                        <p>{coupon.description}</p>
                                        <p style={{ display: "none" }}>{coupon.value}</p>
                                    </div>
                                    <div className="coupon-footer">
                                        <span>HSD: {coupon.expiry_date}</span>
                                        <a href="#" className="coupon-conditions">{coupon.conditions}</a>
                                    </div>
                                    <div className="coupon-radio">
                                        <input onClick={() => handleSelectCoupon(coupon)} type="radio" name="coupon-select" />   
                                    </div>
                                </div>
                            ))}
                            </div>  
                              <div className='discount-box'>
                                    <input data-v-48bbe076 type="text"  placeholder='Nhập mã giảm giá'/>
                                    <button data-v-48bbe076 disabled = "disabled"> Áp dụng</button>
                              </div>
                              <div className='discount-block' style={{ marginTop: '30px' }}>
                                    <p className='discount-heading mb-4'>
                                        Sử dụng Voucher   
                                        <span style={{ marginLeft: '20px' }}>
                                            <button className='text-gray-light cursor-pointer btn-gray'>Nhập mã</button>
                                        </span>
                                    </p>
                              </div>
                              
                        </div>
                        <div style={{    marginTop: '10px'}} className="cost-detail">
                            <span>Tạm tính</span>
                            <span className="tamTinh"></span>
                        </div>
                        <div className="cost-detail">
                            <span>Giảm giá</span>
                            <span className="sale-off">0đ</span>
                        </div>
                        <div className="cost-detail">
                            <span>Phí dịch vụ</span>
                            <span className="delever-cost">Miễn phí</span>
                        </div>
                        <div className="total">
                            <span>Tổng</span>
                            <span className="total__price"></span>
                        </div>        
                        </div>
                       
                    </div>
                    
                </div>
                {showQR && <QRPayment />}
    </Fragment>
  );
}
