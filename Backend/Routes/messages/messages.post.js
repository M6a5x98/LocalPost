const { TestTokenHeader, TestReqBody, TokenExists } = require("../utils");
const { readFileSync } = require("fs");

function getDatas(req, res) {
  if (!req.body) {
    res.status(400);
    res.json({
      message: `Bad "Content-type"/"localpost-token" header`,
      error: true,
    });
    console.warn(
      `\x1b[2;255;127;39mRequest without Content-Type header sended from ${req.ip}\x1b[0m`
    );
    return;
  } else {
    const token = req.headers["localpost-token"];
    if (!TokenExists(token)) {
      res.json({
        error: true,
        code: 106,
        message: `Token ${token} doesn't exists.`,
      });
      return;
    }
  }
  const postsID = req.params["id"].split(",");
  const posts = [];
  try {
    for (const post of postsID) {
      posts.push(
        JSON.parse(readFileSync(`./database/messages/${post}.json`, "utf-8"))
      );
    }
    res.json({ succes: true, data: posts });
  } catch (error) {
    res.json({
      succes: false,
      error: true,
      code: 105,
      message: "Post doesn't exists",
    });
  }
}

module.exports = { getDatas };
