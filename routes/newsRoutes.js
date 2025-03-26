const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// News route
router.get("/get-news", newsController.getNews);

module.exports = router;
