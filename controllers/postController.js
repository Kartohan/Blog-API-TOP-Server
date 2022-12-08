const { body, validationResult, checkSchema } = require("express-validator");
const Post = require("../models/post.model");
const Author = require("../models/author.model");
const Category = require("../models/category.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const async = require("async");

exports.getPosts = (req, res, next) => {
  Post.find({})
    .populate("author")
    .exec((err, posts) => {
      if (err) return next(err);
      res.json({
        posts,
      });
    });
};

exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.post_id)
    .populate("author")
    .populate("comments")
    .exec((err, post) => {
      if (err) return next(err);
      if (!post) {
        res.json({
          error: "There is no post",
        });
        return;
      }
      res.json({
        post,
      });
    });
};

function checkImgErrors(req, file, cb) {
  let format = file.mimetype.split("/");
  req.isFile = req.file === undefined ? true : false;
  if (format[1] === "jpeg" || format[1] === "png" || format[1] === "jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const Storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: Storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter(req, file, callback) {
    checkImgErrors(req, file, callback);
  },
});

exports.createPost = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },
  upload.single("image"),
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the title")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the description")
    .escape(),
  body("postDetail")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the post detail field")
    .escape(),
  body("author")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please choose author")
    .escape(),
  body("category.*").escape(),
  checkSchema({
    image: {
      custom: {
        options: (value, { req, location, path }) => {
          return !!req.file;
        },
        errorMessage:
          "You need to upload a product image in format .jpg, .jpeg or .png. File size should be less than 5MB",
      },
    },
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    const post = {
      title: req.body.title,
      description: req.body.description,
      postDetail: req.body.postDetail,
      categories: req.body.category,
      author: req.body.author,
    };
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
        post,
      });
      return;
    }
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      postDetail: req.body.postDetail,
      categories: req.body.category,
      imageURL: path.join("/uploads/", req.file.filename),
      author: req.body.author,
    });
    Author.findByIdAndUpdate(
      req.body.author,
      {
        $push: { posts: newPost._id },
      },
      (err) => {
        if (err) return console.log(err);
      }
    );
    newPost.save((err) => {
      if (err) return console.log(err);
      res.json({
        message: "Post created",
        post: newPost,
      });
    });
  },
];

exports.updatePost = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },
  upload.single("image"),
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the title")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the description")
    .escape(),
  body("postDetail")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please fill the post detail field")
    .escape(),
  body("author")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please choose author")
    .escape(),
  body("category.*").escape(),
  checkSchema({
    image: {
      custom: {
        options: (value, { req, location, path }) => {
          if (!req.isFile) {
            return true;
          } else if (req.isFile && !req.file) {
            return false;
          } else if (req.isFile && req.file) {
            return true;
          }
        },
        errorMessage:
          "You need to upload a product image in format .jpg, .jpeg or .png. File size should be less than 5MB",
      },
    },
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    const post = {
      title: req.body.title,
      description: req.body.description,
      postDetail: req.body.postDetail,
      categories: req.body.category,
      author: req.body.author,
    };
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
        post,
      });
      return;
    }
    async.series(
      {
        post: function (callback) {
          Post.findById(req.params.post_id).exec(callback);
        },
      },
      (err, results) => {
        const newPost = new Post({
          title: req.body.title,
          description: req.body.description,
          postDetail: req.body.postDetail,
          categories: req.body.category,
          imageURL:
            undefined === req.file
              ? undefined
              : path.join("/uploads/", req.file.filename),
          author: req.body.author,
          draft: results.post.draft,
          pinned: results.post.pinned,
          comments: results.post.comments,
          _id: req.params.post_id,
        });
        Post.findByIdAndUpdate(req.params.post_id, newPost, (err, post) => {
          if (!post) {
            res.json({
              error: "There is no post",
            });
            if (!!newPost.imageURL) {
              fs.unlink(path.join("public", newPost.imageURL), (error) => {
                console.log("unlinked due to newPost.imageURL");
                if (error) return console.log(err);
              });
            }
            return;
          }
          if (post.author !== newPost.author) {
            Author.findByIdAndUpdate(
              req.body.author,
              {
                $push: { posts: newPost._id },
              },
              (err) => {
                if (err) return console.log(err);
              }
            );
            Author.findByIdAndUpdate(
              post.author,
              {
                $pull: { posts: post._id },
              },
              (err) => {
                if (err) return console.log(err);
              }
            );
          }
          if (err) return console.log(err);
          if (!!newPost.imageURL) {
            fs.unlink(path.join("public", post.imageURL), (error) => {
              if (error) return console.log(error);
            });
          }
          res.json({
            message: "Post successfully updated",
            post: newPost,
          });
        });
      }
    );
  },
];

exports.publishPost = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.post_id,
    { $set: { draft: false } },
    (err, post) => {
      if (err) return next(err);
      if (!post) {
        res.json({
          error: "Post not found",
        });
        return;
      }
      res.json({
        message: "Post published",
      });
    }
  );
};

exports.unpublishPost = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.post_id,
    { $set: { draft: true } },
    (err, post) => {
      if (err) return next(err);
      if (!post) {
        res.json({
          error: "Post not found",
        });
        return;
      }
      res.json({
        message: "Post unpublished",
      });
    }
  );
};

exports.pinPost = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.post_id,
    { $set: { pinned: true } },
    (err, post) => {
      if (err) return next(err);
      if (!post) {
        res.json({
          error: "Post not found",
        });
        return;
      }
      res.json({
        message: "Post pinned",
      });
    }
  );
};

exports.unPinPost = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.post_id,
    { $set: { pinned: false } },
    (err, post) => {
      if (err) return next(err);
      if (!post) {
        res.json({
          error: "Post not found",
        });
        return;
      }
      res.json({
        message: "Post unpinned",
      });
    }
  );
};

exports.deletePost = (req, res, next) => {
  async.parallel(
    {
      post: function (callback) {
        Post.findById(req.params.post_id).exec(callback);
      },
      author: function (callback) {
        Author.find({ posts: req.params.post_id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (!results.post) {
        res.json({
          error: "There is no post to delete",
        });
        return;
      }
      Post.findByIdAndDelete(req.params.post_id, (err) => {
        if (err) return console.log(err);
      });
      fs.unlink(path.join("public", results.post.imageURL), (error) => {
        if (error) return console.log(err);
      });
      Author.findByIdAndUpdate(
        results.post.author,
        { $pull: { posts: results.post._id } },
        (err, author) => {
          if (err) return console.log(err);
        }
      );
      res.json({
        message: "Post deleted",
      });
    }
  );
};
