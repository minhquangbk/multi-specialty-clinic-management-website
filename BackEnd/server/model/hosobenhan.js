const db = require('../config/config'); // Adjust the path if necessary

const Patient = {
    // Function to get patient and medical records based on id_benh_nhan
    getPatientAndMedicalRecordsById: (id_benh_nhan, callback) => {
        const sqlQuery = `
            SELECT bn.id_benh_nhan, bn.ho_ten, bn.ngay_sinh, bn.gioi_tinh, bn.dia_chi, bn.so_dien_thoai,
                   hsba.id_ho_so, hsba.ngay_lap, hsba.chan_doan, hsba.ghi_chu , hsba.phuong_phap_dieu_tri , hsba.tien_su_benh , hsba.trieu_chung
            FROM benh_nhan bn
            LEFT JOIN ho_so_benh_an hsba ON bn.id_benh_nhan = hsba.id_benh_nhan
            WHERE bn.id_benh_nhan = ? 
            ORDER BY hsba.ngay_lap DESC
        `;
        db.query(sqlQuery, [id_benh_nhan], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getAll: (callback) => {
        const sqlGet = "SELECT * FROM ho_so_benh_an ORDER BY ngay_lap DESC";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    
    // Lấy hồ sơ bệnh án theo ID
    getById: (id_ho_so, callback) => {
        const sqlGet = "SELECT * FROM ho_so_benh_an WHERE id_ho_so = ?";
        db.query(sqlGet, id_ho_so, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Lấy hồ sơ bệnh án theo ID Bác sĩ
    getByIdBacSi: (id_bac_si, callback) => {
        const sqlGet = "SELECT * FROM ho_so_benh_an WHERE id_bac_si = ?  ORDER BY ngay_lap DESC ";
        db.query(sqlGet, id_bac_si, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Lấy đơn thuốc theo ID lịch khám
    getThuocByIdLichKham: (id_lich_kham, callback) => {
        const sqlGet = "SELECT * FROM hoa_don_ban_thuoc WHERE id_lich_kham = ?";
        db.query(sqlGet, [id_lich_kham], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Lấy đơn thuốc theo ID lịch khám
    getByIdLichKham: (id_lich_kham, callback) => {
        const sqlGet = "SELECT * FROM ho_so_benh_an WHERE id_lich_kham = ?";
        db.query(sqlGet, [id_lich_kham], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    
    create: (hoSoBenhAnData, callback) => {
        const { id_benh_nhan, id_bac_si, id_lich_kham, chan_doan, phuong_phap_dieu_tri, ghi_chu, ngay_lap, tien_su_benh, trieu_chung } = hoSoBenhAnData;
        const sqlInsert = `
            INSERT INTO ho_so_benh_an (
                id_benh_nhan, id_bac_si, id_lich_kham, chan_doan, phuong_phap_dieu_tri, ghi_chu, ngay_lap, tien_su_benh, trieu_chung
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sqlInsert, [id_benh_nhan, id_bac_si, id_lich_kham, chan_doan, phuong_phap_dieu_tri, ghi_chu, ngay_lap, tien_su_benh, trieu_chung], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Cập nhật hồ sơ bệnh án
    update: (id_ho_so, hoSoBenhAnData, callback) => {
        const { id_benh_nhan, chan_doan, phuong_phap_dieu_tri, ghi_chu, ngay_lap, tien_su_benh, trieu_chung } = hoSoBenhAnData;
        const sqlUpdate = `
            UPDATE ho_so_benh_an 
            SET id_benh_nhan = ?, chan_doan = ?, phuong_phap_dieu_tri = ?, ghi_chu = ?, ngay_lap = ?, tien_su_benh = ?, trieu_chung = ? 
            WHERE id_ho_so = ?
        `;
        db.query(sqlUpdate, [id_benh_nhan, chan_doan, phuong_phap_dieu_tri, ghi_chu, ngay_lap, tien_su_benh, trieu_chung, id_ho_so], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Xóa hồ sơ bệnh án
    delete: (id_ho_so, callback) => {
        const sqlDelete = "DELETE FROM ho_so_benh_an WHERE id_ho_so = ?";
        db.query(sqlDelete, id_ho_so, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    deletethuoc: (id_hoa_don, callback) => {
        const sqlDelete = "DELETE FROM hoa_don_ban_thuoc WHERE id_hoa_don = ?";
        db.query(sqlDelete, id_hoa_don, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Tìm kiếm hồ sơ bệnh án theo ID bệnh nhân
    searchByBenhNhan: (id_benh_nhan, callback) => {
        const sqlSearch = "SELECT * FROM ho_so_benh_an WHERE id_benh_nhan = ?";
        db.query(sqlSearch, [id_benh_nhan], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    // Lấy hồ sơ bệnh án theo ngày lập
    getByNgayLap: (ngay_lap, callback) => {
        const sqlGetByNgayLap = "SELECT * FROM ho_so_benh_an WHERE ngay_lap = ?";
        db.query(sqlGetByNgayLap, [ngay_lap], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM benh_nhan WHERE ho_ten LIKE ?  ORDER BY ngay_lap DESC";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    createthuocbill: (chiTietData, callback) => {
    const { id_lich_kham, id_thuoc_vat_tu, ten_thuoc, gia, hinh_anh_thuoc, so_luong, ngay_ban } = chiTietData;

    const sqlSelect = "SELECT so_luong FROM thuoc_vat_tu WHERE id_thuoc_vat_tu = ?";
    db.query(sqlSelect, [id_thuoc_vat_tu], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(new Error("Không tìm thấy thuốc"));

        const soLuongHienTai = results[0].so_luong;
        
        if (soLuongHienTai === 0) {
        return callback(new Error("Sản phẩm này đã hết hàng"));
        } else if (soLuongHienTai < so_luong) {
        return callback(new Error("Số lượng trong kho không đủ"));
        }

        const soLuongMoi = soLuongHienTai - so_luong;
        const sqlUpdate = "UPDATE thuoc_vat_tu SET so_luong = ? WHERE id_thuoc_vat_tu = ?";
        db.query(sqlUpdate, [soLuongMoi, id_thuoc_vat_tu], (updateErr) => {
        if (updateErr) return callback(updateErr);

        const sqlInsert = `
            INSERT INTO hoa_don_ban_thuoc 
            (id_lich_kham, id_thuoc_vat_tu, ten_thuoc, gia, hinh_anh_thuoc, so_luong, ngay_ban) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sqlInsert, [id_lich_kham, id_thuoc_vat_tu, ten_thuoc, gia, hinh_anh_thuoc, so_luong, ngay_ban], (insertErr, result) => {
            if (insertErr) return callback(insertErr);
            callback(null, result);
        });
        });
    });
    },


};

module.exports = Patient;

