const express = require('express');
const router = express.Router();
const serviceController = require('..//controllers/goidichvukhambenhController');

router.get('/api/getallgdv', serviceController.getAllServices);
router.get('/api/getgdvid/:id_dich_vu', serviceController.getServiceById);
router.get('/api/getgdvbyidkhoa/:id_khoa', serviceController.getServiceByIdKhoa);
router.post('/api/creategdv', serviceController.createService);
router.put('/api/updategdv/:id_dich_vu', serviceController.updateService);
router.delete('/api/deletegdv/:id_dich_vu', serviceController.deleteService);
router.get('/api/searchgdv/:searchTerm', serviceController.searchServiceByName);
router.get('/api/searchgdvprice', serviceController.searchServiceByPriceAndName);

module.exports = router;
