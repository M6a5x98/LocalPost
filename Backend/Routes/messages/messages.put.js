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
  GetFormatedDate,
} = require("../utils");
const {
  appendFileSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} = require("fs");

function like(req, res) {
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
    const reactCode = req["body"]["data"]["reactCode"];
    if (!TokenExists(token)) {
      res.json({
        succes: false,
        code: 106,
        message: `Token ${token} doesn't exists.`,
      });
      return;
    }
    if (reactCode > 4) {
      res.status(400);
      res.json({
        succes: false,
        code: 103,
        message: "You must set `data.reactCode` in this request.",
      });
    }

    const postID = req.params["id"];
    if (CanLike(postID, GetValueFromAccountFile(Token(token), ["id"]))) {
      appendFileSync(
        "./assets/likes.prop",
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
        "./database/Users/" + Token(token) + ".json",
        JSON.stringify(userFile),
        "utf-8"
      );
      res.json({ succes: true });
    } else {
      res.json({ succes: false, message: "Can't like" });
    }
  }
}
function edit(req, res) {
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
    const newPost = req["body"]["data"]["newPost"];
    if (!TokenExists(token)) {
      res.json({
        succes: false,
        code: 106,
        message: `Token ${token} doesn't exists.`,
      });
      return;
    }

    const ActionPerformedByCreator =
      GetValueFromAccountFile(Token(token), ["id"]) ===
      JSON.parse(
        readFileSync(
          "./database/messages/" + req.params["id"] + ".json",
          "utf-8"
        )
      )["data"]["author"]["id"];
    const EditerIsAdminOrModo =
      GetValueFromAccountFile(Token(token), ["account", "perms"]) === "admin" ||
      GetValueFromAccountFile(Token(token), ["account", "perms"]) === "modo";

    if (ActionPerformedByCreator || EditerIsAdminOrModo) {
      const NewPostFile = JSON.parse(
        readFileSync(
          "./database/messages/" + req.params["id"] + ".json",
          "utf-8"
        )
      );

      Object.defineProperty(NewPostFile, "post", {
        value: { title: newPost.title, content: newPost.content },
      });

      writeFileSync(
        "./database/messages/" + req.params["id"] + ".json",
        JSON.stringify(NewPostFile),
        "utf-8"
      );
      /**/
      let post = {
        title: newPost.title,
        content: newPost.content,
      };
      let numberOfFiles = 0;
      readdirSync("./database/messages/").forEach((file) => numberOfFiles++);
      let dateData = GetFormatedDate(new Date());

      let data = {
        id: numberOfFiles,
        author: {
          id: JSON.parse(
            readFileSync("./database/Users/" + Token(token) + ".json", "utf8")
          )["id"],
          perms: JSON.parse(
            readFileSync("./database/Users/" + Token(token) + ".json", "utf8")
          )["account"]["perms"],
        },
        dateData: dateData,
      };
      /**/
      res.json({
        succes: true,
        html: Post2HTML({ post, data }),
      });
    } else {
      res.status(401);
      res.json({
        succes: false,
        code: 302,
        message: "You need higher perms to perform this action",
      });
    }
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
