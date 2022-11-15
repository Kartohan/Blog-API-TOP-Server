const { body, validationResult } = require("express-validator");
const Category = require("../models/category.model");

exports.getCategory = (req, res, next) => {
  Category.find({}, (err, categories) => {
    if (err) return next(err);
    if (categories == null) {
      res.json({
        message: "There is no categories",
      });
      return;
    }
    res.json({
      categories: categories,
    });
  });
};

exports.createCategory = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the title")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
      return;
    }
    const newCategory = new Category({
      name: req.body.name,
    });
    newCategory.save((err) => {
      if (err) return next(err);
      res.json({
        message: "Category created",
      });
    });
  },
];
