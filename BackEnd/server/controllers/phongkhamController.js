const Clinic = require('../model/phongkham'); // Tên model cho bảng 'phong_kham'

exports.getAllClinics = (req, res) => {
    Clinic.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.getClinicById = (req, res) => {
    const { id_phong_kham } = req.params;
    Clinic.getById(id_phong_kham, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.createClinic = (req, res) => {
    const clinicData = req.body;
    Clinic.create(clinicData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Clinic added successfully");
    });
};

exports.updateClinic = (req, res) => {
    const { id_phong_kham } = req.params;
    const clinicData = req.body;
    Clinic.update(id_phong_kham, clinicData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Clinic updated successfully");
    });
};

exports.deleteClinic = (req, res) => {
    const { id_phong_kham } = req.params;
    Clinic.delete(id_phong_kham, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Clinic deleted successfully");
    });
};

// Tìm kiếm gần đúng theo tên phòng khám
exports.searchClinicByName = (req, res) => {
    const { searchTerm } = req.params; // Lấy search term từ URL params
    Clinic.searchByName(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

// Lấy danh sách phòng khám theo id_khoa
exports.getClinicsByDepartment = (req, res) => {
    const { id_khoa } = req.params;
    Clinic.getByDepartment(id_khoa, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

