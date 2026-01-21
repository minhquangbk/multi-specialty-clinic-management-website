const BillCT = require('../model/chitietlichkham');

exports.getAllBill = (req, res) => {
    BillCT.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.getBillById = (req, res) => {
    const { id_lich_kham } = req.params;
    BillCT.getById(id_lich_kham, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.getBillByIdBacSi = (req, res) => {
    const { id_bac_si } = req.params;
    BillCT.getBillByIdBacSi(id_bac_si, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.getTop5Services = (req, res) => {
    BillCT.getTop5ServiceDetails((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};


exports.getDetailsByCustomerId = (req, res) => {
    const { id_benh_nhan } = req.params;
    BillCT.getDetailsByCustomerId(id_benh_nhan, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length === 0) {
            return res.status(404).send('Không có lịch khám cho khách hàng này.');
        }
        res.json(result);
    });
};


exports.createBillDitail = (req, res) => {
    const billditailData = req.body;
    BillCT.create(billditailData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Customer added successfully");
    });
};


exports.deleteDetailbill = (req, res) => {
    const { id_hoa_don } = req.params;
    BillCT.delete(id_hoa_don, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Customer deleted successfully");
    });
};