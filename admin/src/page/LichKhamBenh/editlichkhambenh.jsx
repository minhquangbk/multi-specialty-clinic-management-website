import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const initialState = {
    ho_ten_bn: "",
    ngay_dat_lich: "",
    tong_tien: "",
    trang_thai: "",
    dia_chi_bn: "",
    ghi_chu: "",
    sdt_bn: "",
    ngay_kham: "",
    id_bac_si: "",
    id_phong_kham: "",
    chuyen_khoa: "",
    phong_kham:"",
    gio_kham:"",
    loai_thanh_toan:"BuyLate",
    trang_thai_thanh_toan:1,
    noi_dung_huy:""
};

export default function EditLichKhamBenh() {
    const [state, setState] = useState(initialState);
    const [dsBacSi, setDsBacSi] = useState([]);
    const [dsKhoa, setDsKhoa] = useState([]);
    const [dsPhong , setDsPhong]= useState([]);
    const [dataservice , setDataService]= useState([]);
    const [datathuoc, setDatathuoc] = useState([]);
    const [databenhan, setDatabenhan] = useState([]);

    const { ho_ten_bn, ngay_dat_lich, trang_thai, dia_chi_bn, ghi_chu, sdt_bn, ngay_kham, id_bac_si, id_phong_kham, chuyen_khoa,gio_kham,tong_tien,loai_thanh_toan,noi_dung_huy ,trang_thai_thanh_toan} = state;
    const { id_lich_kham } = useParams();
    const navigate = useNavigate();

    // Lấy thông tin lịch khám và danh sách bác sĩ theo khoa ban đầu
    useEffect(() => {
        axios.get(`http://localhost:5000/api/getlk/${id_lich_kham}`)
            .then((resp) => {
                const data = resp.data?.[0];
                if (data) {
                    setState(data);
                    if (data.chuyen_khoa) {
                        fetchDoctorsByKhoa(data.chuyen_khoa);
                    }
                    if(data.chuyen_khoa){
                        fetchRoomByKhoa(data.chuyen_khoa);
                    }
                }
            })
            .catch(() => toast.error("Không thể lấy thông tin lịch khám"));
    }, [id_lich_kham]);
    

    useEffect(() => {
    if (!state.id_lich_kham) return;

    const key = `paid_${state.id_lich_kham}`;
    let shouldSetTongTien = false;

    if (
        (state.loai_thanh_toan === "QrPay" || state.loai_thanh_toan === "VnPay") &&
        state.trang_thai_thanh_toan === 2
    ) {
        shouldSetTongTien = true;
    }

    if (
        state.loai_thanh_toan === "BuyLate" &&
        state.trang_thai_thanh_toan === 2
    ) {
        shouldSetTongTien = true;
    }

    const valueToStore = shouldSetTongTien ? state.tong_tien : 0;
    localStorage.setItem(key, valueToStore);
    console.log("Đã lưu vào localStorage:", valueToStore);
    }, [state.id_lich_kham,state.loai_thanh_toan,state.trang_thai_thanh_toan,state.tong_tien
    ]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getctbillthuoc/${id_lich_kham}`)
            .then((resp) => setDatathuoc(resp.data))
            .catch((error) => console.error(error));

    }, [id_lich_kham]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getcthosobenhan/${id_lich_kham}`)
            .then((resp) => setDatabenhan(resp.data))
            .catch((error) => console.error(error));

    }, [id_lich_kham]);

    // Lấy danh sách khoa
    useEffect(() => {
        axios.get('http://localhost:5000/api/getalldmkhoa')
            .then((resp) => setDsKhoa(resp.data))
            .catch(() => toast.error("Không thể lấy danh sách khoa"));
    }, []);

    // Lấy danh sách bác sĩ theo id_khoa
    const fetchDoctorsByKhoa = (id_khoa) => {
        axios.get(`http://localhost:5000/api/getdoctors/${id_khoa}`)
            .then((resp) => setDsBacSi(resp.data))
            .catch(() => toast.error("Không thể lấy danh sách bác sĩ"));
    };

       // Lấy danh sách phòng theo id_khoa
       const fetchRoomByKhoa = (id_khoa) => {
        axios.get(`http://localhost:5000/api/getphongkhambydepartment/${id_khoa}`)
            .then((resp) => {
                setDsPhong(resp.data); // Set danh sách phòng
                if (resp.data.length > 0) {
                    // Giả sử bạn muốn chọn phòng đầu tiên trong danh sách làm phòng mặc định
                    setState(prevState => ({
                        ...prevState,
                        id_phong_kham: resp.data[0].id_phong_kham // Cập nhật id_phong_kham vào state
                    }));
                }
            })
            .catch(() => toast.error("Không thể lấy danh sách phòng"));
    };

    // Xử lý thay đổi chọn chuyên khoa
    const handleKhoaChange = (e) => {
        const selectedKhoa = e.target.value;
        setState({ ...state, chuyen_khoa: selectedKhoa });
        fetchDoctorsByKhoa(selectedKhoa); // Lấy danh sách bác sĩ theo chuyên khoa
        fetchRoomByKhoa(selectedKhoa);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!trang_thai) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
        } else {
            if (window.confirm("Bạn có muốn cập nhật thông tin?")) {
                const datengaykham = new Date(ngay_kham);
                datengaykham.setMinutes(datengaykham.getMinutes() - datengaykham.getTimezoneOffset());
                const formattedNgayKham = datengaykham.toISOString().split('T')[0];
                console.log(formattedNgayKham)
                axios.put(`http://localhost:5000/api/updatelk/${id_lich_kham}`, { trang_thai ,gio_kham , ngay_kham:formattedNgayKham ,chuyen_khoa ,id_phong_kham,id_bac_si,loai_thanh_toan,trang_thai_thanh_toan})
                    .then(() => {
                        setState({ trang_thai: "",gio_kham:"",ngay_kham:"",chuyen_khoa:"",id_phong_kham:"",id_bac_si:"" });
                        toast.success("Cập nhật lịch khám thành công!");
                        setTimeout(() => navigate("/Indexlichkham"), 500);
                    })
                    .catch((err) => toast.error(err.response.data));
            }
        }
    }
    console.log( trang_thai ,gio_kham ,ngay_kham ,chuyen_khoa ,id_phong_kham,id_bac_si);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getalllk");
                const data = await response.json(); 

                const serviceUsed = data.some(item => item.id_lich_kham === state.id_lich_kham);

                setState(prevState => ({
                    ...prevState,
                    dich_vu: serviceUsed ? "Khách hàng đã sử dụng dịch vụ khám" : "Khách hàng chưa sử dụng dịch vụ khám"
                }));
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        if (state.id_lich_kham) fetchServices(); 
    }, [state.id_lich_kham]);

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }; 
    const convertTimeFormat = (time) => {
        if (!time) {
            console.error("Time is undefined or null");
            return ""; // Hoặc giá trị mặc định nếu time không tồn tại
        }
        
        // Đảm bảo time là chuỗi trước khi gọi split
        const timeString = String(time);
        const [hours, minutes] = timeString.split(":");
        
        // Thêm xử lý logic nếu cần
        return `${hours}:${minutes}`;
    };
    
    const processLichKham = (ngay_kham) => {
        if (ngay_kham) {
            // Nếu có ngày khám, định dạng ngày
            const date = new Date(ngay_kham);
            return `${date.toLocaleDateString("en-GB")}`; // Định dạng dd/mm/yyyy
        }
    
        // Nếu không có ngày khám, yêu cầu sắp xếp lịch
        return "vui lòng sắp xếp lịch khám!";
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);// Chuyển đổi date thành múi giờ UTC và lấy phần ngày mà không bị ảnh hưởng múi giờ
        const year = date.getFullYear();//Lấy năm
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng
        const day = date.getDate().toString().padStart(2, '0');//Lấy ngày
        return `${year}-${month}-${day}`;
      };

      useEffect(() => {
        // Thay đổi cách lấy dữ liệu thành một mảng
        axios.get(`http://localhost:5000/api/getctlk/${id_lich_kham}`)
            .then((resp) => setDataService(resp.data))
            .catch((error) => console.error(error));

    }, [id_lich_kham]);

      const handlePrintInvoice = () => {

        // Hàm hỗ trợ để lấy tên từ danh sách dựa trên id
            const getTenKhoa = (id) => {
                const khoa = dsKhoa.find((item) => item.id_khoa === id);
                return khoa ? khoa.ten_khoa : "Không xác định";
            };

            const getTenBacSi = (id) => {
                const bacSi = dsBacSi.find((item) => item.id_bac_si === id);
                return bacSi ? bacSi.ho_ten : "Không xác định";
            };

            const getTenPhong = (id) => {
                    const phong = dsPhong.find((item) => item.id_phong_kham === id);
                    return phong ? `${phong.ten_phong_kham} (Phòng: ${String(phong.so_phong).padStart(2, '0')})` : "Không xác định";
            };

            const tinhTienConThieu = () => {
            const daThanhToan = parseFloat(localStorage.getItem(`paid_${id_lich_kham}`));
            const tongMoi = parseFloat(tong_tien);

            if (!isNaN(daThanhToan) && !isNaN(tongMoi)) {
                const conThieu = tongMoi - daThanhToan;
                return conThieu > 0 ? conThieu : 0;
            }
            return 0;
        };

        const invoiceContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
            <div style="text-align: center;">
                <img src="../Images/Untitled-1.png" alt="Logo Phòng Khám" style="max-width: 200px;" />
                <h1>Phòng khám Đa khoa </h1>
            </div>
            <h2 style="text-align: center;">Phiếu khám bệnh</h2>
            <p><strong>Tên bệnh nhân:</strong> ${ho_ten_bn}</p>
            <p><strong>Số điện thoại:</strong> ${sdt_bn}</p>
            <p><strong>Địa chỉ:</strong> ${dia_chi_bn}</p>
            <p><strong>Ngày khám:</strong> ${processLichKham(ngay_kham)}</p>
            <p><strong>Giờ khám:</strong> ${convertTimeFormat(gio_kham)}</p>
            <p><strong>Phòng khám:</strong> ${getTenPhong(id_phong_kham)}</p>
            <p><strong>Chuyên khoa:</strong> ${getTenKhoa(chuyen_khoa)}</p>
            <p><strong>Bác sĩ khám bệnh:</strong> ${getTenBacSi(id_bac_si)}</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 60%;">Tên dịch vụ</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Số lượng</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                ${dataservice.map(service => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.ten_dich_vu}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.so_luong}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${formatCurrency(service.gia)}</td>
                </tr>
                `).join("")}
            </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 60%;">Tên thuốc</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Số lượng</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                ${datathuoc.map(thuoc => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${thuoc.ten_thuoc}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${thuoc.so_luong}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${formatCurrency(thuoc.gia * thuoc.so_luong)}</td>
                </tr>
                `).join("")}
            </tbody>
            </table>

            <h4 style="text-align: right; margin-top: 20px">Tổng tiền: ${formatCurrency(tong_tien)} </h4>
            <h4 style="text-align: right; margin-top: 20px">Đã thanh toán: ${formatCurrency(localStorage.getItem(`paid_${id_lich_kham}`))}</h4>
            <h4 style="text-align: right; margin-top: 20px; margin-bottom: 120px;">Còn thiếu: ${formatCurrency(tinhTienConThieu())}</h4>
            <h2 style="text-align: center;">Kết quả khám và hướng dẫn điều trị</h2>
            <p><strong>Tiền sử bệnh: </strong>${databenhan[0]?.tien_su_benh}</p>
            <p><strong>Triệu chứng: </strong>${databenhan[0]?.trieu_chung}</p>
            <p><strong>Chuẩn đoán: </strong>${databenhan[0]?.chan_doan}</p>
            <p><strong>Phương pháp điều trị: </strong>${databenhan[0]?.phuong_phap_dieu_tri}</p>
            <p><strong>Lời dặn của bác sĩ: </strong>${databenhan[0]?.ghi_chu}</p>
            <div style="display: flex; justify-content: space-between; text-align: center; margin-top:50px;">

                <div>
                    <p style="font-weight: bold;">KHÁCH HÀNG</p>
                    <p style="font-style: italic;">(Ký và ghi rõ họ tên)</p>
                </div>
                <div>
                    <p style="font-weight: bold;">KẾ TOÁN</p>
                    <p style="font-style: italic;">(Ký và ghi rõ họ tên)</p>
                </div>
                <div>
                    <p style="font-weight: bold;">BÁC SĨ</p>
                    <p style="font-style: italic;">(Ký và ghi rõ họ tên)</p>
                </div>
            </div>
        </div>
    `;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    };

    const handlePrintInvoiceBHYT = () => {
        const getTenKhoa = (id) => {
            const khoa = dsKhoa.find((item) => item.id_khoa === id);
            return khoa ? khoa.ten_khoa : "Không xác định";
        };

        const getTenBacSi = (id) => {
            const bacSi = dsBacSi.find((item) => item.id_bac_si === id);
            return bacSi ? bacSi.ho_ten : "Không xác định";
        };

        const getTenPhong = (id) => {
            const phong = dsPhong.find((item) => item.id_phong_kham === id);
            return phong ? `${phong.ten_phong_kham} (Phòng: ${String(phong.so_phong).padStart(2, '0')})` : "Không xác định";
        };

        // Tính tổng tiền thuốc gốc và BHYT chi trả
        let tongThuocGoc = 0;
        let tongThuocBHYT = 0;

        datathuoc.forEach((thuoc) => {
            const thanhTienGoc = thuoc.gia * thuoc.so_luong;
            const bhytTra = thanhTienGoc * 0.5;
            tongThuocGoc += thanhTienGoc;
            tongThuocBHYT += bhytTra;
        });

        const tinhTienConThieu = () => {
            const daThanhToan = parseFloat(localStorage.getItem(`paid_${id_lich_kham}`));
            const tongSauBHYT = tong_tien - tongThuocBHYT;
            if (!isNaN(daThanhToan) && !isNaN(tongSauBHYT)) {
                const conThieu = tongSauBHYT - daThanhToan;
                return conThieu > 0 ? conThieu : 0;
            }
            return 0;
        }

        const invoiceContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
            <div style="text-align: center;">
                <img src="../Images/Untitled-1.png" alt="Logo Phòng Khám" style="max-width: 100px;" />
                <h1>Phòng khám Đa khoa </h1>
            </div>
            <h2 style="text-align: center;">Phiếu khám bệnh</h2>
            <p><strong>Tên bệnh nhân:</strong> ${ho_ten_bn}</p>
            <p><strong>Số điện thoại:</strong> ${sdt_bn}</p>
            <p><strong>Địa chỉ:</strong> ${dia_chi_bn}</p>
            <p><strong>Ngày khám:</strong> ${processLichKham(ngay_kham)}</p>
            <p><strong>Giờ khám:</strong> ${convertTimeFormat(gio_kham)}</p>
            <p><strong>Phòng khám:</strong> ${getTenPhong(id_phong_kham)}</p>
            <p><strong>Chuyên khoa:</strong> ${getTenKhoa(chuyen_khoa)}</p>
            <p><strong>Bác sĩ khám bệnh:</strong> ${getTenBacSi(id_bac_si)}</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 60%;">Tên dịch vụ</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Số lượng</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                ${dataservice.map(service => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.ten_dich_vu}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.so_luong}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${formatCurrency(service.gia)}</td>
                </tr>
                `).join("")}
            </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 60%;">Tên thuốc</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Số lượng</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Thành tiền (BHYT -50%)</th>
                </tr>
            </thead>
            <tbody>
                ${datathuoc.map(thuoc => {
                    const thanhTien = thuoc.gia * thuoc.so_luong;
                    const bhytTra = thanhTien * 0.5;
                    const benhNhanTra = thanhTien - bhytTra;
                    return `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${thuoc.ten_thuoc}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${thuoc.so_luong}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${formatCurrency(benhNhanTra)}</td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end; margin-top: 30px; margin-bottom: 90px;">
            <table style="font-size: 16px; border-collapse: collapse;">
                <tr>
                <td style="padding: 4px 12px; text-align: right;"><strong>Tổng tiền:</strong></td>
                <td style="padding: 4px 12px;">${formatCurrency(tong_tien)}</td>
                <td style="width: 60px;"></td>
                <td style="padding: 4px 12px; text-align: right;"><strong>Sau BHYT:</strong></td>
                <td style="padding: 4px 12px;">${formatCurrency(tong_tien - tongThuocBHYT)}</td>
                </tr>
                <tr>
                <td style="padding: 4px 12px; text-align: right;"><strong>BHYT chi trả:</strong></td>
                <td style="padding: 4px 12px;">${formatCurrency(tongThuocBHYT)}</td>
                <td></td>
                <td style="padding: 4px 12px; text-align: right;"><strong>Đã thanh toán:</strong></td>
                <td style="padding: 4px 12px;">${formatCurrency(localStorage.getItem(`paid_${id_lich_kham}`))}</td>
                </tr>
                <tr>
                <td colspan="3"></td>
                <td style="padding: 4px 12px; text-align: right;"><strong>Còn thiếu:</strong></td>
                <td style="padding: 4px 12px; font-weight: bold;">${formatCurrency(tinhTienConThieu())}</td>
                </tr>
                <tr>
                <td colspan="3"></td>
                <td style="padding: 4px 12px; text-align: right;"><strong>Còn thừa:</strong></td>
                <td style="padding: 4px 12px; font-weight: bold;">
                    ${formatCurrency(Math.max(localStorage.getItem(`paid_${id_lich_kham}`) - (tong_tien - tongThuocBHYT),0))}
                </td>
                </tr>
            </table>
            </div>

            <h2 style="text-align: center;">Kết quả khám và hướng dẫn điều trị</h2>
            <p><strong>Tiền sử bệnh: </strong>${databenhan[0]?.tien_su_benh}</p>
            <p><strong>Triệu chứng: </strong>${databenhan[0]?.trieu_chung}</p>
            <p><strong>Chuẩn đoán: </strong>${databenhan[0]?.chan_doan}</p>
            <p><strong>Phương pháp điều trị: </strong>${databenhan[0]?.phuong_phap_dieu_tri}</p>
            <p><strong>Lời dặn của bác sĩ: </strong>${databenhan[0]?.ghi_chu}</p>

            <div style="display: flex; justify-content: space-between; text-align: center; margin-top:50px;">
                <div><p style="font-weight: bold;">KHÁCH HÀNG</p><p style="font-style: italic;">(Ký và ghi rõ họ tên)</p></div>
                <div><p style="font-weight: bold;">KẾ TOÁN</p><p style="font-style: italic;">(Ký và ghi rõ họ tên)</p></div>
                <div><p style="font-weight: bold;">BÁC SĨ</p><p style="font-style: italic;">(Ký và ghi rõ họ tên)</p></div>
            </div>
        </div>
        `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    };

    const handlePrintGiayKhamBenh = () => {
    const getTenKhoa = (id) => {
        const khoa = dsKhoa.find((item) => item.id_khoa === id);
        return khoa ? khoa.ten_khoa : "Không xác định";
    };

    const getTenBacSi = (id) => {
        const bacSi = dsBacSi.find((item) => item.id_bac_si === id);
        return bacSi ? bacSi.ho_ten : "Không xác định";
    };

    const getTenPhong = (id) => {
        const phong = dsPhong.find((item) => item.id_phong_kham === id);
        return phong ? `${phong.ten_phong_kham} (Phòng: ${String(phong.so_phong).padStart(2, '0')})` : "Không xác định";
    };

    const content = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
            <div style="text-align: center;">
                <img src="../Images/Untitled-1.png" alt="Logo Phòng Khám" style="max-width: 200px;" />
                <h1>Phòng khám Đa khoa </h1>
            </div>
            <div style="text-align: center;">
                <h2>PHIẾU KHÁM BỆNH</h2>
            </div>
            <p><strong>Tên bệnh nhân:</strong> ${ho_ten_bn}</p>
            <p><strong>Ngày khám:</strong> ${processLichKham(ngay_kham)}</p>
            <p><strong>Giờ khám:</strong> ${convertTimeFormat(gio_kham)}</p>
            <p><strong>Phòng khám:</strong> ${getTenPhong(id_phong_kham)}</p>
            <p><strong>Chuyên khoa:</strong> ${getTenKhoa(chuyen_khoa)}</p>
            <p><strong>Bác sĩ:</strong> ${getTenBacSi(id_bac_si)}</p>
            <p><strong>Ghi chú:</strong> ${ghi_chu || "Không có"}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 60%;">Tên dịch vụ</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Số lượng</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 20%;">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
            ${dataservice.map(service => `
                <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.ten_dich_vu}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.so_luong}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${formatCurrency(service.gia)}</td>
                </tr>
                `).join("")}
                </tbody>
            </table>
            <br><br>
            <div style="text-align: right;">
                <p><i>Ngày in: ${new Date().toLocaleDateString("vi-VN")}</i></p>
            </div>
        </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
    };


    return (
        <div>
            
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Cập nhật lịch khám</h3>
            </div>
            <hr />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Ngày đặt khám</label>
                        <input type="date" name="ngay_dat_lich" className="form-control" onChange={handleInputChange} placeholder="Ngày đặt khám"  value={ngay_dat_lich ? formatDate(ngay_dat_lich) : ""} />
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Ngày khám: {processLichKham(ngay_kham)}</label>
                        <input type="date" name="ngay_kham" className="form-control" onChange={handleInputChange} placeholder="Ngày khám" value={ngay_kham || ""} />
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Giờ khám: {convertTimeFormat(gio_kham)}</label>
                        <select onChange={handleInputChange} value={gio_kham} name='gio_kham' className='form-control'>
                            <option value="">Chọn giờ khám</option>
                            <option value="8:00">8:00 - Sáng</option>
                            <option value="8:30">8:30</option>
                            <option value="9:00">9:00</option>
                            <option value="9:30">9:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="13:30">13:30 - Chiều</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                        </select>
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Tổng tiền</label>
                        <input type="text" name="tong_tien" className="form-control" onChange={handleInputChange} placeholder="Ngày khám" value={formatCurrency(tong_tien) || ""} />
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Tên bệnh nhân</label>
                        <input type="text" name="ho_ten_bn" className="form-control" onChange={handleInputChange} placeholder="Tên bệnh nhân" value={ho_ten_bn || ""} />
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Số điện thoại</label>
                        <input type="text" name="sdt_bn" className="form-control" onChange={handleInputChange} placeholder="Số điện thoại" value={sdt_bn || ""} />
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Địa chỉ</label>
                        <input type="text" name="dia_chi_bn" className="form-control" onChange={handleInputChange} placeholder="Địa chỉ" value={dia_chi_bn || ""} />
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Trạng thái lịch khám</label>
                        <select name="trang_thai" className="form-control" onChange={handleInputChange} value={trang_thai}>
                            <option value="1">Chưa Duyệt</option>
                            <option value="2">Đã Duyệt</option>
                            <option value="3">Đang sắp xếp lịch</option>
                            <option value="4">Khách hàng đã hủy lịch{noi_dung_huy ? ` vì lý do: ${noi_dung_huy}` : ""}</option>
                            <option value="5">Hoàn tất khám bệnh</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Chuyên khoa khám bệnh</label>
                        <select name="chuyen_khoa" className="form-control" onChange={handleKhoaChange} value={chuyen_khoa}>
                        <option value="" disabled>Sắp xếp khoa khám bệnh</option>
                            {dsKhoa.map((khoa) => (
                                <option key={khoa.id_khoa} value={khoa.id_khoa}>
                                    {khoa.ten_khoa}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Phòng khám</label>
                        <select name="id_phong_kham" className="form-control" onChange={handleInputChange} value={id_phong_kham}>
                        <option value="" disabled>Sắp xếp phòng khám</option>
                        {dsPhong.map((phongkham) => (
                                <option key={phongkham.id_phong_kham} value={phongkham.id_phong_kham}>
                                    Phòng số: {phongkham.so_phong}({phongkham.ten_phong_kham})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Bác sĩ</label>
                        <select name="id_bac_si" className="form-control" onChange={handleInputChange} value={id_bac_si}>
                        <option value="" disabled>Sắp xếp bác sĩ khám bệnh</option>
                            {dsBacSi.map((bacSi) => (
                                
                                <option key={bacSi.id_bac_si} value={bacSi.id_bac_si} disabled={bacSi.trang_thai !== 1} > 
                                    {bacSi.ho_ten}  {(bacSi.trang_thai) === 1 ? "" : "(Đang nghỉ phép)"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Dịch vụ</label>
                        <Link to={`/Viewctlk/${id_lich_kham}`}><input type="text" name="dich_vu" className="form-control" onChange={handleInputChange} placeholder="Dịch vụ sử dụng"  value={ state.dich_vu || ""} /></Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Ghi chú của bệnh nhân</label>
                        <input type="text" name="ghi_chu" className="form-control" onChange={handleInputChange} placeholder="Ghi chú" value={ghi_chu || ""} />
                    </div>
                  <div className="col mb-3">
                    <label className="form-label">Trạng thái thanh toán</label>
                    <select
                        name="combined_thanh_toan"
                        className="form-control"
                        value={`${trang_thai_thanh_toan}|${loai_thanh_toan}`}
                        onChange={(e) => {
                        const [trang_thai, loai] = e.target.value.split("|");
                        setState({
                            ...state,
                            trang_thai_thanh_toan: parseInt(trang_thai),
                            loai_thanh_toan: loai
                        });
                        }}
                    >
                        <option value="1|BuyLate">Chưa thanh toán</option>
                        <option value="2|VnPay">Đã thanh toán qua VnPay</option>
                        <option value="2|QrPay">Đã thanh toán qua QrPay</option>
                        <option value="2|BuyLate">Đã thanh toán bằng tiền mặt</option>
                    </select>
                    </div>

                </div>
                <div className="row">
                    <div className="d-grid">
                        <button style={{ marginLeft: '10px', marginTop: '20px',marginBottom:'5px' }} className="btn btn-warning">Cập nhật</button>
                    </div>
                    <div className="d-grid">
                        <button onClick={handlePrintGiayKhamBenh} style={{ marginLeft: '10px', marginTop: '20px',marginBottom:'5px' }} className="btn btn-info">In giấy khám bệnh</button>
                    </div>
                    <div className="d-grid">
                        <button onClick={handlePrintInvoice} style={{ marginLeft: '10px', marginTop: '20px',marginBottom:'5px' }} className="btn btn-primary">In hóa đơn</button>
                    </div>
                    <div className="d-grid">
                        <button onClick={handlePrintInvoiceBHYT} style={{ marginLeft: '10px', marginTop: '20px',marginBottom:'5px' }} className="btn btn-success">In hóa đơn có áp dụng BHYT</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
