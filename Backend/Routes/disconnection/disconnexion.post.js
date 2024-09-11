const { TestReqBody, Token, TokenExists } = require("../utils");
const { readFileSync, writeFileSync } = require("fs");
const { Logger } = require("../../logger");

function post(req, res) {
  const token = req.params["token"];
  if (!TokenExists(token))
    res.json({
      succes: false,

      code: 106,
      message: `Token ${token} doesn't exists.`,
    });

  writeFileSync(
    "./assets/tokens.prop",
    readFileSync("./assets/tokens.prop", "utf-8").replace(
      `${Token(token)}=${token}\n`,
      ""
    ),
    "utf-8"
  );
  res.json({ succes: true, data: {} });
  new Logger("./routes.log").log(
    `${Token(token)} disconnected`,
    __filename.split(require("path").sep)[
      __filename.split(require("path").sep).length - 1
    ]
  );
}

module.exports = { post };
