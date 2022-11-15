const express = require("express");
const passport = require("passport");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/* GET home page. */
router.get("/", categoryController.getCategory);
router.post("/", categoryController.createCategory);

module.exports = router;
