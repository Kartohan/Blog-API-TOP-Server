const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    retuired: true,
    ref: "User",
  },
  createdIn: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: [String],
    ref: "Comment",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  postDetail: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);
