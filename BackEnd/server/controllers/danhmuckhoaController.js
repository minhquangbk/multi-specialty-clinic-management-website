const Category = require('../model/danhmuckhoa');

exports.getAllCategories = (req, res) => {
    Category.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};



exports.getCategoryById = (req, res) => {
    const { id_khoa } = req.params;
    Category.getById(id_khoa, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};


exports.createCategory = (req, res) => {
    const categoryData = req.body;
    Category.create(categoryData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Category added successfully");
    });
};


exports.updateCategory = (req, res) => {
    const { id_khoa } = req.params;
    const categoryData = req.body;
    Category.update(id_khoa, categoryData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Category updated successfully");
    });
};


exports.deleteCategory = (req, res) => {
    const { id_khoa } = req.params;
    Category.delete(id_khoa, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Category deleted successfully");
    });
};


// Hàm mới để tìm kiếm gần đúng theo tên khoa
exports.searchCategoryByName = (req, res) => {
    const { searchTerm } = req.params; // Lấy search term từ URL params
    Category.searchByName(searchTerm, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};
