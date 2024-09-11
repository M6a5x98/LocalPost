const {
  GetValueFromAccountFile,
  Token,
  DelPost,
  ReadAccountFile,
  TokenExists,
  TestReqBody,
  TestTokenHeader,
} = require("../utils");
const { readFileSync, writeFileSync, readdir } = require("fs");
const { extname } = require("path");

function del(req, res) {
  if (
    !TestReqBody(req["headers"]["content-type"]) &&
    !TestTokenHeader(req["headers"]["localpost-token"])
  ) {
    res.status(400);
    res.json({
      message: `Bad "Content-type"/"localpost-token" header`,
      succes: false,
    });
    console.warn(
      `\x1b[2;255;127;39mRequest without Content-Type header sended from ${req.ip}\x1b[0m`
    );
    return;
  } else {
    const token = req.headers["localpost-token"];
    if (!TokenExists(token)) {
      res.json({
        succes: false,
        code: 106,
        message: `Token ${token} doesn't exists.`,
      });
      return;
    }
  }
  //On récupère les perms de l'utilisateur et on vérifie si c'est le créateur du post qui demande la suppression
  const perms = GetValueFromAccountFile(Token(token), ["account", "perms"]);
  const IsActionPerformedByCreator =
    GetValueFromAccountFile(Token(token), ["id"]) ===
    JSON.parse(
      readFileSync(
        "./database/messages/" + parseInt(req.params["id"]) + ".json",
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
        "./database/Users/" + Token(token) + ".json",
        JSON.stringify(builtFile),
        "utf-8"
      );
      //Supprimer tous les likes du fichier
      let rebuiltLikeFile = "";
      readFileSync("./assets/likes.prop", "utf-8")
        .split("\n")
        .filter((l) => !l.startsWith(req.params["id"]))
        .forEach((post) => (rebuiltLikeFile += post + "\n"));
      writeFileSync("./assets/likes.prop", rebuiltLikeFile, "utf-8");
      //supprimer le post de tous les fichiers utilisateurs
      readdir("./database/Users/", (err, file) => {
        if (err) throw new Error(err);
        //Get les fichiers JSON des likers
        let fileNames = file.filter(
          (files) => extname(files).toLowerCase() === ".json"
        );
        let parsedFiles = [];
        fileNames.forEach((jsonFile) =>
          parsedFiles.push(
            JSON.parse(readFileSync("./database/Users/" + jsonFile, "utf-8"))
          )
        );
        const likers = parsedFiles["filter"]((uFile) =>
          uFile.likes.includes(parseInt(req.params["id"]))
        );
        //Get les likers
        for (let I = 0; I < likers.length; I++) {
          const liker = likers[I];
          Object.defineProperty(liker, "likes", {
            value: liker["likes"]["filter"](
              (likes) => likes !== parseInt(req.params["id"])
            ),
          });
          likers[I] = liker;
        }
        for (let I = 0; I < likers.length; I++) {
          const uFile = likers[I];
          const uName = likers[I]["username"];
          writeFileSync(
            "./database/Users/" + uName + ".json",
            JSON.stringify(uFile)
          );
        }
      });
      //Envoyer la requête su succès
      res.json({ succes: true });
    } else {
      //Sinon si le post n'existe pas alors envoyer une reponse d'échec
      res.json({ succes: false, code: 105, message: "Post doesn't exists" });
    }
  } else {
    //Sinon si le client n'a pas les droits pour supprimer ce post alors on lui dit "non"
    res.json({
      succes: false,
      code: 302,
      message: "You need higher perms to perform this action",
    });
  }
}

module.exports = { del };
