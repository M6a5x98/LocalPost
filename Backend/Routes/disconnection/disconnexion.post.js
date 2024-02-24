const { isUtf8 } = require("buffer");
const { TestTokenHeader, Token, TokenExists } = require("../utils");
const { readFileSync, writeFileSync } = require("fs");

function post(req, res) {
  //Pour verifier si le token est présent si oui l'assigner à la varoable du même nom sinon on envoie un code 400 au client.
  let token;
  try {
    TestTokenHeader(req.headers["localpost-token"]);
  } catch (err) {
    res.status(400);
    res.setHeader("Content-Type", "text/html");
    res.send(
      `<h1>Error</h1><strong>Bonjour, s'il vous plaît arretez de faire joujou avec mon API,</strong><br /><p>vous saviez que si j'avais pas mis un try catch,</p><br /><p>le serveur aurait crash (ça rime hihihi)</p><br /><span><a href="https://github.com/m6a5x98" target="_blank">m6a5x98</a> le créateur de l'API vous remercie de prendre compte au + vite de ce message et de mettre les headers qu'il faut</span><footer><p>For pepole who come from USA or from other countries I didn't do the translation so use <a href="https://translate.google.com/">the best tool</a> !</p></footer>`
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
      message: `Token ${token} doesn't exists.`,
    });

  writeFileSync(
    "../../assets/tokens.prop",
    readFileSync(
      "../../assets/tokens.prop",
      "utf-8"
    ).replace(`${Token(token)}=${token}\n`, "")
  );
  res.json({ succes: true });
  console.log(`${Token(token)} disconnected.`);
}

module.exports = { post };
