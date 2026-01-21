const db = require('../config/config');

const PhongKham = {
    getAll: (callback) => {
        const sqlGet = "SELECT * FROM phong_kham";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getById: (id_phong_kham, callback) => {
        const sqlGet = "SELECT * FROM phong_kham WHERE id_phong_kham = ?";
        db.query(sqlGet, id_phong_kham, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    create: (phongKhamData, callback) => {
        const { ten_phong_kham, so_phong, so_dien_thoai, mo_ta, id_khoa } = phongKhamData;
        const sqlInsert = `
            INSERT INTO phong_kham (
                ten_phong_kham, so_phong, so_dien_thoai, mo_ta, id_khoa
            ) VALUES (?, ?, ?, ?, ?)
        `;
        db.query(sqlInsert, [ten_phong_kham, so_phong, so_dien_thoai, mo_ta, id_khoa], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    update: (id_phong_kham, phongKhamData, callback) => {
        const { ten_phong_kham, so_phong, so_dien_thoai, mo_ta, id_khoa } = phongKhamData;
        const sqlUpdate = "UPDATE phong_kham SET ten_phong_kham = ?, so_phong = ?, so_dien_thoai = ?, mo_ta = ?, id_khoa = ? WHERE id_phong_kham = ?";
        
        db.query(sqlUpdate, [ten_phong_kham, so_phong, so_dien_thoai, mo_ta, id_khoa, id_phong_kham], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    delete: (id_phong_kham, callback) => {
        const sqlDelete = "DELETE FROM phong_kham WHERE id_phong_kham = ?";
        db.query(sqlDelete, id_phong_kham, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM phong_kham WHERE ten_phong_kham LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getByDepartment: (id_khoa, callback) => {
        const sqlGetByDepartment = "SELECT * FROM phong_kham WHERE id_khoa = ?";
        db.query(sqlGetByDepartment, [id_khoa], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }
};

module.exports = PhongKham;

