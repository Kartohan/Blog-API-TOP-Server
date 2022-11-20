const express = require("express");
const passport = require("passport");
const router = express.Router();
const authorController = require("../controllers/authorController");

/* GET home page. */
router.get("/", authorController.getAuthor);
router.post(
  "/new_author",
  passport.authenticate("jwt", { session: false }),
  authorController.createAuthor
);
router.get("/:author_id", authorController.getOneAuthor);
router.delete(
  "/:author_id",
  passport.authenticate("jwt", { session: false }),
  authorController.deleteAuthor
);

module.exports = router;
