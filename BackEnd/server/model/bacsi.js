const db = require('../config/config');

const BacSi = {

    getAll: (callback) => {
        const sqlGet = "SELECT * FROM bac_si";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getAllOff: (callback) => {
        const sqlGet = "SELECT * FROM nghi_phep";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getById: (id_bac_si, callback) => {
        const sqlGet = "SELECT * FROM bac_si WHERE id_bac_si = ?";
        db.query(sqlGet, id_bac_si, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getByIdOff: (id_bac_si, callback) => {
        const sqlGet = "SELECT * FROM nghi_phep WHERE id_bac_si = ?";
        db.query(sqlGet, id_bac_si, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },


     getByIdNghiPhep: (id_nghi_phep, callback) => {
        const sqlGet = "SELECT * FROM nghi_phep WHERE id_nghi_phep = ?";
        db.query(sqlGet, id_nghi_phep, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    create: (bacSiData, callback) => {
        const { ho_ten, id_khoa, so_dien_thoai, email, dia_chi, id_bang_cap, ngay_vao_lam, hinh_anh_bs, chuc_danh, mo_ta, gioi_tinh, ngay_sinh, cmnd, muc_luong } = bacSiData;
        const sqlInsert = `
            INSERT INTO bac_si (
                ho_ten, id_khoa, so_dien_thoai, email, dia_chi, id_bang_cap, ngay_vao_lam, hinh_anh_bs, chuc_danh, mo_ta, gioi_tinh, ngay_sinh, cmnd, muc_luong
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sqlInsert, [ho_ten, id_khoa, so_dien_thoai, email, dia_chi, id_bang_cap, ngay_vao_lam, hinh_anh_bs, chuc_danh, mo_ta, gioi_tinh, ngay_sinh, cmnd, muc_luong], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    createoff: (bacSiData, callback) => {
        const { id_bac_si, loai_nghi, lydo_nghi, batdau_nghi, ketthuc_nghi, ngay_gui, trang_thai_nghi } = bacSiData;
        
        const sqlInsert = `
            INSERT INTO nghi_phep (
                id_bac_si, loai_nghi, lydo_nghi, batdau_nghi, ketthuc_nghi, ngay_gui, trang_thai_nghi
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.query(sqlInsert, [id_bac_si, loai_nghi, lydo_nghi, batdau_nghi, ketthuc_nghi, ngay_gui, trang_thai_nghi], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    update: (id_bac_si, bacSiData, callback) => {
        const { ho_ten, id_khoa, so_dien_thoai, email, dia_chi, id_bang_cap, hinh_anh_bs, chuc_danh, mo_ta, gioi_tinh,  cmnd, muc_luong } = bacSiData;
        const sqlUpdate = "UPDATE bac_si SET ho_ten = ?, id_khoa = ?, so_dien_thoai = ?, email = ?, dia_chi = ?, id_bang_cap = ?, hinh_anh_bs = ?, chuc_danh = ?, mo_ta = ?, gioi_tinh = ?, cmnd = ?, muc_luong = ? WHERE id_bac_si = ?";
        
        db.query(sqlUpdate, [ho_ten, id_khoa, so_dien_thoai, email, dia_chi, id_bang_cap, hinh_anh_bs, chuc_danh, mo_ta, gioi_tinh, cmnd,muc_luong, id_bac_si], 
            (error, result) => {
                if (error) {
                    return callback(error);
                }
                callback(null, result);
            }
        );
    },

    updateoff: (id_nghi_phep, bacSiData, callback) => {
        const { trang_thai_nghi, id_bac_si } = bacSiData;


        const sqlUpdateNghiPhep = "UPDATE nghi_phep SET trang_thai_nghi = ? WHERE id_nghi_phep = ?";

      
        const sqlUpdateBacSi = "UPDATE bac_si SET trang_thai = 2 WHERE id_bac_si = ?";

        
        db.query(sqlUpdateNghiPhep, [trang_thai_nghi, id_nghi_phep], (error1, result1) => {
            if (error1) return callback(error1);

           
            db.query(sqlUpdateBacSi, [id_bac_si], (error2, result2) => {
                if (error2) return callback(error2);

                callback(null, { result1, result2 }); 
            });
        });
    },

    delete: (id_bac_si, callback) => {
        const sqlDelete = "DELETE FROM bac_si WHERE id_bac_si = ?";
        db.query(sqlDelete, id_bac_si, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    deleteoff: (id_nghi_phep, callback) => {
        const sqlDelete = "DELETE FROM nghi_phep WHERE id_nghi_phep = ?";
        db.query(sqlDelete, id_nghi_phep, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    

    searchByName: (searchTerm, callback) => {
        const sqlSearch = "SELECT * FROM bac_si WHERE ho_ten LIKE ?";
        const formattedSearchTerm = `%${searchTerm}%`; // Tìm kiếm gần đúng
        db.query(sqlSearch, [formattedSearchTerm], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getByDepartment: (id_khoa, callback) => {
        const sqlGetByDepartment = "SELECT * FROM bac_si WHERE id_khoa = ?";
        db.query(sqlGetByDepartment, [id_khoa], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    
    searchByCriteria: (criteria, callback) => {
        const { id_khoa, gioi_tinh, id_bang_cap, searchTerm } = criteria;
    
        // Tạo câu SQL động dựa trên tiêu chí
        let sqlSearch = "SELECT * FROM bac_si WHERE 1 = 1";
        const params = [];
    
        if (id_khoa) {
            sqlSearch += " AND id_khoa = ?";
            params.push(id_khoa);
        }
        if (gioi_tinh) {
            sqlSearch += " AND gioi_tinh = ?";
            params.push(gioi_tinh);
        }
        if (id_bang_cap) {
            sqlSearch += " AND id_bang_cap = ?";
            params.push(id_bang_cap);
        }
        if (searchTerm) {
            sqlSearch += " AND ho_ten LIKE ?";
            params.push(`%${searchTerm}%`);
        }
    
        db.query(sqlSearch, params, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    }
    
};

module.exports = BacSi;

