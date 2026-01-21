const db = require('../config/config');


const ThuocVatTu = {
    getAll: (callback) => {
        const sqlGet = "SELECT * FROM thuoc_vat_tu";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getAllLoaiThuoc: (callback) => {
        const sqlGet = "SELECT * FROM danh_muc_loai_thuoc";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getById: (id_thuoc_vat_tu, callback) => {
        const sqlGet = "SELECT * FROM thuoc_vat_tu WHERE id_thuoc_vat_tu = ?";
        db.query(sqlGet, id_thuoc_vat_tu, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getByIdLoaiThuoc: (id_loai_thuoc, callback) => {
        const sqlGet = "SELECT * FROM thuoc_vat_tu WHERE id_loai_thuoc = ?";
        db.query(sqlGet, id_loai_thuoc, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getLoaiThuocByIdLoaiThuoc: (id_loai_thuoc, callback) => {
        const sqlGet = "SELECT * FROM danh_muc_loai_thuoc WHERE id_loai_thuoc = ?";
        db.query(sqlGet, id_loai_thuoc, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    create: (thuocData, callback) => {
        const { ten_thuoc, id_loai_thuoc, so_luong, don_vi, gia, ngay_them, hinh_anh,mo_ta } = thuocData;
        const sqlInsert = "INSERT INTO thuoc_vat_tu (ten_thuoc, id_loai_thuoc, so_luong, don_vi, gia, ngay_them, hinh_anh,mo_ta) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
        db.query(sqlInsert, [ten_thuoc, id_loai_thuoc, so_luong, don_vi, gia, ngay_them, hinh_anh,mo_ta], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    update: (id_thuoc_vat_tu, thuocData, callback) => {
        const { ten_thuoc, id_loai_thuoc, so_luong, don_vi, gia, hinh_anh,ngay_them } = thuocData;
        const sqlUpdate = "UPDATE thuoc_vat_tu SET ten_thuoc = ?, id_loai_thuoc = ?, so_luong = ?, don_vi = ?, gia = ?,  hinh_anh = ?, ngay_them = ? WHERE id_thuoc_vat_tu = ?";
        db.query(sqlUpdate, [ten_thuoc, id_loai_thuoc, so_luong, don_vi, gia, hinh_anh,ngay_them, id_thuoc_vat_tu], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    delete: (id_thuoc_vat_tu, callback) => {
        const sqlDelete = "DELETE FROM thuoc_vat_tu WHERE id_thuoc_vat_tu = ?";
        db.query(sqlDelete, id_thuoc_vat_tu, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    // Search function with partial matching
    searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM thuoc_vat_tu WHERE ten_thuoc LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // For partial matching
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }
};

module.exports = ThuocVatTu;

