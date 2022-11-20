const express = require("express");
const passport = require("passport");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/* GET home page. */
router.get("/", categoryController.getCategory);
router.post(
  "/new_category",
  passport.authenticate("jwt", { session: false }),
  categoryController.createCategory
);
router.get("/:category_id", categoryController.getPostsFromOneCategory);
router.delete(
  "/:category_id",
  passport.authenticate("jwt", { session: false }),
  categoryController.deleteCategory
);

module.exports = router;
