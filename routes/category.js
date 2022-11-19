const express = require("express");
const passport = require("passport");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/* GET home page. */
router.get("/", categoryController.getCategory);
router.post("/new_category", categoryController.createCategory);
router.get("/:category_id", categoryController.getOneCategory);
router.delete("/:category_id", categoryController.deleteCategory);

module.exports = router;
