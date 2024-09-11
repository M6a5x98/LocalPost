const { createHash } = require("crypto");
const {
  TestReqBody,
  DataUrlToFile,
  TestReqParams,
  GetFormatedDate,
} = require("../utils");
const {
  existsSync,
  writeFileSync,
  readdir,
  statSync,
  readFileSync,
} = require("fs");

function create(req, res) {
  try {
    TestReqBody(req.body);
  } catch (err) {
    res.status(400);
    res.setHeader("Content-Type", "text/html");
    res.send(
      `<h1>Error</h1><strong>Bonjour, s'il vous plaît arretez de faire joujou avec mon API,</strong><br /><p>vous saviez que si j'avais pas mis un try catch,</p><br /><p>le serveur aurait crash (ça rime hihihi)</p><br /><span><a href="https://github.com/m6a5x98" target="_blank">m6a5x98</a> le créateur de l'API vous remercie de prendre compte au + vite de ce message et de mettre les trucs qu'il faut (headers, params, ... )</span><footer><p>For pepole who come from USA or from other countries I didn't do the translation so use <a href="https://translate.google.com/">the best tool</a> !</p></footer>`
    );
    console.warn(
      `Request without localpost-token header sended from ${req.ip}`
    );
    return;
  }
  const username = encodeURIComponent(req.body["data"]["username"]);
  const password = req.body["data"]["password"];
  if (existsSync("./database/Users/" + username + ".json"))
    res.json({
      succes: false,
      code: 303,
      message: "Username took, please choose another one",
    });
  else {
    let id = 0;
    readdir("./database/Users/", (err, files) => {
      if (err) throw new Error(err);
      else id = files.length - 1;
    });
    const file = JSON.stringify({
      username: username,
      password: password,
      id: id,
      account: {
        profilePicture: "/api/assets?file=pdp&name=" + username,
        nameDisplayColor: "black",
        perms: "user",
        isAuthorizedPublishAll: false,
      },
      messages: [],
      likes: [],
    });
    const token = createHash("sha256")
      .update(password)
      .update(Math.log10(Date.now() + Math.random()).toString(11))
      .digest("hex");
    writeFileSync("./database/Users/" + username + ".json", file, "utf-8");
    writeFileSync("./assets/tokens/" + token + ".token", username, "utf-8");
    res.send({
      succes: true,
      nextAction: "upload",
      action: "create",
      token: token,
    });
  }
}

function upload(req, res) {
  let token;
  let ext;
  let b64;
  try {
    TestReqParams(req.params, "token");
    TestReqBody(req.body);
  } catch (err) {
    res.status(400);
    res.setHeader("Content-Type", "text/html");
    res.send(
      `<h1>Error</h1><strong>Bonjour, s'il vous plaît arretez de faire joujou avec mon API,</strong><br /><p>vous saviez que si j'avais pas mis un try catch,</p><br /><p>le serveur aurait crash (ça rime hihihi)</p><br /><span><a href="https://github.com/m6a5x98" target="_blank">m6a5x98</a> le créateur de l'API vous remercie de prendre compte au + vite de ce message et de mettre les trucs qu'il faut (headers, params, ... )</span><footer><p>For pepole who come from USA or from other countries I didn't do the translation so use <a href="https://translate.google.com/">the best tool</a> !</p></footer>`
    );
    console.warn(
      `Request without localpost-token header sended from ${req.ip}`
    );
    return;
  }
  token = req.params["token"];
  ext = req.body["data"]["ext"];
  b64 = req.body["data"]["base64"];
  if (!existsSync("./assets/tokens/" + token + ".token")) {
    res.status(404);
    res.json({
      succes: false,

      code: 106,
      message: "This first connexion token doesn't exists.",
    });
  }
  const { value, name } = DataUrlToFile(
    `data:image/${ext};base64,${b64}`,
    readFileSync("./assets/tokens/" + token + ".token", "utf-8")
  );
  writeFileSync(`./database/Users/img/${name}`, value, "utf-8");
  const { size, birthtime, mtime, ctime /*birthtimeMs, ctimeMs, mtimeMs*/ } =
    statSync(`./database/Users/img/${name}`);
  const fileDatas = {
    size: size,
    creationDate: GetFormatedDate(birthtime),
    lastDataModificationDate: GetFormatedDate(mtime),
    lastContentModificationDate: GetFormatedDate(ctime),
    // MsDates: {
    //   creationDate: GetFormatedDate(birthtimeMs),
    //   lastDataModificationDate: GetFormatedDate(mtimeMs),
    //   lastContentModificationDate: GetFormatedDate(ctimeMs),
    // },
  };
  res.json({
    succes: true,
    action: "upload",
    nextAction: "login",
    data: { imgData: fileDatas },
  });
}

module.exports = { create, upload };
