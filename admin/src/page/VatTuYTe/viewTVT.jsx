import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ViewThuocVatTu() {
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };

    const [thuocVatTu, setData] = useState({});
    const [loaiThuoc, setDataLoaiThuoc] = useState({});
    console.log(loaiThuoc,thuocVatTu)

    const { id_thuoc_vat_tu } = useParams(); // Change variable name for clarity

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getTVTid/${id_thuoc_vat_tu}`)

            .then((resp) =>{ setData({ ...resp.data[0] })

             const id_loai_thuoc = resp.data[0].id_loai_thuoc;
                if (id_loai_thuoc) {
                    axios.get(`http://localhost:5000/api/getloaithuocbyidloaithuoc/${id_loai_thuoc}`)
                        .then((loaithuocResp) => setDataLoaiThuoc(loaithuocResp.data[0]))
                        .catch((error) => console.error('Lỗi lấy thông tin loại thuốc:', error));
                }
        });

    }, [id_thuoc_vat_tu]);

    // Định dạng ngày đúng chuẩn yyyy-MM-dd
        const formatDate = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return date.toISOString().split("T")[0];
        };

    return (
        <div>
            <div className='d-flex  align-items-center'>
            <i className="fas fa-arrow-circle-left" onClick={() => window.history.back()} style={{ fontSize: '24px', color: 'blue', marginRight: '8px' , marginTop:'8px'}}></i>
            <h3 className="mb-0">Thông tin thuốc/vật tư: {thuocVatTu.ten_thuoc}</h3>
            </div>
            <hr />

            <div className="row">
                <img style={{ borderRadius: '10px', marginLeft: '10px' }} src={thuocVatTu.hinh_anh} width='150' height='180' className="img img-responsive" alt={thuocVatTu.ten_thuoc} />
                <div className="col mb-3">
                    <label className="form-label">Mã thuốc/vật tư</label>
                    <input type="text" name="id_thuoc_vat_tu" className="form-control" placeholder="Mã thuốc/vật tư" value={id_thuoc_vat_tu} readOnly />
                </div>
                <div className="col mb-3">
                    <label className="form-label">Giá</label>
                    <input type="text" name="gia" className="form-control" placeholder="Giá" value={formatCurrency(thuocVatTu.gia)} readOnly />
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col mb-3">
                    <label className="form-label">Số lượng</label>
                    <input type="text" name="so_luong" className="form-control" placeholder="Số lượng" value={thuocVatTu.so_luong} readOnly />
                </div>
                <div className="col mb-3">
                    <label className="form-label">Đơn vị</label>
                    <input type="text" name="don_vi" className="form-control" placeholder="Đơn vị" value={thuocVatTu.don_vi} readOnly />
                </div>
            </div>
            <div className="row">
                <div className="col mb-3">
                    <label className="form-label">Loại thuốc</label>
                    <input type="text" name="ten_loai_thuoc" className="form-control" placeholder="Loại thuốc" value={loaiThuoc.ten_loai_thuoc} readOnly />
                </div>
                <div className="col mb-3">
                    <label className="form-label">Ngày thêm</label>
                    <input type="text" name="ngay_them" className="form-control" placeholder="Ngày thêm" value={formatDate(thuocVatTu.ngay_them)} readOnly />
                </div>
            </div>
            <div className="row">
                <div className="col mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea type="text" name="mo_ta" className="form-control" placeholder="Mô tả" value={thuocVatTu.mo_ta} readOnly />
                </div>
            </div>
        </div>
    );
}
