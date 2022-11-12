const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

/* GET home page. */
router.get("/posts", indexController.getPosts);
router.post("/login");

module.exports = router;
