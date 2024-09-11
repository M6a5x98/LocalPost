const express = require("express");
const { getJSON } = require("./get.translatorjs");
const router = express.Router();

router.get("/:language", getJSON);

module.exports = router;
