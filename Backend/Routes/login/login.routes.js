const express = require("express");
const router = express.Router();
const { post } = require("./login.post");

router.post("/", (req, res) => post(req, res));

module.exports = router;
