const db = require('../config/config');

const NghiPhep = {

    getAllOff: (callback) => {
        const sqlGet = "SELECT * FROM nghi_phep";
        db.query(sqlGet, (error, result) => {
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

    deleteoff: (id_nghi_phep, callback) => {
        const sqlDelete = "DELETE FROM nghi_phep WHERE id_nghi_phep = ?";
        db.query(sqlDelete, id_nghi_phep, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

};

module.exports = NghiPhep;

