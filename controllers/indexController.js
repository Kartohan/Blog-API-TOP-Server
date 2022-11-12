const Post = require("../models/post.model");

exports.getPosts = (req, res, next) => {
  Post.find({}, (err, posts) => {
    res.json({
      posts,
    });
  });
};
