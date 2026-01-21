const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/datlichkhamController');

// Route for adding an appointment
router.post('/api/addAppointment', appointmentController.addAppointment);
router.put('/api/cancelAppointment/:id_lich_kham', appointmentController.cancelAppointment);
router.post('/api/createlichkham', appointmentController.createAppointment);

module.exports = router;
