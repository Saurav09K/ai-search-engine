const express = require("express");
const router = express.Router();
const { askAi } = require("../controller/askAi.controller");

router.get("/", askAi);

module.exports = router;
