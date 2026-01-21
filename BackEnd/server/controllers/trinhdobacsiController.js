const LevelDoctor = require('../model/trinhdobacsi');

exports.getAllLevelDoctor = (req, res) => {
    LevelDoctor.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.getLevelDoctorById = (req, res) => {
    const { id_bang_cap } = req.params;
    LevelDoctor.getById(id_bang_cap, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.createLevelDoctor = (req, res) => {
    const LevelDoctorData = req.body;
    LevelDoctor.create(LevelDoctorData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("LevelDoctor added successfully");
    });
};

exports.updateLevelDoctor = (req, res) => {
    const { id_bang_cap } = req.params;
    const LevelDoctorData = req.body;
    LevelDoctor.update(id_bang_cap, LevelDoctorData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("LevelDoctor updated successfully");
    });
};

exports.deleteLevelDoctor = (req, res) => {
    const { id_bang_cap } = req.params;
    LevelDoctor.delete(id_bang_cap, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("LevelDoctor deleted successfully");
    });
};

// Hàm mới để tìm kiếm gần đúng theo level
exports.searchLevelDoctorByName = (req, res) => {
    const { searchTerm } = req.params; // Lấy search term từ URL params
    LevelDoctor.searchByName(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

