const { body, validationResult, checkSchema } = require("express-validator");
const Post = require("../models/post.model");
const multer = require("multer");
const path = require("path");

exports.getPosts = (req, res, next) => {
  Post.find({}, (err, posts) => {
    res.json({
      posts,
    });
  });
};

exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.post_id, (err, post) => {
    if (err) return next(err);
    res.json({
      message: "Post found",
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
      imageURL: path.join("/uploads/", req.file.filename),
      author: req.user._id,
    });
    newPost.save((err) => {
      if (err) return next(err);
      res.json({
        message: "Post created",
      });
    });
  },
];

exports.updatePost = [
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
      imageURL:
        undefined === req.file
          ? undefined
          : path.join("/uploads/", req.file.filename),
      author: req.user._id,
      _id: req.params.post_id,
    });
    Post.findByIdAndUpdate(req.params.post_id, newPost, (err) => {
      if (err) return next(err);
      res.json({
        message: "Post successfully updated",
      });
    });
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
          message: "Post not found",
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
          message: "Post not found",
        });
        return;
      }
      res.json({
        message: "Post unpublished",
      });
    }
  );
};
