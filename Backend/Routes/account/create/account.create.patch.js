const {
  existsSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  unlinkSync,
} = require("fs");
const { TestReqBody } = require("../../utils");
const { createHash } = require("crypto");

function Infos(req, res) {
  if (!TestReqBody(req["headers"]["content-type"])) {
    res.status(400).json({
      succes: false,
      message: `Bad Content type header`,
      error: true,
    });
    console.log(
      `\x1b[2;255;127;39mRequest without Content-Type header sended from ${req.ip}\x1b[0m`
    );
    return;
  } else {
    if (
      existsSync(
        "./database/Users/" + encodeURIComponent(req.params["name"]) + ".json"
      )
    ) {
      res.status(406).json({
        succes: false,
        message: `Username already used.`,
        error: true,
      });
      return;
    }
    if (!req.body["data"]["name"] || !req.body["data"]["password"]) {
      res.status(400).json({
        succes: false,
        message: `Not enough infos given.`,
        error: true,
      });
      return;
    }
    const token = (Math.random() + Date.now()).toString(
      26 + Math.round(Math.random())
    );
    writeFileSync(
      "$temp/$" + token,
      req.body["data"]["name"] +
        "\n" +
        createHash("sha256")
          .update(req.body["data"]["password"])
          .update("localpost")
          .digest("hex")
          .toUpperCase()
    );
    res.json({ succes: true, token });
  }
}

async function UploadImageAndFinish(req, res) {
  if (!req.body.token) {
    res.status(400).json({
      succes: false,
      message: `No token given`,
      error: true,
    });
    console.log(
      `\x1b[2;255;127;39mRequest without upload token header sended from ${req.ip}\x1b[0m`
    );
    return;
  } else if (!existsSync("$temp/$" + req.body.token)) {
    res.status(404).json({
      succes: false,
      message: `Token not found`,
      error: true,
    });
    return;
  } else if (!req.file) {
    const token =
      /*req.headers["cookie"]
      .split("; ")
      .filter((e) => e.startsWith("token="))[0]
      .split("=")[1];*/ req.body.token;
    const name = readFileSync("$temp/$" + token, "utf-8").split("\n")[0];
    writeFileSync(
      "database/Users/" + name + ".json",
      JSON.stringify({
        username: name,
        password: readFileSync("$temp/$" + token, "utf-8").split("\n")[1],
        id:
          readdirSync("database/Users", { withFileTypes: true }).filter(
            (e) => !e.isDirectory()
          ).length - 1,
        account: {
          profilePicture: `/api/assets?file=pdp&name=${name}`,
          nameDisplayColor: "#000",
          perms: "user",
          isAuthorizedPublishAll: false,
        },
        messages: [],
        likes: [],
      })
    );
    unlinkSync("$temp/$" + token);
    res.json({ succes: true });
  } else {
    const token =
      /*req.headers["cookie"]
      .split("; ")
      .filter((e) => e.startsWith("token="))[0]
      .split("=")[1];*/ req.body.token;
    const name = readFileSync("$temp/$" + token, "utf-8").split("\n")[0];
    let getMime = await import("image-type");
    getMime = getMime.default;
    const result = await getMime(req.file.buffer);
    if (result.mime !== "image/jpeg") {
      res.status(400).json({
        succes: false,
        message: "File is not an image/jpeg",
      });
      return;
    }
    writeFileSync("database/Users/img/" + name + ".jpg", req.file.buffer);
    writeFileSync(
      "database/Users/" + name + ".json",
      JSON.stringify({
        username: name,
        password: readFileSync("$temp/$" + token, "utf-8").split("\n")[1],
        id:
          readdirSync("database/Users", { withFileTypes: true }).filter(
            (e) => !e.isDirectory() || !e.name.endsWith(".arch")
          ).length - 1,
        account: {
          profilePicture: `/api/assets?file=pdp&name=${name}`,
          nameDisplayColor: "#000",
          perms: "user",
          isAuthorizedPublishAll: false,
        },
        messages: [],
        likes: [],
      })
    );
    unlinkSync("$temp/$" + token);
    res.json({ succes: true });
  }
}

function checkUser(req, res) {
  if (!req.params["name"]) {
    res.status(400).send("No param found");
    return;
  } else {
    res
      .status(200)
      .send(
        existsSync(
          "./database/Users/" + encodeURIComponent(req.params["name"]) + ".json"
        )
          ? "true"
          : "false"
      );
  }
}
module.exports = { Infos, checkUser, UploadImage: UploadImageAndFinish };
