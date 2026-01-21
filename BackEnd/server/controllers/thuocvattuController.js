const ThuocVatTu = require('../model/thuocvattu');

// Lấy tất cả thuốc/vật tư
exports.getAllThuocVatTu = (req, res) => {
    ThuocVatTu.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

// Lấy tất cả danh mục thuốc vật tư
exports.getAllLoaiThuocVatTu = (req, res) => {
    ThuocVatTu.getAllLoaiThuoc((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

// Lấy thuốc/vật tư theo ID
exports.getThuocVatTuById = (req, res) => {
    const { id_thuoc_vat_tu } = req.params;
    ThuocVatTu.getById(id_thuoc_vat_tu, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

// Lấy thuốc/vật tư theo ID Loại thuốc
exports.getThuocVatTuByIdLoaiThuoc = (req, res) => {
    const { id_loai_thuoc } = req.params;
    ThuocVatTu.getByIdLoaiThuoc(id_loai_thuoc, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

// Lấy loại thuốc vật  tư theo ID Loại thuốc
exports.getLoaiThuocVatTuByIdLoaiThuoc = (req, res) => {
    const { id_loai_thuoc } = req.params;
    ThuocVatTu.getLoaiThuocByIdLoaiThuoc(id_loai_thuoc, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

// Tạo mới thuốc/vật tư
exports.createThuocVatTu = (req, res) => {
    const ThuocVatTuData = req.body;  // Dữ liệu thuốc/vật tư từ request body
    ThuocVatTu.create(ThuocVatTuData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Thuốc/vật tư đã được thêm thành công");
    });
};

// Cập nhật thuốc/vật tư
exports.updateThuocVatTu = (req, res) => {
    const { id_thuoc_vat_tu } = req.params;
    const ThuocVatTuData = req.body;  // Dữ liệu cập nhật từ request body
    ThuocVatTu.update(id_thuoc_vat_tu, ThuocVatTuData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Thuốc/vật tư đã được cập nhật thành công");
    });
};

// Xóa thuốc/vật tư theo ID
exports.deleteThuocVatTu = (req, res) => {
    const { id_thuoc_vat_tu } = req.params;
    ThuocVatTu.delete(id_thuoc_vat_tu, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Thuốc/vật tư đã được xóa thành công");
    });
};

// Tìm kiếm thuốc/vật tư theo tên
exports.searchThuocVatTuByName = (req, res) => {
    const { searchTerm } = req.params; 
    ThuocVatTu.searchByName(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

