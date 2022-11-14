const { body, validationResult } = require("express-validator");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

exports.createComment = [
  body("firstname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Input First Name")
    .escape(),
  body("lastname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Input Last Name")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Input email in correct format")
    .escape(),
  body("comment")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Input your comment")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const comment = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      comment: req.body.comment,
    };
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
        comment,
      });
      return;
    }
    const newComment = new Comment({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      comment: req.body.comment,
    });
    newComment.save((err) => {
      if (err) return next(err);
    });
    Post.findByIdAndUpdate(
      req.params.post_id,
      {
        $push: { comments: newComment._id },
      },
      (err) => {
        if (err) return next(err);
      }
    );
    res.json({
      message: "Comment created",
    });
  },
];

exports.deleteComment = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
    if (err) {
      return next(err);
    }
    if (!comment) {
      res.json({
        message: "Comment do not exist",
      });
      return;
    }
    res.json({
      message: "Comment deleted",
    });
  });
};

exports.deleteAllPostComments = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.post_id,
    { $set: { comments: [] } },
    (err, post) => {
      if (err) {
        return next(err);
      }
      if (post.comments.length === 0) {
        res.json({
          message: "Post don't have any comment",
        });
        return;
      }
      res.json({
        message: "All comments for this post was deleted",
      });
    }
  );
};

exports.getOneComment = (req, res, next) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      return next(err);
    }
    if (!comment) {
      res.json({
        message: "There is no comment with this id",
      });
      return;
    }
    res.json({
      message: "Comment found",
      comment,
    });
  });
};
