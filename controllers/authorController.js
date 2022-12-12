const { body, validationResult } = require("express-validator");
const Author = require("../models/author.model");
const Post = require("../models/post.model");
const async = require("async");

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
  Author.findById(req.params.author_id, (err, author) => {
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
    .withMessage("Please fill the First name field"),
  body("lastname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the Last name field"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the description field"),
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
      if (err) return console.log(err);
      res.json({
        message: "Author created",
      });
    });
  },
];

exports.updateAuthor = [
  body("firstname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the First name field"),
  body("lastname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the Last name field"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the description field"),
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
    async.series(
      {
        author: function (callback) {
          Author.findById(req.params.author_id).exec(callback);
        },
      },
      (err, results) => {
        if (err) console.log(err);
        const newAuthor = new Author({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          description: req.body.description,
          user: results.author.user,
          _id: req.params.author_id,
          posts: results.author.posts,
        });
        Author.findByIdAndUpdate(
          req.params.author_id,
          newAuthor,
          (err, author) => {
            if (!author) {
              res.json({
                error: "There is no author",
              });
              return;
            }
            if (err) return console.log(err);
            res.json({
              message: "Author edited",
            });
          }
        );
      }
    );
  },
];

exports.deleteAuthor = (req, res, next) => {
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.params.author_id).exec(callback);
      },
      author_posts: function (callback) {
        Post.find({ author: req.params.author_id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.author_posts.length > 0) {
        res.json({
          error:
            "You need to delete or change author of this posts before attemping to delete this author",
          posts: results.author_posts,
        });
        return;
      }
      if (!results.author) {
        res.json({
          error: "There is no author",
        });
        return;
      }
      Author.findByIdAndRemove(req.params.author_id, (err) => {
        if (err) return next(err);
        res.json({
          message: "Author deleted",
        });
      });
    }
  );
};
