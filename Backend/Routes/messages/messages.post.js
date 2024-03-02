const { TestTokenHeader, TestReqParams, TokenExists } = require("../utils");
const { readFileSync } = require("fs");

function getDatas(req, res) {
  let token;
  try {
    TestTokenHeader(req.headers["localpost-token"]);
    TestReqParams(req.params, "id");
  } catch (err) {
    res.status(400);
    res.setHeader("Content-Type", "text/html");
    res.send(
      `<h1>Error</h1><strong>Bonjour, s'il vous plaît arretez de faire joujou avec mon API,</strong><br /><p>vous saviez que si j'avais pas mis un try catch,</p><br /><p>le serveur aurait crash (ça rime hihihi)</p><br /><span><a href="https://github.com/m6a5x98" target="_blank">m6a5x98</a> le créateur de l'API vous remercie de prendre compte au + vite de ce message et de mettre les trucs qu'il faut</span><footer><p>For pepole who come from USA or from other countries I didn't do the translation so use <a href="https://translate.google.com/">the best tool</a> !</p></footer>`
    );
    console.warn(
      `Request without localpost-token header sended from ${req.ip}`
    );
    return;
  }
  token = req.headers["localpost-token"];
  if (!TokenExists(token))
    res.json({
      error: true,
      code: 106,
      message: `Token ` + token` doesn't exists.`,
    });
  try {
    res.json(
      JSON.parse(
        readFileSync(`./assets/message/${req.params["id"]}.json`, "utf-8")
      )
    );
  } catch (error) {
    res.json({ error: true, code: 105, message: "Post doesn't exists" });
  }
}

module.exports = { getDatas };
