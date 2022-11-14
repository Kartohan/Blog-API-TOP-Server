const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", userController.logout);

module.exports = router;
