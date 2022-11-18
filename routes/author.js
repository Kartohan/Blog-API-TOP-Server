const express = require("express");
const passport = require("passport");
const router = express.Router();
const authorController = require("../controllers/authorController");

/* GET home page. */
router.get("/", authorController.getAuthor);
router.post("/", authorController.createAuthor);
router.get("/:category_id", authorController.getOneAuthor);

module.exports = router;
