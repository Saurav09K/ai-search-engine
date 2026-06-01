const express = require("express");
const router = express.Router();

const { crawlPage } = require("../controller/crawl.controller");

router.post("/", crawlPage);

module.exports = router;