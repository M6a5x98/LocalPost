const {
  TestTokenHeader,
  TestReqBody,
  GetPostProperties,
  Post2HTML,
  ReadAccountFile,
  Token,
  TokenExists,
} = require("../utils");
const { writeFileSync, appendFileSync } = require("fs");

function create(req, res) {
  let token;
  let RawPost;
  try {
    TestReqBody(req.body);
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
  RawPost = req.body["post"];
  if (!TokenExists(token))
    res.json({
      error: true,
      code: 106,
      message: `Token ${token} doesn't exists.`,
    });

  const postProperties = GetPostProperties(RawPost, token);
  const HTML = Post2HTML(postProperties);
  const id = postProperties.data.id;
  let messages = ReadAccountFile(Token(token)).messages;
  messages.push(id);
  const builtFile = ReadAccountFile(Token(token));
  Object.defineProperty(builtFile, "messages", { value: messages });
  writeFileSync(
    `../../assets/message/${id}.json`,
    JSON.stringify(postProperties)
  );
  writeFileSync(
    `../../assets/Users/${Token(
      token
    )}.json`,
    JSON.stringify(builtFile)
  );
  res.json({ succes: true, html: HTML, postID: postProperties.data.id });
}

module.exports = { create };

/*{
    post: {
        content: '',
        title: ''
    },
    data: {
        userData: {
            ip: '',
            browserName: '',
            browerVersion: ''
        },
        dateData: 'DaDaMoMoYeYeYeYeHoHoMinMin'
    }
}
*/
