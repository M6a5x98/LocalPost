const {
  TestTokenHeader,
  GetValueFromAccountFile,
  Token,
  DelPost,
  ReadAccountFile,
  TokenExists,
} = require("../utils");
const { readFileSync, writeFileSync } = require("fs");

function del(req, res) {
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
  //On récupère les perms de l'utilisateur et on vérifie si c'est le créateur du post qui demande la suppression
  const perms = GetValueFromAccountFile(Token(token), ["account", "perms"]);
  const IsActionPerformedByCreator =
    GetValueFromAccountFile(Token(token), ["id"]) ===
    JSON.parse(
      readFileSync(
        "/Fichiers.txt/Code/LocalPost/FrontAndBack/Backend/assets/message/" +
          parseInt(req.params["id"]) +
          ".json",
        "utf-8"
      )
    )["data"]["author"]["id"];
  //If c'est un admin ou un modo ou c'est le créateur du post qui fait l'action alors
  if (perms === "admin" || perms === "modo" || IsActionPerformedByCreator) {
    //Si le post existe alors le supprimer puis
    if (DelPost(req.params["id"])) {
      //Enlever son id de la liste des messages envoyés par l'utilisateur
      let messages = GetValueFromAccountFile(Token(token), ["messages"]);
      let index = messages.indexOf(parseInt(req.params["id"]));
      if (index > -1) {
        messages.splice(index, 1);
      }
      //Ajouter la liste modifiée dans le fichier de l'utilisateur
      const builtFile = ReadAccountFile(Token(token));
      Object.defineProperty(builtFile, "messages", { value: messages });
      writeFileSync(
        "/Fichiers.txt/Code/LocalPost/FrontAndBack/Backend/assets/Users/" +
          Token(token) +
          ".json",
        JSON.stringify(builtFile)
      );
      //Envoyer la requête su succès
      res.json({ succes: true });
    } else {
      //Sinon si le post n'existe pas alors envoyer une reponse d'échec
      res.json({ error: true, code: 105, message: "Post doesn't exists" });
    }
  } else {
    //Sinon si le client n'a pas les droits pour supprimer ce post alors on lui dit "non"
    res.json({
      error: true,
      code: 302,
      message: "You need higher perms to perform this action",
    });
  }
}

module.exports = { del };
