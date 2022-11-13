const express = require("express");
const passport = require("passport");
const router = express.Router();
const indexController = require("../controllers/indexController");
const userController = require("../controllers/userController");
const formController = require("../controllers/formController");

/* GET home page. */
router.get("/posts", indexController.getPosts);
router.get("/posts/:id", indexController.getOnePost);
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  formController.createPost
);
router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", userController.logout);
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
