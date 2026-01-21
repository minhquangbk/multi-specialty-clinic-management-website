const express = require('express');
const router = express.Router();
const employeeoffController = require('../controllers/nghiphepcontroller');

router.get('/api/getallbsoff', employeeoffController.getAllEmployeesOff);
router.get('/api/getbacsioff/:id_bac_si', employeeoffController.getEmployeeByIdOff);
router.get('/api/getbacsioffidnghiphep/:id_nghi_phep', employeeoffController.getEmployeeByIdNghiPhep);
router.post('/api/createbacsioff', employeeoffController.createEmployeeOff);
router.put('/api/updatebacsioff/:id_nghi_phep', employeeoffController.updateEmployeeOff);
router.delete('/api/deletenghiphep/:id_nghi_phep', employeeoffController.deleteEmployeeoff);

module.exports = router;
