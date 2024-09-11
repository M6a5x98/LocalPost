const {
  ReadAccountFile,
  AppendTokenFile,
  IsTokenAlredyAssignatedTo,
  TestReqBody,
} = require("../utils");
const { Logger } = require("../../logger");
const { createHash } = require("crypto");
const { parse } = require("bowser");

function post(req, res) {
  if (!TestReqBody(req["headers"]["content-type"])) {
    res.status(400);
    res.json({
      succes: false,

      message: `Bad Content type header`,
      error: true,
    });
    console.warn(
      `\x1b[2;255;127;39mRequest without Content-Type header sended from ${req.ip}\x1b[0m`
    );
    return;
  } else {
    const username = req.body.data.username;
    const password = createHash("sha256")
      .update(req.body.data.password)
      .update("localpost")
      .digest("hex")
      .toUpperCase();

    new Logger("./routes.log").log(
      `Connexion tried for "${username}" from "${
        parse(req.headers["user-agent"]).browser.name
      }" v. "${parse(req.headers["user-agent"]).browser.version}" on "${
        parse(req.headers["user-agent"]).os.name
      }". UA is ${req.headers["user-agent"]}`,
      __filename.split(require("path").sep)[
        __filename.split(require("path").sep).length - 1
      ]
    );
    //read Data
    if (!ReadAccountFile(username)) {
      res.json({
        succes: false,

        code: 101,
        message: "User Not Found",
      });
      res.status(200);
      return;
    }
    if (ReadAccountFile(username).password === password) {
      if (IsTokenAlredyAssignatedTo(username)) {
        res.status(200);
        res.json({
          succes: false,

          code: 104,
          message: "Unauthorized connection from multiple devices",
        });
      } else {
        this.token = AppendTokenFile(username);
        // res.setHeader(
        //   "Set-Cookie",
        //   encodeURIComponent(
        //     "token=" +
        //       this.token +
        //       "; expires=" +
        //       require("dayjs")().add(150, "minute").toString()
        //   )
        // );
        res.json({
          succes: true,
          data: {
            username: ReadAccountFile(username).username,
            id: ReadAccountFile(username).id,
          },
          token: this.token,
        });
        res.status(200);
        return;
      }
    } else {
      res.json({
        succes: false,
        error: true,
        code: 102,

        message: "Wrong password",
      });
      res.status(200);
      return;
    }
  }
}
module.exports = { post };

/*{
      data: { username: u, password: p },
      navigatorData: {
        langs: navigator.languages,
      }
*/
