const express = require('express');
const router = express.Router();
const accountController = require('../controllers/taikhoanController');

// Tạo mới tài khoản
router.post('/api/createaccount', accountController.createAccount);

router.post('/api/createaccount-with-details', accountController.createAccountWithDetails);

// Đăng nhập tài khoản
router.post('/api/login', accountController.loginAccount);

router.get('/api/getalltaikhoan', accountController.getAllAccount);

router.put('/api/updateaccount', accountController.updateAccountById);

router.get('/api/getaccountbyid/:id_tai_khoan', accountController.getAccountbyID);

router.get('/api/getinfobyiduser/:id_tai_khoan', accountController.getInfoID);

module.exports = router;
