const express = require("express");
const router = express.Router();
const { Infos, checkUser, UploadImage } = require("./account.create.patch");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const { ReadAccountFile } = require("../../utils");
const upload = multer();

router.patch("/infos", Infos);
router.get("/check/:name", checkUser);
router.patch(
  "/upload",
  upload.single("profile_picture"),
  async (req, res) => await UploadImage(req, res)
);
router.delete("/", (req, res) => {
  if (!req.body.data.password || !req.body.data.username || !req.body.data) {
    res.status(400).json({
      succes: false,
      message: "password or username args are missing",
    });
    return;
  } else if (
    !fs.existsSync("database/Users/" + req.body.data.username + ".json")
  ) {
    res.status(404).json({
      succes: false,
      message: "this user does not exists",
    });
  } else if (
    ReadAccountFile(req.body.data.username).password ===
      crypto
        .createHash("sha256")
        .update(req.body.data.password)
        .update("localpost")
        .digest("hex")
        .toUpperCase() &&
    fs.readFileSync("database/Users/" + req.body.data.username + ".json") !==
      "{}"
  ) {
    fs.writeFileSync(
      "./assets/tokens.prop",
      fs.readFileSync("./assets/tokens.prop", "utf-8").replace(
        fs.readFileSync("./assets/tokens.prop", "utf-8").split("\n")[
          fs
            .readFileSync("./assets/tokens.prop", "utf-8")
            .split("\n")
            .indexOf(
              fs
                .readFileSync("./assets/tokens.prop", "utf-8")
                .split("\n")
                .filter(
                  (line) =>
                    !line.startsWith("#") &&
                    line !== "" &&
                    line.split("=")[0] === req.body.data.username
                )[0]
            )
        ] + "\n",
        ""
      )
    );
    ReadAccountFile(req.body.data.username).messages.forEach((post) => {
      const [id, content] = [
        JSON.parse(fs.readFileSync(`database/messages/${post}.json`)).data
          .author.id,
        JSON.parse(fs.readFileSync(`database/messages/${post}.json`)).post
          .content,
      ];
      fs.writeFileSync(
        `database/messages/${post}.arch`,
        `id:${id};text:${content}`
      );
      fs.unlinkSync(`database/messages/${post}.json`);
    });
    fs.writeFileSync(
      "database/Users/" + req.body.data.username + ".json",
      ReadAccountFile(req.body.data.username).id.toString()
    );
    fs.renameSync(
      "database/Users/" + req.body.data.username + ".json",
      "database/Users/" + req.body.data.username + ".arch"
    );
    if (
      fs.existsSync("database/Users/img/" + req.body.data.username + ".jpg")
    ) {
      fs.unlinkSync("database/Users/img/" + req.body.data.username + ".jpg");
    }
    res.status(200).json({
      succes: true,
    });
    return;
  } else if (
    ReadAccountFile(req.body.data.username).password !==
    crypto
      .createHash("sha256")
      .update(req.body.data.password)
      .update("localpost")
      .digest("hex")
      .toUpperCase()
  ) {
    res.status(401).json({ succes: false, message: "Wrong password" });
  } else {
    res
      .status(404)
      .json({ succes: false, message: "This account doesn't exists" });
  }
});

module.exports = router;
