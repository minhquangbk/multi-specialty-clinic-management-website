const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Account = require('../model/taikhoan');

const SECRET_KEY = 'your-secret-key'; // Khóa bí mật dùng để mã hóa token (nên lưu trong biến môi trường thực tế)

exports.loginAccount = (req, res) => {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ email và mật khẩu." });
    }

    Account.login(email, mat_khau, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Đã xảy ra lỗi." });
        }

        if (result.message && result.message !== "Đăng nhập thành công.") {
            return res.status(400).json(result);
        }

        // Nếu đăng nhập thành công, tạo token
        const user = result.user;
        const token = jwt.sign(
            {
                id_tai_khoan: user.id_tai_khoan,
                ten_nguoi_dung: user.ten_nguoi_dung,
                email: user.email,
            },
            SECRET_KEY,
            { expiresIn: '1h' } // Thời gian hết hạn của token là 1 giờ
        );

        // Trả về token cùng với thông tin người dùng
        res.status(200).json({
            message: "Đăng nhập thành công.",
            token: token,
            user: {
                id_tai_khoan: user.id_tai_khoan,
                ten_nguoi_dung: user.ten_nguoi_dung,
                email: user.email,
                type:user.type,
                anh_nguoi_dung:user.anh_nguoi_dung
            },
        });
    });
};

exports.updateAccountById = async (req, res) => {
    const { id_tai_khoan, ten_nguoi_dung, sdt, mat_khau_cu, mat_khau_moi } = req.body;

    if (!id_tai_khoan) {
        return res.status(400).json({ message: "Thiếu ID tài khoản." });
    }

    Account.findById(id_tai_khoan, async (err, user) => {
        if (err) return res.status(500).json({ message: "Lỗi máy chủ." });
        if (!user) return res.status(404).json({ message: "Tài khoản không tồn tại." });

        // Nếu yêu cầu đổi mật khẩu
        if (mat_khau_cu && mat_khau_moi) {
            const isMatch = await bcrypt.compare(mat_khau_cu, user.mat_khau);
            if (!isMatch) {
                return res.status(401).json({ message: "Mật khẩu cũ không chính xác." });
            }
            const hashedPassword = await bcrypt.hash(mat_khau_moi, 10);
            Account.updateById(id_tai_khoan, ten_nguoi_dung, sdt, hashedPassword, (err, result) => {
                if (err) return res.status(500).json({ message: "Cập nhật thất bại." });
                res.status(200).json({ message: "Cập nhật thông tin và mật khẩu thành công." });
            });
        } else {
            // Không đổi mật khẩu
            Account.updateById(id_tai_khoan, ten_nguoi_dung, sdt, null, (err, result) => {
                if (err) return res.status(500).json({ message: "Cập nhật thất bại." });
                res.status(200).json({ message: "Cập nhật thông tin thành công." });
            });
        }
    });
};


exports.createAccount = (req, res) => {
    const accountData = req.body;
    Account.create(accountData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Tài khoản được tạo thành công");
    });
};

exports.createAccountWithDetails = (req, res) => {
    const { ten_nguoi_dung, mat_khau, email, anh_nguoi_dung, sdt, type, id_bac_si = null, id_benh_nhan = null } = req.body;
    Account.createWithDetails({ ten_nguoi_dung, mat_khau, email, anh_nguoi_dung, sdt, type, id_bac_si, id_benh_nhan }, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Tạo tài khoản và chi tiết thành công");
    });
};


exports.getAllAccount = (req, res) => {
    Account.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.getAccountbyID = (req, res) => {
    const { id_tai_khoan } = req.params;
    Account.getById(id_tai_khoan, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.getInfoID = (req, res) => {
    const { id_tai_khoan } = req.params;
    Account.Getinfo(id_tai_khoan, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

