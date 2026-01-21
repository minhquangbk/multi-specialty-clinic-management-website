const express = require('express');
const router = express.Router();
const billController = require('../controllers/chitietlichkhamController');

router.get('/api/getctlk/:id_lich_kham',billController.getBillById);
router.get('/api/getctlkbyidbacsi/:id_bac_si',billController.getBillByIdBacSi);
router.get('/api/getalllk',billController.getAllBill);
router.post('/api/createctlk',billController.createBillDitail);
router.get('/api/top5services', billController.getTop5Services);
router.delete('/api/deletedetailbill/:id_hoa_don', billController.deleteDetailbill);
router.get('/api/orderDetailsByCustomer/:id_benh_nhan', billController.getDetailsByCustomerId);
module.exports = router;