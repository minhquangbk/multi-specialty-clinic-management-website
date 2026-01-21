const express = require('express');
const router = express.Router();
const hoSoBenhAnController = require('../controllers/hosobenhanController');

// Route to get patient information and medical records by id_benh_nhan
router.get('/patient/:id_benh_nhan/medical-records', hoSoBenhAnController.getPatientAndMedicalRecords);
router.get('/api/getallhosobenhan', hoSoBenhAnController.getAllBenhAn);
router.get('/api/gethosobenhan/:id_ho_so', hoSoBenhAnController.getBenhAnById);
router.get('/api/gethosobenhanbyidbacsi/:id_bac_si', hoSoBenhAnController.getBenhAnByIdBacSi);
router.get('/api/getctbillthuoc/:id_lich_kham',hoSoBenhAnController.getBillThuocById);
router.get('/api/getcthosobenhan/:id_lich_kham',hoSoBenhAnController.getBenhAnByIdlichKham);
router.post('/api/createhosobenhan', hoSoBenhAnController.createBenhAn);
router.post('/api/createctbillthuoc',hoSoBenhAnController.createBillThuoc);
router.put('/api/updatehosobenhan/:id_ho_so', hoSoBenhAnController.updateBenhAn);
router.delete('/api/deletehosobenhan/:id_ho_so', hoSoBenhAnController.deleteBenhAn);
router.delete('/api/deletethuocbill/:id_hoa_don', hoSoBenhAnController.deleteThuocbill);
router.get('/api/searchhosobenhan/:id_benh_nhan', hoSoBenhAnController.searchBenhAnByBenhNhan);
router.get('/api/gethosobenhanbydate/:ngay_lap', hoSoBenhAnController.getBenhAnByNgayLap);
router.get('/api/searchhosobenhan/:searchTerm', hoSoBenhAnController.searchCustomerByName);

module.exports = router;
