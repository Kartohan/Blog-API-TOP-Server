const express = require("express");
const passport = require("passport");
const router = express.Router();
const commentController = require("../controllers/commentController");

/* GET home page. */
// router.get("/posts/:post_id/comment/:comment_id", (req, res, next) => {});
router.post("/:post_id", commentController.createComment);
router.get("/:post_id/:comment_id", commentController.getOneComment);
router.delete(
  "/:post_id/comments",
  passport.authenticate("jwt", { session: false }),
  commentController.deleteAllPostComments
);
router.delete(
  "/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  commentController.deleteComment
);

module.exports = router;
