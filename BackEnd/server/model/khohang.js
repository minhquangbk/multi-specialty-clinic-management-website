const db = require('../config/config');

const Warehouse = {
    getAll: (callback) => {
        const sqlGet = "SELECT * FROM kho_thuoc";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getById: (id_kho, callback) => {
        const sqlGet = "SELECT * FROM kho_thuoc WHERE id_kho = ?";
        db.query(sqlGet, id_kho, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    create: (warehouseData, callback) => {
        const { id_thuoc_vat_tu, ten_thuoc_vat_tu, so_luong, ngay_nhap } = warehouseData;
        const sqlInsert = "INSERT INTO kho_thuoc (id_thuoc_vat_tu, ten_thuoc_vat_tu, so_luong, ngay_nhap) VALUES (?, ?, ?, ?)";
        db.query(sqlInsert, [id_thuoc_vat_tu, ten_thuoc_vat_tu, so_luong, ngay_nhap], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    update: (id_kho, warehouseData, callback) => {
        const { id_thuoc_vat_tu, ten_thuoc_vat_tu, so_luong, ngay_nhap } = warehouseData;
        const sqlUpdate = "UPDATE kho_thuoc SET id_thuoc_vat_tu = ?, ten_thuoc_vat_tu = ?, so_luong = ?, ngay_nhap = ? WHERE id_kho = ?";
        db.query(sqlUpdate, [id_thuoc_vat_tu, ten_thuoc_vat_tu, so_luong, ngay_nhap, id_kho], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    delete: (id_kho, callback) => {
        const sqlDelete = "DELETE FROM kho_thuoc WHERE id_kho = ?";
        db.query(sqlDelete, id_kho, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    // Thêm hàm tìm kiếm gần đúng
    searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM kho_thuoc WHERE ten_thuoc_vat_tu LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }
};

module.exports = Warehouse;

