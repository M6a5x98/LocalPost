const {
  TestTokenHeader,
  TestReqBody,
  GetPostProperties,
  Post2HTML,
  ReadAccountFile,
  Token,
  TokenExists,
} = require("../utils");
const { writeFileSync } = require("fs");

function create(req, res) {
  if (
    !TestReqBody(req["headers"]["content-type"]) ||
    TestTokenHeader(req["headers"]["localpost-token"])
  ) {
    res.status(400);
    res.json({
      message: `Bad "Content-type"/"localpost-token" header`,
      succes: false,
    });
    console.warn(
      `\x1b[2;255;127;39mRequest without localpost-token/Content-type header sended from ${req.ip}\x1b[0m`
    );
    return;
  } else {
    const token = req.headers["localpost-token"];
    const RawPost = req.body["post"];
    if (!TokenExists(token)) {
      res.json({
        succes: false,
        code: 106,
        message: `Token ${token} doesn't exists.`,
      });
      return;
    }

    const postProperties = GetPostProperties(RawPost, token);
    const HTML = Post2HTML(postProperties);
    const id = postProperties.data.id;
    let messages = ReadAccountFile(Token(token)).messages;
    messages.push(id);
    const builtFile = ReadAccountFile(Token(token));
    Object.defineProperty(builtFile, "messages", { value: messages });
    writeFileSync(
      `./database/messages/${id}.json`,
      JSON.stringify(postProperties),
      "utf-8"
    );
    writeFileSync(
      `./database/Users/${Token(token)}.json`,
      JSON.stringify(builtFile),
      "utf-8"
    );
    res.status(201).json({
      succes: true,
      data: { html: HTML, postID: postProperties.data.id },
    });
  }
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
