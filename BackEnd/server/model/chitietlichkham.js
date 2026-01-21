const db = require('../config/config');
const { getBillByIdBacSi } = require('../controllers/chitietlichkhamController');

const BillCT = {

    getAll: (callback) => {
        const sqlGet = "SELECT * FROM chi_tiet_lich_kham";
        db.query(sqlGet, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getById: (id_lich_kham, callback) => {
        const sqlGet = "SELECT * FROM chi_tiet_lich_kham WHERE id_lich_kham = ?";
        db.query(sqlGet, [id_lich_kham], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getBillByIdBacSi: (id_bac_si, callback) => {
        const sqlGet = "SELECT * FROM lich_kham WHERE id_bac_si = ? ORDER BY ngay_dat_lich DESC";
        db.query(sqlGet, [id_bac_si], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    getTop5ServiceDetails: (callback) => {
        const sql = `
            SELECT sv.*, ctlk.id_dich_vu, SUM(ctlk.so_luong) AS total_quantity
            FROM chi_tiet_lich_kham ctlk
            INNER JOIN dich_vu_kham sv ON ctlk.id_dich_vu = sv.id_dich_vu
            GROUP BY ctlk.id_dich_vu, sv.id_dich_vu
            ORDER BY total_quantity DESC
            LIMIT 5
        `;

        db.query(sql, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    },

    getDetailsByCustomerId :(id_benh_nhan, callback) => {
        // Truy vấn để lấy danh sách lịch khám của khách hàng
        const sqlGetOrders = `
            SELECT id_lich_kham, ho_ten_bn, sdt_bn, dia_chi_bn,trang_thai , ngay_kham ,gio_kham,id_bac_si,id_phong_kham,tong_tien
            FROM lich_kham
            WHERE id_benh_nhan = ?
        `;
    
        db.query(sqlGetOrders, [id_benh_nhan], (error, orders) => {
            if (error) {
                return callback(error);
            }
    
            if (orders.length === 0) {
                return callback(null, []); // Không có đơn hàng nào cho khách hàng này
            }
    
            const orderDetailsPromises = orders.map(order => {
                const sqlGetOrderDetails = `
                    SELECT *
                    FROM chi_tiet_lich_kham
                    WHERE id_lich_kham = ?
                `;
                return new Promise((resolve, reject) => {
                    
                    db.query(sqlGetOrderDetails, [order.id_lich_kham], (error, orderDetails) => {
                        if (error) {
                            return reject(error);
                        }
    
                        resolve({
                            trang_thai:order.trang_thai,
                            id_lich_kham: order.id_lich_kham,
                            ho_ten_bn: order.ho_ten_bn,
                            sdt_bn: order.sdt_bn,
                            dia_chi_bn: order.dia_chi_bn,
                            ngay_kham:order.ngay_kham,
                            gio_kham:order.gio_kham,
                            id_bac_si:order.id_bac_si,
                            id_phong_kham:order.id_phong_kham,
                            tong_tien:order.tong_tien,
                            orderDetails: orderDetails
                        });
                    });
                });
            });
    
            // Chờ tất cả các promise hoàn thành
            Promise.all(orderDetailsPromises)
                .then(results => callback(null, results))
                .catch(error => callback(error));
        });
    },

    create: (chiTietData, callback) => {
        const { id_lich_kham, id_dich_vu, ten_dich_vu, gia, hinh_anh_dv, so_luong, id_khoa } = chiTietData;
        const sqlInsert = "INSERT INTO chi_tiet_lich_kham ( id_lich_kham, id_dich_vu, ten_dich_vu, gia, hinh_anh_dv, so_luong, id_khoa) VALUES ( ?, ?, ?, ?, ?, ?, ?)";
        db.query(sqlInsert, [ id_lich_kham, id_dich_vu, ten_dich_vu, gia, hinh_anh_dv, so_luong, id_khoa], (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

    delete: (id_hoa_don, callback) => {
        const sqlDelete = "DELETE FROM chi_tiet_lich_kham WHERE id_hoa_don = ?";
        db.query(sqlDelete, id_hoa_don, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null, result);
        });
    },

};

module.exports = BillCT;

