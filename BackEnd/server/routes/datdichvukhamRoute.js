const express = require('express');
const router = express.Router();
const orderController = require('../controllers/datdichvukhamController');

router.post('/api/addOrder', orderController.addOrder);

module.exports = router;
