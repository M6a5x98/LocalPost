const { Logger } = require("../../logger");
const {
  TestTokenHeader,
  TestReqBody,
  Token,
  GetValueFromAccountFile,
  TokenExists,
  GetFormatedDate,
} = require("../utils");
const { statSync } = require("fs");

const post = (req, res) => {
  if (!req.headers["localpost-token"]) req.headers["localpost-token"] = "";
  function getProperties(username) {
    const actions = req["body"]["data"]["actions"];
    let responseAttributesList = [];
    actions.forEach((action) => {
      let verb = action.substring(0, 3);
      let param = action.substring(4);
      if (param === "password") {
        res.status(401);
        res.json({
          succes: false,
          code: 302,
          message: "You need higher perms to perform this action",
        });
        return;
      }
      if (verb === "get") {
        responseAttributesList.push({
          asked: param,
          value: GetValueFromAccountFile(username, param.trim().split("/")),
        });
      }
    });

    res.status(200);
    res.json({
      succes: true,
      data: {
        askedAttributes: responseAttributesList,
        accountCreateDate: GetFormatedDate(
          statSync("./database/Users/" + username + ".json").birthtime
        ),
      },
    });
  }
  if (
    !TestReqBody(req["headers"]["content-type"]) ||
    !TestTokenHeader(req["headers"]["localpost-token"])
  ) {
    if (!req.query["username"]) {
      res.status(400);
      res.json({
        message: `Bad "Content-type"/"localpost-token" header`,
        succes: false,
      });
      new Logger().log(
        `Request without Content-Type header sended from ${req.ip}`,
        __filename.split(require("path").sep)[
          __filename.split(require("path").sep).length - 1
        ]
      );
      return;
    } else {
      getProperties(req.query["username"]);
    }
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
    getProperties(Token(token));
  }
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
