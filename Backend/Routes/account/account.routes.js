const express = require("express");
const router = express.Router();
const { post } = require("./account.post");
// const { account } = require("./account.get");

router.post("/", (req, res) => {
  post(req, res);
});
router.get("/", (req, res) => {
  res.send("account");
});

module.exports = router;
