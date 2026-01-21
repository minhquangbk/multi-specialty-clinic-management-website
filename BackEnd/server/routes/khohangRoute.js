const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/khohangController');

router.get('/api/getallkhohang', warehouseController.getAllwarehouse);
router.get('/api/getkhohang/:id_kho', warehouseController.getwarehouseById);
router.post('/api/createkhohang', warehouseController.createwarehouse);
router.put('/api/updatekhohang/:id_kho', warehouseController.updatewarehouse);
router.delete('/api/deletekhohang/:id_kho', warehouseController.deletewarehouse);
router.get('/api/searchkhohang/:searchTerm', warehouseController.searchWarehouseByName);
module.exports = router;