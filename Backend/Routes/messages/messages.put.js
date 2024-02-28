const {
  CanLike,
  Token,
  TestReqBody,
  TestTokenHeader,
  GetValueFromAccountFile,
  TokenExists,
  ReadAccountFile,
  GetPostProperties,
  Post2HTML,
} = require("../utils");
const { appendFileSync, readFileSync, writeFileSync } = require("fs");

function like(req, res) {
  let token;
  let reactCode;
  try {
    TestReqBody(req.body);
    TestTokenHeader(req.headers["localpost-token"]);
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
  token = req.headers["localpost-token"];
  reactCode = req.body.data.reactCode;
  if (!TokenExists(token))
    res.json({
      error: true,
      code: 106,
      message: `Token ${token} doesn't exists.`,
    });

  if (reactCode > 4) {
    res.status(400);
    res.json({
      error: true,
      code: 103,
      message: "You must set `data.reactCode` in this request.",
    });
  }

  const postID = req.params["id"];
  if (CanLike(postID, GetValueFromAccountFile(Token(token), ["id"]))) {
    appendFileSync(
      "../../assets/likes.prop",
      `${postID}=${GetValueFromAccountFile(Token(token), [
        "id",
      ])},${reactCode}\n`
    );
    const userFile = ReadAccountFile(Token(token));
    const UpdatedLikes = GetValueFromAccountFile(Token(token), ["likes"]);
    UpdatedLikes.push(parseInt(postID));
    Object.defineProperty(userFile, "likes", {
      value: UpdatedLikes,
    });

    writeFileSync(
      "../../assets/Users/" + Token(token) + ".json",
      JSON.stringify(userFile)
    );
    res.json({ succes: true });
  }
}

function edit(req, res) {
  let token;
  let newPost;
  try {
    TestTokenHeader(req.headers["localpost-token"]);
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
  token = req.headers["localpost-token"];
  newPost = req.body["data"]["newPost"];

  if (!TokenExists(token)) {
    res.json({
      error: true,
      code: 106,
      message: `Token ${token} doesn't exists.`,
    });
    return;
  }

  const ActionPerformedByCreator =
    GetValueFromAccountFile(Token(token), ["id"]) ===
    JSON.parse(
      readFileSync(
        "../../assets/message/" + req.params["id"] + ".json",
        "utf-8"
      )
    )["data"]["author"]["id"];
  const EditerIsAdminOrModo =
    GetValueFromAccountFile(Token(token), ["account", "perms"]) === "admin" ||
    GetValueFromAccountFile(Token(token), ["account", "perms"]) === "modo";

  if (ActionPerformedByCreator || EditerIsAdminOrModo) {
    const NewPostFile = JSON.parse(
      readFileSync(
        "../../assets/message/" + req.params["id"] + ".json",
        "utf-8"
      )
    );

    Object.defineProperty(NewPostFile, "post", {
      value: { title: newPost.title, content: newPost.content },
    });

    writeFileSync(
      "../../assets/message/" + req.params["id"] + ".json",
      JSON.stringify(NewPostFile)
    );

    res.json({ succes: true, html: Post2HTML(GetPostProperties(NewPostFile)) });
  } else {
    res.status(401);
    res.json({
      error: true,
      code: 302,
      message: "You need higher perms to perform this action",
    });
  }
}

module.exports = { like, edit };

/*{
  data: {
    reactCode: number
  }
}
*/
/*{
  data:{
    newPost:{
      title:"",
      content:""
    }
  }
}
*/
