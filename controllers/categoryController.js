const { body, validationResult } = require("express-validator");
const Category = require("../models/category.model");
const Post = require("../models/post.model");

exports.getCategory = (req, res, next) => {
  Category.find({}, (err, categories) => {
    if (!categories) {
      res.json({
        error: "There is no categories",
      });
      return;
    }
    if (err) return next(err);
    res.json({
      categories: categories,
    });
  });
};

exports.getPostsFromOneCategory = (req, res, next) => {
  Post.find({ categories: req.params.category_id }, (err, posts) => {
    if (!posts) {
      res.json({
        error: "Category is empty",
      });
      return;
    }
    if (err) return next(err);
    res.json({
      posts,
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

exports.deleteCategory = (req, res, next) => {
  Category.findByIdAndDelete(req.params.category_id, (err, category) => {
    if (!category) {
      res.json({
        error: "There is no category",
      });
      return;
    }
    if (err) return next(err);
    res.json({
      message: "Category deleted",
    });
  });
};
