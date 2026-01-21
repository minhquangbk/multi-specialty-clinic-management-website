const db = require('../config/config');

const Order = {
    addOrder: (orderData, callback) => {
        const {
            id_benh_nhan, ngay_dat_lich, tong_tien, trang_thai, ho_ten_bn, dia_chi, ghi_chu, sdt_bn,ngay_sinh,gioi_tinh,loai_thanh_toan,trang_thai_thanh_toan, chi_tiet_lich_kham
        } = orderData;

        const insertAppointmentQuery = `
            INSERT INTO lich_kham 
            (id_benh_nhan, ngay_dat_lich, ghi_chu, ho_ten_bn, sdt_bn, dia_chi_bn, trang_thai , tong_tien,ngay_sinh,gioi_tinh,loai_thanh_toan,trang_thai_thanh_toan)
            VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)
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

                // Thêm dữ liệu vào bảng lich_kham
                connection.query(insertAppointmentQuery,[id_benh_nhan, ngay_dat_lich, ghi_chu, ho_ten_bn, sdt_bn, dia_chi, trang_thai ,tong_tien,ngay_sinh,gioi_tinh,loai_thanh_toan,trang_thai_thanh_toan],
                    (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(err);
                            });
                        }

                        const id_lich_kham = result.insertId;

                        const insertAppointmentDetailsQuery = `
                            INSERT INTO chi_tiet_lich_kham 
                            (id_lich_kham, id_dich_vu, ten_dich_vu, so_luong,id_khoa, gia, hinh_anh_dv)
                            VALUES ?
                        `;

                        const appointmentDetailsValues = chi_tiet_lich_kham?.map((item) => [
                            id_lich_kham,
                            item.id_dich_vu,
                            item.ten_dich_vu,
                            item.so_luong,
                            item.id_khoa,
                            item.gia,
                            item.hinh_anh_dv
                        ]);

                        connection.query(insertAppointmentDetailsQuery, [appointmentDetailsValues], (err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(err);
                                });
                            }

                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        callback(err);
                                    });
                                }

                                connection.release();
                                callback(null, "Thêm lịch khám thành công");
                            });
                        });
                    }
                );
            });
        });
    }
};

module.exports = Order;

