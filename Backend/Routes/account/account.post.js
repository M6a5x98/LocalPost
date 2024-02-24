const { TestTokenHeader, Token, GetValueFromAccountFile } = require("../utils");

const post = (req, res) => {
  let token;
  let actions;

  try {
    TestTokenHeader(req.headers["localpost-token"]);
    actions = req.body.actions;
  } catch (err) {
    res.status(400);
    res.setHeader("Content-Type", "text/html");
    res.send(
      `
        <h1>Error</h1>
        <strong>Bonjour, s'il vous plaît arretez de faire joujou avec mon API,</strong><br />
        <p>vous saviez que si j'avais pas mis un try catch,</p><br />
        <p>le serveur aurait crash (ça rime hihihi)</p><br />
        <span><a href="https://github.com/m6a5x98" target="_blank">m6a5x98</a> le créateur de l'API vous remercie de prendre compte au + vite de ce message et de mettre les headers qu'il faut</span>
        <footer>
        <p>For pepole who come from USA or from other countries I didn't do the translation so use <a href="https://translate.google.com/">the best tool</a> !</p>
        </footer>
        `
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

  let responseAttributesList = [];
  actions.forEach((action) => {
    let verb = action.substring(0, 3);
    let param = action.substring(4);
    if (param === "password") {
      res.status(401);
      res.json({
        error: true,
        code: 302,
        message: "You need higher perms to perform this action",
      });
    }
    if (verb === "get") {
      responseAttributesList.push({
        asked: param,
        value: GetValueFromAccountFile(Token(token), param.trim().split("/")),
      });
    }
  });
  try {
    res.status(200);
    res.json({
      succes: true,
      data: { askedAttributes: responseAttributesList },
    });
  } catch (error) {}
};

module.exports = { post };
// body de la requete du client
/*{
  actions: [
    'get account/perms',
    'get id'
  ]
} 
*/
// body de la reponse
/*{
  data: {
    askedAttributes : [{asked: 'id', value: '@m6a98'}, {asked: 'perms', value: 'admin'}]
  }
} 
*/
