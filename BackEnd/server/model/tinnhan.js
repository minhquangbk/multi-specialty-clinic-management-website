const db = require('../config/config');

const Messages = {

    getAll: (callback) => {
        const sqlGet = "SELECT * FROM tin_nhan";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    create: (messagesData, callback) => {
        const { id_nguoi_gui , id_nguoi_nhan , type_nguoi_gui , noi_dung , tg_gui} = messagesData;
        const sqlInsert = `
            INSERT INTO tin_nhan (id_nguoi_gui , id_nguoi_nhan , type_nguoi_gui , noi_dung , tg_gui
            ) VALUES (?,?,?,?,?)
        `;
        db.query(sqlInsert, [id_nguoi_gui , id_nguoi_nhan , type_nguoi_gui , noi_dung , tg_gui], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },
    
};

module.exports = Messages;

