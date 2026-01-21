const db = require('../config/config');

const Appointment = {
    addAppointment: (appointmentData, callback) => {
        const { 
            id_benh_nhan, id_bac_si, id_phong_kham,ngay_dat_lich, ngay_kham, gio_kham, ghi_chu, 
            ho_ten_bn, sdt_bn, dia_chi_bn, ngay_sinh, chuyen_khoa ,trang_thai,gioi_tinh,trang_thai_thanh_toan
        } = appointmentData;

        const insertAppointmentQuery = `
            INSERT INTO lich_kham (id_benh_nhan, id_bac_si, id_phong_kham,ngay_dat_lich, ngay_kham, gio_kham, ghi_chu, 
                                   ho_ten_bn, sdt_bn, dia_chi_bn, ngay_sinh, chuyen_khoa,trang_thai,gioi_tinh,trang_thai_thanh_toan)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
        `;

        db.getConnection((err, connection) => {
            if (err) {
                return callback(err);
            }

            connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    return callback(err);
                }

                connection.query(
                    insertAppointmentQuery,
                    [id_benh_nhan, id_bac_si, id_phong_kham,ngay_dat_lich, ngay_kham, gio_kham, ghi_chu, ho_ten_bn, sdt_bn, dia_chi_bn, ngay_sinh, chuyen_khoa,trang_thai,gioi_tinh,trang_thai_thanh_toan],
                    (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(err);
                            });
                        }

                        const appointmentId = result.insertId;

                        // If you have additional appointment details, add them here with similar logic
                        // Otherwise, commit the transaction

                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(err);
                                });
                            }

                            connection.release();
                            callback(null, "Appointment scheduled successfully");
                        });
                    }
                );
            });
        });
    },

    update: (id_lich_kham, AppointmentData, callback) => {
        const { trang_thai,ghi_chu,noi_dung_huy } = AppointmentData;
        const sqlUpdate = "UPDATE lich_kham SET trang_thai = ?, ghi_chu = ?,noi_dung_huy = ? where id_lich_kham = ? ";
        
        db.query(sqlUpdate, [trang_thai,ghi_chu,noi_dung_huy, id_lich_kham], 
            (error, result) => {
                if (error) {
                    return callback(error);
                }
                callback(null, result);
            }
        );
    },

    create: (lichKhamData, callback) => {
        const {
            id_benh_nhan, id_bac_si, ngay_kham, gio_kham, ghi_chu,
            ho_ten_bn, sdt_bn, dia_chi_bn, ngay_sinh, chuyen_khoa,
            trang_thai, ngay_dat_lich, tong_tien, trang_thai_thanh_toan
        } = lichKhamData;

        const sql = "INSERT INTO lich_kham (id_benh_nhan, id_bac_si, ngay_kham, gio_kham, ghi_chu, ho_ten_bn, sdt_bn, dia_chi_bn, ngay_sinh, chuyen_khoa, trang_thai, ngay_dat_lich, tong_tien, trang_thai_thanh_toan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [
            id_benh_nhan, id_bac_si, ngay_kham, gio_kham, ghi_chu,
            ho_ten_bn, sdt_bn, dia_chi_bn, ngay_sinh, chuyen_khoa,
            trang_thai, ngay_dat_lich, tong_tien, trang_thai_thanh_toan
        ], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    }

};

module.exports = Appointment;

