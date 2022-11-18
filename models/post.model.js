const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  createdIn: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: "Comment",
  },
  draft: {
    type: Boolean,
    default: true,
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
  imageURL: {
    type: String,
    required: true,
  },
  categories: {
    type: [Schema.Types.ObjectId],
    ref: "Category",
  },
});

module.exports = mongoose.model("Post", PostSchema);
