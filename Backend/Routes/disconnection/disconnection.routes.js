const router = require("express").Router();
const { post } = require("./disconnexion.post");

router.post("/:token", (req, res) => post(req, res));

module.exports = router;
