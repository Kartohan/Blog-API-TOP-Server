const Post = require("../models/post.model");

exports.getPosts = (req, res, next) => {
  Post.find({}, (err, posts) => {
    res.json({
      posts,
    });
  });
};

exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    res.json({
      message: "Post found",
      post,
    });
  });
};
