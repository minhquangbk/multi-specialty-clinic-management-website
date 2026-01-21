const Employee = require('../model/bacsi');

exports.getAllEmployees = (req, res) => {
    Employee.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.getEmployeeById = (req, res) => {
    const { id_bac_si } = req.params;
    Employee.getById(id_bac_si, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.createEmployee = (req, res) => {
    const employeeData = req.body;
    Employee.create(employeeData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Employee added successfully");
    });
};


exports.updateEmployee = (req, res) => {
    const { id_bac_si } = req.params;
    const employeeData = req.body;
    Employee.update(id_bac_si, employeeData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Employee updated successfully");
    });
};


exports.deleteEmployee = (req, res) => {
    const { id_bac_si } = req.params;
    Employee.delete(id_bac_si, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Employee deleted successfully");
    });
};


// Hàm mới để tìm kiếm gần đúng theo tên sản phẩm
exports.searchEmployeeByName = (req, res) => {
    const { searchTerm } = req.params; // Lấy search term từ URL params
    Employee.searchByName(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.getDoctorsByDepartment = (req, res) => {
    const { id_khoa } = req.params;
    Employee.getByDepartment(id_khoa, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.searchDoctors = (req, res) => {
    const { id_khoa, gioi_tinh, id_bang_cap, searchTerm } = req.query; // Lấy tham số từ query string
    Employee.searchByCriteria({ id_khoa, gioi_tinh, id_bang_cap, searchTerm }, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};
