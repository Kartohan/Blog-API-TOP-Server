const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", userController.logout);
router.post(
  "/verify",
  passport.authenticate("jwt", { session: false }),
  userController.verify
);

module.exports = router;
