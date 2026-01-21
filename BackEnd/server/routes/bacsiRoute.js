const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/bacsiController');

router.get('/api/getallbs', employeeController.getAllEmployees);
router.get('/api/getbacsi/:id_bac_si', employeeController.getEmployeeById);
router.post('/api/createbacsi', employeeController.createEmployee);
router.put('/api/updatebacsi/:id_bac_si', employeeController.updateEmployee);
router.delete('/api/deletebacsi/:id_bac_si', employeeController.deleteEmployee);
router.get('/api/searchbacsi/:searchTerm', employeeController.searchEmployeeByName);
router.get('/api/getdoctors/:id_khoa', employeeController.getDoctorsByDepartment);
router.get('/api/searchdoctors', employeeController.searchDoctors);

module.exports = router;
