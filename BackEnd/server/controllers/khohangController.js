const Warehouse = require('../model/khohang');

exports.getAllwarehouse = (req, res) => {
    Warehouse.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.getwarehouseById = (req, res) => {
    const { id_kho } = req.params;
    Warehouse.getById(id_kho, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.createwarehouse = (req, res) => {
    const warehouseData = req.body;
    Warehouse.create(warehouseData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Warehouse added successfully");
    });
};

exports.updatewarehouse = (req, res) => {
    const { id_kho } = req.params;
    const warehouseData = req.body;
    Warehouse.update(id_kho, warehouseData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Warehouse updated successfully");
    });
};

exports.deletewarehouse = (req, res) => {
    const { id_kho } = req.params;
    Warehouse.delete(id_kho, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Warehouse deleted successfully");
    });
};


// Hàm mới để tìm kiếm gần đúng theo tên sản phẩm
exports.searchWarehouseByName = (req, res) => {
    const { searchTerm } = req.params; // Lấy search term từ URL params
    Warehouse.searchByName(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};
