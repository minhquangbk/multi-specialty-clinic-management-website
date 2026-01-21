const Customer = require('../model/benhnhan');

exports.getAllCustomers = (req, res) => {
    Customer.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.getCustomerById = (req, res) => {
    const { id_benh_nhan } = req.params;
    Customer.getById(id_benh_nhan, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.createCustomer = (req, res) => {
    const customerData = req.body;
    Customer.create(customerData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Customer added successfully");
    });
};

exports.updateCustomer = (req, res) => {
    const { id_benh_nhan } = req.params;
    const customerData = req.body;
    Customer.update(id_benh_nhan, customerData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Customer updated successfully");
    });
};

exports.deleteCustomer = (req, res) => {
    const { id_benh_nhan } = req.params;
    Customer.delete(id_benh_nhan, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Customer deleted successfully");
    });
};

// Hàm mới để tìm kiếm gần đúng theo tên sản phẩm
exports.searchCustomerByName = (req, res) => {
    const { searchTerm } = req.params; // Lấy search term từ URL params
    Customer.searchByName(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.searchCustomerByPhone = (req, res) => {
    const { searchTerm } = req.params; // Lấy search term từ URL params
    Customer.searchByPhone(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};