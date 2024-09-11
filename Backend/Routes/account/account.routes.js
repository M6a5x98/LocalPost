const express = require("express");
const router = express.Router();
const { post } = require("./account.post");
const create = require("./create/account.create.routes");
const { getUsers } = require("./account.get");

router.get("/users", (req, res) => getUsers(req, res));
router.post("/", (req, res) => {
  post(req, res);
});
router.use("/create", create);
module.exports = router;
