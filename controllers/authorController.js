const { body, validationResult } = require("express-validator");
const Author = require("../models/author.model");

exports.getAuthor = (req, res, next) => {
  Author.find({}, (err, authors) => {
    if (err) return next(err);
    if (authors == null) {
      res.json({
        error: "There is no authors",
      });
      return;
    }
    res.json({
      authors,
    });
  });
};

exports.getOneAuthor = (req, res, next) => {
  Author.findById(req.params.category_id, (err, author) => {
    if (err) return next(err);
    if (!author) {
      res.json({
        error: "There is no author",
      });
      return;
    }
    res.json({
      author,
    });
  });
};

exports.createAuthor = [
  body("firstname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the First name field")
    .escape(),
  body("lastname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the Last name field")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the description field")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const author = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      description: req.body.description,
    };
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
        author,
      });
      return;
    }
    const newAuthor = new Author({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      description: req.body.description,
      user: req.body.user,
    });
    newAuthor.save((err) => {
      if (err) return next(err);
      res.json({
        message: "Author created",
      });
    });
  },
];
