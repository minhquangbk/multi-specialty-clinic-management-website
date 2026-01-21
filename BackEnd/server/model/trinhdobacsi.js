const db = require('../config/config');

const LevelDoctor = {
    getAll: (callback) => {
        const sqlGet = "SELECT * FROM loai_bang_cap";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getById: (id_bang_cap, callback) => {
        const sqlGet = "SELECT * FROM loai_bang_cap WHERE id_bang_cap = ?";
        db.query(sqlGet, id_bang_cap, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    create: (LevelDoctorData, callback) => {
        const { ten_bang_cap} = LevelDoctorData;
        const sqlInsert = "INSERT INTO loai_bang_cap (ten_bang_cap) VALUES (?)";
        db.query(sqlInsert, [ten_bang_cap], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    update: (id_bang_cap, LevelDoctorData, callback) => {
        const { ten_bang_cap} = LevelDoctorData;
        const sqlUpdate = "UPDATE loai_bang_cap SET ten_bang_cap = ? WHERE id_bang_cap = ?";
        db.query(sqlUpdate, [ten_bang_cap,id_bang_cap], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    delete: (id_bang_cap, callback) => {
        const sqlDelete = "DELETE FROM loai_bang_cap WHERE id_bang_cap = ?";
        db.query(sqlDelete, id_bang_cap, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
      // Thêm hàm tìm kiếm gần đúng
      searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM loai_bang_cap WHERE ten_bang_cap LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

 
};

module.exports = LevelDoctor;

