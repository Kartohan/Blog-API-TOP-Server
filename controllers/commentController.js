const { body, validationResult } = require("express-validator");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const async = require("async");

exports.createComment = [
  body("firstname").trim().isLength({ min: 1 }).withMessage("Input First Name"),
  body("lastname").trim().isLength({ min: 1 }).withMessage("Input Last Name"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Input email in correct format"),
  body("comment").trim().isLength({ min: 1 }).withMessage("Input your comment"),
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
      post: req.params.post_id,
    });
    newComment.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    Post.findByIdAndUpdate(
      req.params.post_id,
      {
        $push: { comments: newComment._id },
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    res.json({
      message: "Comment created",
      newComment,
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
        error: "Comment do not exist",
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
      if (!post) {
        res.json({
          error: "There is no post",
        });
        return;
      }
      if (post.comments.length === 0) {
        res.json({
          error: "Post don't have any comment",
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
        error: "There is no comment with this id",
      });
      return;
    }
    res.json({
      comment,
    });
  });
};

exports.getCommentsForPost = (req, res, next) => {
  Comment.find({ post: req.params.post_id }, (err, comments) => {
    if (err) return next(err);
    if (!comments) {
      res.json({
        error: "There is no comments",
      });
      return;
    }
    res.json({
      comments,
    });
  });
};

exports.getLastComments = (req, res, next) => {
  Comment.find()
    .sort("-createdAt")
    .limit(10)
    .exec(function (err, comments) {
      res.json({
        comments,
      });
    });
};
