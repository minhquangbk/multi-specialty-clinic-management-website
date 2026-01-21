const express = require('express');
const router = express.Router();
const categoryController = require('..//controllers/danhmuckhoaController');

router.get('/api/getalldmkhoa', categoryController.getAllCategories);
router.get('/api/getdmkhoa/:id_khoa', categoryController.getCategoryById);
router.post('/api/createdmkhoa', categoryController.createCategory);
router.put('/api/updatedmkhoa/:id_khoa', categoryController.updateCategory);
router.delete('/api/deletedmkhoa/:id_khoa', categoryController.deleteCategory);
router.get('/api/searchdmkhoa/:searchTerm', categoryController.searchCategoryByName);
module.exports = router;
