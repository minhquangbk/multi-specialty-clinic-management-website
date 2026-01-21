const Employeeoff = require('../model/nghiphep');

exports.getAllEmployeesOff = (req, res) => {
    Employeeoff.getAllOff((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.getEmployeeByIdOff = (req, res) => {
    const { id_bac_si } = req.params;
    Employeeoff.getByIdOff(id_bac_si, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.getEmployeeByIdNghiPhep = (req, res) => {
    const { id_nghi_phep } = req.params;
    Employeeoff.getByIdNghiPhep(id_nghi_phep, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.createEmployeeOff = (req, res) => {
    const employeeDataoff = req.body;
    Employeeoff.createoff(employeeDataoff, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Employee added successfully");
    });
};

exports.updateEmployeeOff = (req, res) => {
    const { id_nghi_phep } = req.params;
    const employeeData = req.body;
    Employeeoff.updateoff(id_nghi_phep, employeeData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Employee updated successfully");
    });
};

exports.deleteEmployeeoff = (req, res) => {
    const { id_nghi_phep } = req.params;
    Employeeoff.deleteoff(id_nghi_phep, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Employeeoff deleted successfully");
    });
};


