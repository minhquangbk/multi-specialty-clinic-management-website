const db = require('../config/config.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const benhNhanModel = require('./benhnhan');

const Account = {

    create: (accountData, callback) => {

    const { ten_nguoi_dung, mat_khau, email, sdt, anh_nguoi_dung, type = 2 } = accountData;

    bcrypt.hash(mat_khau, saltRounds, (err, hashedPassword) => {
        if (err) return callback(err);

        const sqlInsert = `
        INSERT INTO tai_khoan (
            ten_nguoi_dung, mat_khau, email, anh_nguoi_dung, sdt, type
        ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(sqlInsert, [ten_nguoi_dung, hashedPassword, email, anh_nguoi_dung, sdt, type], (error, result) => {
        if (error) return callback(error);

        const id_tai_khoan = result.insertId;

        // Tạo hồ sơ bệnh nhân
        const benhNhanData = {
            ho_ten:ten_nguoi_dung,
            so_dien_thoai: sdt,
            email,
        };

        benhNhanModel.create(benhNhanData, (errBN, resBN) => {
            if (errBN) return callback(errBN);

            const id_benh_nhan = resBN.insertId;

            // Thêm bản ghi chi tiết tài khoản
            const sqlChiTiet = `
            INSERT INTO chi_tiet_tai_khoan (id_tai_khoan, id_bac_si, id_benh_nhan, id_loai_tai_khoan)
            VALUES (?, NULL, ?, ?)
            `;

            db.query(sqlChiTiet, [id_tai_khoan, id_benh_nhan, type], (errDetail, resDetail) => {
            if (errDetail) return callback(errDetail);

            return callback(null, {
                tai_khoan_id: id_tai_khoan,
                benh_nhan_id: id_benh_nhan,
                chi_tiet_id: resDetail.insertId
            });
            });
        });
        });
    });
    },

    createWithDetails: (accountData, callback) => {
        const { ten_nguoi_dung, mat_khau, email, anh_nguoi_dung, sdt, type, id_bac_si, id_benh_nhan } = accountData;

        bcrypt.hash(mat_khau, saltRounds, (err, hashedPassword) => {
            if (err) return callback(err);

            const sqlInsertAccount = `
                INSERT INTO tai_khoan (ten_nguoi_dung, mat_khau, email, anh_nguoi_dung, sdt, type)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(sqlInsertAccount, [ten_nguoi_dung, hashedPassword, email, anh_nguoi_dung, sdt, type], (err, result) => {
                if (err) return callback(err);

                const id_tai_khoan = result.insertId;
                const sqlInsertDetails = `
                    INSERT INTO chi_tiet_tai_khoan (id_tai_khoan, id_bac_si, id_benh_nhan, id_loai_tai_khoan)
                    VALUES (?, ?, ?, ?)
                `;

                db.query(sqlInsertDetails, [id_tai_khoan, id_bac_si, id_benh_nhan, type], (err2, result2) => {
                    if (err2) return callback(err2);
                    callback(null, { tai_khoan_id: id_tai_khoan, chi_tiet_id: result2.insertId });
                });
            });
        });
    },
    
    login: (email, mat_khau, callback) => {
        console.log("Email nhận từ client:", email);
    
        const sqlSelect = `SELECT * FROM tai_khoan WHERE email = ?`;
        db.query(sqlSelect, [email], (error, results) => {
            if (error) {
                console.log("Lỗi khi query:", error);
                return callback(error);
            }
    
            if (results.length === 0) {
                console.log("Tài khoản không tồn tại.");
                return callback(null, { message: "Tài khoản không tồn tại." });
            }
    
            const user = results[0];
            console.log("Tài khoản tìm thấy:", user);
    
            bcrypt.compare(mat_khau, user.mat_khau, (err, isMatch) => {
                if (err) {
                    console.log("Lỗi khi so sánh mật khẩu:", err);
                    return callback(err);
                }
                if (!isMatch) {
                    console.log("Mật khẩu không khớp.");
                    return callback(null, { message: "Mật khẩu không chính xác." });
                }
    
                console.log("Đăng nhập thành công");
                // Nếu mật khẩu đúng, trả về thông tin tài khoản
                callback(null, { message: "Đăng nhập thành công.", user });
            });
        });
    },
    getAll: (callback) => {
        const sqlGet = "SELECT * FROM tai_khoan";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    findById : (id_tai_khoan, callback) => {
    const sql = 'SELECT * FROM tai_khoan WHERE id_tai_khoan = ?';
    db.query(sql, [id_tai_khoan], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, null);
        callback(null, results[0]);
    });
    },

    updateById : (id_tai_khoan, ten_nguoi_dung, sdt, newPassword, callback) => {
    let sql = '';
    let values = [];

    if (newPassword) {
        sql = `UPDATE tai_khoan SET ten_nguoi_dung = ?, sdt = ?, mat_khau = ? WHERE id_tai_khoan = ?`;
        values = [ten_nguoi_dung, sdt, newPassword, id_tai_khoan];
    } else {
        sql = `UPDATE tai_khoan SET ten_nguoi_dung = ?, sdt = ? WHERE id_tai_khoan = ?`;
        values = [ten_nguoi_dung, sdt, id_tai_khoan];
    }

    db.query(sql, values, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
    },

    getById: (id_tai_khoan, callback) => {
        const sqlGet = "SELECT * FROM tai_khoan WHERE id_tai_khoan = ?";
        db.query(sqlGet, id_tai_khoan, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    Getinfo: (id_tai_khoan, callback) => {
        const sqlGetDetail = "SELECT * FROM chi_tiet_tai_khoan WHERE id_tai_khoan = ?";
        db.query(sqlGetDetail, [id_tai_khoan], (err, result) => {
            if (err) {
                return callback(err);
            }

            if (result.length === 0) {
                return callback(null, null); // Không tìm thấy chi tiết
            }

            const detail = result[0];
            let id_user = null;

            if (detail.id_loai_tai_khoan === 0 || detail.id_loai_tai_khoan === 1) {
                id_user = detail.id_bac_si;
            } else if (detail.id_loai_tai_khoan === 2) {
                id_user = detail.id_benh_nhan;
            } else {
                return callback(new Error("Loại tài khoản không hợp lệ"));
            }

            return callback(null, { id_user });
        });
    }

};

module.exports = Account;


