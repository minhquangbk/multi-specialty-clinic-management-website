const express = require('express');
const router = express.Router();
const customerController = require('../controllers/banhnhanController');

router.get('/api/getallbenhnhan', customerController.getAllCustomers);
router.get('/api/getbenhnhan/:id_benh_nhan', customerController.getCustomerById);
router.post('/api/createbenhnhan', customerController.createCustomer);
router.put('/api/updatebenhnhan/:id_benh_nhan', customerController.updateCustomer);
router.delete('/api/deletebenhnhan/:id_benh_nhan', customerController.deleteCustomer);
router.get('/api/searchbenhnhan/:searchTerm', customerController.searchCustomerByName);
router.get('/api/searchbenhnhan/sodienthoai/:searchTerm', customerController.searchCustomerByPhone);
module.exports = router;
