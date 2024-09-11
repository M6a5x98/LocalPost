const express = require("express");
const router = express.Router();
const { getDatas } = require("./messages.post");
const { del } = require("./messages.delete");
const { like, edit } = require("./messages.put");
const { create } = require("./messages.patch");

router.post("/:id", getDatas);
router.delete("/:id", del);
router.put("/like/:id", like);
router.put("/edit/:id", edit);
router.patch("/", create);
module.exports = router;

/*To-Do
 * Patch: create OK
 * Delete: Supprimer OK
 * Put: Modifier OK
 * Put: Liker OK
 * Post: Obtenir les données OK
 */
