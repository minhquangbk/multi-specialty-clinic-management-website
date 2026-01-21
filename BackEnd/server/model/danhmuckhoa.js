const db = require('../config/config');

const Category = {
    getAll: (callback) => {
        const sqlGet = "SELECT * FROM khoa_bac_si";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getById: (id_khoa, callback) => {
        const sqlGet = "SELECT * FROM khoa_bac_si WHERE id_khoa = ?";
        db.query(sqlGet, id_khoa, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    create: (categoryData, callback) => {
        const { ten_khoa , mo_ta } = categoryData;
        const sqlInsert = "INSERT INTO khoa_bac_si (ten_khoa , mo_ta) VALUES (? , ?)";
        db.query(sqlInsert, [ten_khoa , mo_ta], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    update: (id_khoa, categoryData, callback) => {
        const { ten_khoa , mo_ta } = categoryData;
        const sqlUpdate = "UPDATE khoa_bac_si SET ten_khoa = ? , mo_ta = ? WHERE id_khoa = ? ";
        db.query(sqlUpdate, [ten_khoa, mo_ta,id_khoa], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    delete: (id_khoa, callback) => {
        const sqlDelete = "DELETE FROM khoa_bac_si WHERE id_khoa = ?";
        db.query(sqlDelete, id_khoa, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
      // Thêm hàm tìm kiếm gần đúng
      searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM khoa_bac_si WHERE ten_khoa LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

 
};

module.exports = Category;

