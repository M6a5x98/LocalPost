const express = require("express");
const router = express.Router();
// const { getDatas } = require("./messages.post");
const { del } = require("./messages.delete");
const { like, edit } = require("./messages.put");
const { create } = require("./messages.patch");

// router.post("/:id", (req, res) => getDatas(req, res));
router.delete("/:id", (req, res) => del(req, res));
router.put("/like/:id", (req, res) => like(req, res));
router.put("/edit/:id", (req, res) => edit(req, res));
router.patch("/", (req, res) => create(req, res));

module.exports = router;

/*To-Do
 * Patch: create OK
 * Delete: Supprimer OK
 * Put: Modifier
 * Put: Liker
 * Post: Obtenir les donées
 */
