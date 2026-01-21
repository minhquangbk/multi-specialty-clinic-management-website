const express = require('express');
const router = express.Router();
const billController = require('../controllers/hoadonlichkhamController');

router.get('/api/getalllichkham', billController.getAllBill);
router.delete('/api/deletelichkham/:id_lich_kham', billController.deleteBill);
router.get('/api/getlk/:id_lich_kham', billController.getBillById);
router.get('/api/searchhd/:searchTerm', billController.searchBillByName);
router.put('/api/updatelk/:id_lich_kham', billController.updateBill);
router.put('/api/updatepricelk/:id_lich_kham', billController.updatePriceBill);
router.get('/api/getlichkham/:ngay_dat_lich', billController.getLichKhamByNgayDatLich);
router.get('/api/getlichkham/trangthai/:trang_thai', billController.getLichKhamByTrangThai);
router.get('/api/getlichkham/chuyenkhoa/:chuyen_khoa', billController.getLichKhamByidKhoa);
module.exports = router;