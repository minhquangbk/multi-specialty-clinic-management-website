const db = require('../config/config');

const BenhNhan = {

    getAll: (callback) => {
        const sqlGet = "SELECT * FROM benh_nhan";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    
    getById: (id_benh_nhan, callback) => {
        const sqlGet = "SELECT * FROM benh_nhan WHERE id_benh_nhan = ?";
        db.query(sqlGet, id_benh_nhan, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    create: (benhNhanData, callback) => {
        const { ho_ten, ngay_sinh, gioi_tinh, dia_chi, so_dien_thoai, email, cmnd,hinh_anh_bn } = benhNhanData;
        const sqlInsert = "INSERT INTO benh_nhan (ho_ten, ngay_sinh, gioi_tinh, dia_chi, so_dien_thoai, email, cmnd,hinh_anh_bn) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
        db.query(sqlInsert, [ho_ten, ngay_sinh, gioi_tinh, dia_chi, so_dien_thoai, email, cmnd,hinh_anh_bn], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    update: (id_benh_nhan, benhNhanData, callback) => {
        const { ho_ten, ngay_sinh, gioi_tinh, dia_chi, so_dien_thoai, email, cmnd ,hinh_anh_bn,ngay_vao_kham,ngay_xuat_phong } = benhNhanData;
        const sqlUpdate = "UPDATE benh_nhan SET ho_ten = ?, ngay_sinh = ?, gioi_tinh = ?, dia_chi = ?, so_dien_thoai = ?, email = ?, cmnd = ? ,hinh_anh_bn =?,ngay_vao_kham=?,ngay_xuat_phong=? WHERE id_benh_nhan = ?";
        db.query(sqlUpdate, [ho_ten, ngay_sinh, gioi_tinh, dia_chi, so_dien_thoai, email, cmnd,hinh_anh_bn, ngay_vao_kham,ngay_xuat_phong,id_benh_nhan], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    delete: (id_benh_nhan, callback) => {
        const sqlDelete = "DELETE FROM benh_nhan WHERE id_benh_nhan = ?";
        db.query(sqlDelete, id_benh_nhan, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    
    searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM benh_nhan WHERE ho_ten LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    searchByPhone: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM benh_nhan WHERE so_dien_thoai LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }
};

module.exports = BenhNhan;

