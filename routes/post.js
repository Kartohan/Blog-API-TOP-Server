const express = require("express");
const passport = require("passport");
const router = express.Router();
const postController = require("../controllers/postController");

/* GET home page. */
router.get("/", postController.getPosts);
router.get("/:post_id", postController.getOnePost);
router.post(
  "/new_post",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);
router.put(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  postController.updatePost
);
router.delete("/:post_id", postController.deletePost);
router.post(
  "/:post_id/publish",
  passport.authenticate("jwt", { session: false }),
  postController.publishPost
);
router.post(
  "/:post_id/unpublish",
  passport.authenticate("jwt", { session: false }),
  postController.unpublishPost
);
router.post(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      user: req.user._id,
      message: "Success",
    });
  }
);

module.exports = router;
