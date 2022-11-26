const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const PostSchema = new Schema(
  {
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
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

PostSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.createdIn).toFormat("dd.LL.yyyy, t");
});

module.exports = mongoose.model("Post", PostSchema);
