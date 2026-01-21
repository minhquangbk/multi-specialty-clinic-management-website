import axios from 'axios';
import React, { useState , useEffect } from 'react';
import { useNavigate , useParams , Link} from 'react-router-dom';
import { toast } from 'react-toastify';


const initialState = {
    id_benh_nhan: "",
    chan_doan: "",
    phuong_phap_dieu_tri: "",
    ghi_chu: "",
    ngay_lap: "",
    tien_su_benh: "",
    trieu_chung: ""
};

export default function CreateChuyenTuyen() {
    const [state, setState] = useState(initialState);
    const [datalichkham, setDatalichkham] = useState([]);
    const [benhNhan, setData] = useState({});
   
    console.log(benhNhan)

    const { chan_doan, phuong_phap_dieu_tri, ghi_chu, tien_su_benh, trieu_chung } = state;
    const navigate = useNavigate();
    const { id_lich_kham } = useParams();

        // Lấy thông tin lịch khám và danh sách bác sĩ theo khoa ban đầu
    useEffect(() => {
        axios.get(`http://localhost:5000/api/getlk/${id_lich_kham}`)
            .then((resp) => {
                const data = resp.data?.[0]; 
                setDatalichkham(data);
            })
            .catch(() => toast.error("Không thể lấy thông tin lịch khám"));
    }, [id_lich_kham]);


    useEffect(() => {
    axios.get(`http://localhost:5000/api/getbenhnhan/${datalichkham.id_benh_nhan}`)
      .then((resp) => setData({ ...resp.data[0] }));
    }, [datalichkham.id_benh_nhan]);


    useEffect(() => {
        const savedData = localStorage.getItem("hoSoBenhAnData");
        if (savedData) {
            setState(JSON.parse(savedData));
        }
    }, []);

    const LY_DO_CHUYEN_TUYEN = [
    "Thiết bị không đủ điều kiện",
    "Chuyên môn ngoài phạm vi",
    "Cần can thiệp chuyên sâu",
    "Chuyển viện theo yêu cầu bệnh nhân",
    "Các lý do hành chính khác"
    ];

    const DS_BENH_VIEN = [
        "Bệnh viện Bạch Mai",
        "Bệnh viện Việt Đức",
        "Bệnh viện 108",
        "Bệnh viện Phổi Trung Ương",
        "Bệnh viện Đa khoa tỉnh Hưng Yên",
        "Bệnh viện Sản Nhi Hưng Yên",
        "Bệnh viện Da Liễu Hà Nội"
    ];


const handlePrintChuyenTuyen = () => {
    const ngayHienTai = new Date().toLocaleDateString("vi-VN");

    const getFormattedNow = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');

    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return `${hours} giờ ${minutes} phút, ngày ${day} tháng ${month} năm ${year}`;
    };

    const content = `
    <html>
    <head>
        <title>Hồ sơ chuyển tuyến</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.5; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            td, th { border: 1px solid #ccc; padding: 8px; }
        </style>

        <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.5;
        }
        h4 {
            text-align: center;
            margin: 4px 0;
        }
        .section {
            margin-bottom: 20px;
        }
        .patient-info .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            gap: 40px;
        }
        .patient-info .row > div {
            flex: 1;
        }
        .label {
            font-weight: bold;
            display: inline-block;
            min-width: 100px;
        }
    </style>
    </head>
    <body>
        <div style="text-align: center; font-weight: bold; margin-bottom: 30px">
            <div style="display: flex; justify-content: space-between;">
                <div style="text-align: left;">
                    <div>SỞ Y TẾ HÀ NỘI</div>
                    <div>PHÒNG KHÁM ĐA KHOA </div>
                </div>
                <div style="text-align: right;">
                    <div>Số hồ sơ: 91826253</div>
                    <div>Vào sổ chuyển tuyến số: 03</div>
                </div>
            </div>
            <div style="margin-top: 10px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div style="font-style: italic;">Độc lập - Tự do - Hạnh phúc</div>
            <hr style="margin-top: 10px; margin-bottom: 10px;">
            <div style="text-transform: uppercase; font-size: 16px; margin-bottom: 10px;">
                GIẤY CHUYỂN TUYẾN KHÁM BỆNH, CHỮA BỆNH BẢO HIỂM Y TẾ
            </div>
            <div style="text-align: center; font-size: 18px;">Kính gửi: ${state.benh_vien_tuyen_tren}</div>
        </div>

        <div class="section patient-info">
            <div class="row">
                <div style="width: 100%;"><span class="label">Phòng khám đa khoa xin trân trọng giới thiệu:</div>
            </div>
            <div class="row">
                <div><span class="label">Họ và tên bệnh nhân:</span> ${benhNhan.ho_ten}</div>
                <div><span class="label">Số điện thoại:</span> ${benhNhan.so_dien_thoai}</div>
            </div>
            <div class="row">
                <div><span class="label">Ngày sinh:</span> ${formattedDate}</div>
                <div><span class="label">Giới tính:</span> ${benhNhan.gioi_tinh === 1 ? "Nam" : "Nữ"}</div>
            </div>
            <div class="row">
                <div style="width: 100%;"><span class="label">Địa chỉ:</span> ${benhNhan.dia_chi}</div>
            </div>
            <div class="row">
                <div><span class="label">BHYT số:</span>HN4010156678901</div>
                <div><span class="label">Nghề nghiệp:</span> Lao động tự do</div>
            </div>
            <div class="row">
                <div><span class="label">CMND/CCCD:</span> ${benhNhan.cmnd}</div>
                <div><span class="label">Ngày lập hồ sơ:</span> ${ngayHienTai}</div>
            </div>
        </div>

        <div class="section">
            <h3>Thông tin bệnh án:</h3>
            <p><span class="label">Tiền sử bệnh:</span> ${state.tien_su_benh}</p>
            <p><span class="label">Triệu chứng:</span> ${state.trieu_chung}</p>
            <p><span class="label">Chuẩn đoán:</span> ${state.chan_doan}</p>
            <p><span class="label">Phương pháp điều trị:</span> ${state.phuong_phap_dieu_tri}</p>
            <p><span class="label">Ghi chú:</span> ${state.ghi_chu}</p>
        </div>

        <div style="margin-bottom: 80px" class="section">
            <h3>Thông tin chuyển tuyến:</h3>
            <p><span class="label">Lý do chuyển tuyến:</span> ${state.ly_do_chuyen_tuyen}</p>
             <p><span class="label">Hướng chuyển tuyến:</span> ${state.benh_vien_tuyen_tren}</p>
             <p><span class="label">Chuyển tuyến hồi:</span> ${getFormattedNow()}</p>
        </div>

        <div class="section" style="text-align: right;">
            <p><em>Ngày in: ${ngayHienTai}</em></p>
            <p><strong>Bác sĩ lập hồ sơ</strong></p>
            <p>(Ký và ghi rõ họ tên)</p>
        </div>

        <script>
            window.onload = function () {
                window.print();
                setTimeout(() => window.close(), 500);
            };
        </script>
    </body>
    </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
};


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Cập nhật state
        const updatedState = { ...state, [name]: value };
        setState(updatedState);

        // Lưu vào localStorage
        localStorage.setItem("hoSoBenhAnData", JSON.stringify(updatedState));
    };


    const date = new Date(benhNhan.ngay_sinh);

    const formattedDate = date.toLocaleDateString('en-GB');

    return (
        <div>
            <div style={{marginBottom:'15px'}} className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
                <h3 className="m-0">Hồ sơ chuyển tuyến</h3>
            </div>
            <form onSubmit={handlePrintChuyenTuyen}>
                <div className="row">
                    <div className="col mb-3">
                    <label className="form-label">Họ và Tên</label>
                    <input type="text" name="ho_ten" className="form-control" placeholder="Họ và Tên" value={benhNhan.ho_ten || ''} readOnly />
                    </div>
                    <div className="col mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input type="text" name="so_dien_thoai" className="form-control" placeholder="Số điện thoại" value={benhNhan.so_dien_thoai || ''} readOnly />
                    </div>
                </div>

                <div className="row">
                    <div className="col mb-3">
                    <label className="form-label">Ngày Sinh</label>
                    <input type="text" name="ngay_sinh" className="form-control" placeholder="Ngày Sinh" value={formattedDate || ''} readOnly />
                    </div>
                    <div className="col mb-3">
                    <label className="form-label">Giới Tính</label>
                    <input type="text" name="gioi_tinh" className="form-control" placeholder="Giới Tính" value={benhNhan.gioi_tinh === 2 ? 'Nữ' : benhNhan.gioi_tinh === 1 ? 'Nam' : ''} readOnly />
                    </div>
                </div>

                <div className="row">
                    <div className="col mb-3">
                    <label className="form-label">Địa chỉ</label>
                    <input type="text" name="dia_chi" className="form-control" placeholder="Địa chỉ" value={benhNhan.dia_chi || ''} readOnly />
                    </div>
                    <div className="col mb-3">
                    <label className="form-label">CMND</label>
                    <input type="text" name="cmnd" className="form-control" placeholder="CMND" value={benhNhan.cmnd || ''} readOnly />
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                    <label className="form-label">Bảo hiểm y tế</label>
                    <input type="text" name="bhyt" className="form-control" placeholder="Địa chỉ" value={'HN4010156678901'} readOnly />
                    </div>
                    <div className="col mb-3">
                    <label className="form-label">Nghề Nghiệp</label>
                    <input type="text" name="nghe_nghiep" className="form-control" placeholder="CMND" value={'Lao động tự do'} readOnly />
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

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Lý do chuyển tuyến</label>
                        <select
                            name="ly_do_chuyen_tuyen"
                            className="form-control"
                            value={state.ly_do_chuyen_tuyen}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Chọn lý do --</option>
                            {LY_DO_CHUYEN_TUYEN.map((lydo, index) => (
                                <option key={index} value={lydo}>{lydo}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col">
                        <label className="form-label">Bệnh viện tuyến trên</label>
                        <select
                            name="benh_vien_tuyen_tren"
                            className="form-control"
                            value={state.benh_vien_tuyen_tren}
                            onChange={handleInputChange}
                        >
                            <option value="">-- Chọn bệnh viện --</option>
                            {DS_BENH_VIEN.map((bv, index) => (
                                <option key={index} value={bv}>{bv}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="d-grid">
                        <button onClick={handlePrintChuyenTuyen} style={{ marginLeft: '10px' }} type="submit" className="btn btn-primary">In hồ sơ chuyển tuyến</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
