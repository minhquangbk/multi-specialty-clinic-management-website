const express = require("express");
const router = express.Router();
const leveldoctorController = require("../controllers/trinhdobacsiController");

router.get("/api/getalltrinhdo", leveldoctorController.getAllLevelDoctor);
router.get("/api/gettrinhdo/:id_bang_cap", leveldoctorController.getLevelDoctorById);
router.post("/api/createtrinhdo", leveldoctorController.createLevelDoctor);
router.put("/api/updatetrinhdo/:id_bang_cap", leveldoctorController.updateLevelDoctor);
router.delete("/api/deletetrinhdo/:id_bang_cap", leveldoctorController.deleteLevelDoctor);
router.get("/api/searchtrinhdo/:searchTerm",leveldoctorController.searchLevelDoctorByName);
module.exports = router;
