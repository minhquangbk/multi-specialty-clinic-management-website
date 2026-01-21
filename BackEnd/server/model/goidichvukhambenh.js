const db = require('../config/config');

const Service = {
    getAll: ({page, pageSize}, callback) => {

        const sqlGet = page ?  `CALL GetServicesByPage(${page}, ${pageSize});` :  "SELECT * FROM dich_vu_kham";

        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    getById: (id_dich_vu, callback) => {
        const sqlGet = "SELECT * FROM dich_vu_kham WHERE id_dich_vu = ?";
        db.query(sqlGet, id_dich_vu, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getByIdKhoa: (id_khoa, callback) => {
        const sqlGet = "SELECT * FROM dich_vu_kham WHERE id_khoa = ?";
        db.query(sqlGet, id_khoa, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    
    create: (serviceData, callback) => {
        const { ten_dich_vu, gia, mo_ta, hinh_anh_dv, loi_ich_kham, huong_dan_kham ,id_khoa} = serviceData;
        const sqlInsert = "INSERT INTO dich_vu_kham (ten_dich_vu, gia, mo_ta, hinh_anh_dv, loi_ich_kham, huong_dan_kham ,id_khoa) VALUES (?, ?, ?, ?, ?, ? ,?)";
        db.query(sqlInsert, [ten_dich_vu, gia, mo_ta, hinh_anh_dv, loi_ich_kham, huong_dan_kham, id_khoa], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    update: (id_dich_vu, serviceData, callback) => {
        const { ten_dich_vu, gia, mo_ta, hinh_anh_dv, loi_ich_kham, huong_dan_kham ,id_khoa , uu_dai} = serviceData;
        const sqlUpdate = "UPDATE dich_vu_kham SET ten_dich_vu = ?, gia = ?, mo_ta = ?, hinh_anh_dv = ?, loi_ich_kham = ?, huong_dan_kham = ? ,id_khoa=? , uu_dai=? WHERE id_dich_vu = ?";
        db.query(sqlUpdate, [ten_dich_vu, gia, mo_ta, hinh_anh_dv, loi_ich_kham, huong_dan_kham,id_khoa,uu_dai, id_dich_vu], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    delete: (id_dich_vu, callback) => {
        const sqlDelete = "DELETE FROM dich_vu_kham WHERE id_dich_vu = ?";
        db.query(sqlDelete, id_dich_vu, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    // Search function with partial matching
    searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM dich_vu_kham WHERE ten_dich_vu LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // For partial matching
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    searchByPriceAndName: (minPrice, maxPrice, name, callback) => {
        let sqlSearch = "SELECT * FROM dich_vu_kham WHERE 1=1";
        let queryParams = [];

        // Nếu min/max đều là số hợp lệ
        if (minPrice != null && maxPrice != null && !isNaN(minPrice) && !isNaN(maxPrice)) {
            sqlSearch += " AND gia BETWEEN ? AND ?";
            queryParams.push(minPrice, maxPrice);
        }

        // Nếu có tên tìm kiếm
        if (name && typeof name === 'string' && name.trim() !== "") {
            sqlSearch += " AND ten_dich_vu LIKE ?";
            queryParams.push(`%${name.trim()}%`);
        }

        db.query(sqlSearch, queryParams, (error, result) => {
            if (error) return callback(error);
            callback(null, result);
        });
    }

    }

module.exports = Service;

