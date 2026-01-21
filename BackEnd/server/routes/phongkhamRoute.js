const express = require('express');
const router = express.Router();
const phongKhamController = require('../controllers/phongkhamController');

router.get('/api/getallphongkham', phongKhamController.getAllClinics);
router.get('/api/getphongkham/:id_phong_kham', phongKhamController.getClinicById);
router.post('/api/createphongkham', phongKhamController.createClinic);
router.put('/api/updatephongkham/:id_phong_kham', phongKhamController.updateClinic);
router.delete('/api/deletephongkham/:id_phong_kham', phongKhamController.deleteClinic);
router.get('/api/searchphongkham/:searchTerm', phongKhamController.searchClinicByName);
router.get('/api/getphongkhambydepartment/:id_khoa', phongKhamController.getClinicsByDepartment);

module.exports = router;
