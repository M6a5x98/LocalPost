const { readdirSync, statSync, existsSync } = require("fs");
const { GetFormatedDate } = require("../utils");
function getUsers(req, res) {
  // Get all users
  let users = []; // {name: string, date: Date}
  const allCompFiles = [];
  readdirSync("./database/Users", {
    withFileTypes: true,
    encoding: "utf-8",
  })
    .filter((e) => e.isFile())
    .map((e) => e.name.split(".")[0])
    .forEach((e) => {
      allCompFiles.push({
        name: e,
        date: GetFormatedDate(statSync(`./database/Users/${e}.json`).birthtime),
        hasPdp: existsSync("./database/Users/img/" + e + ".jpg"),
      });
    });
  switch (req.query["filter"]) {
    case "*":
      users = allCompFiles;
      break;
    case "pdp":
      users = allCompFiles.filter((e) => e.hasPdp);
      break;
    case "!pdp":
      users = allCompFiles.filter((e) => !e.hasPdp);
      break;
    case undefined:
      res.status(400);
      res.json({
        succes: false,
        message: "Filter can't be undefined",
      });
      return;
    default:
      res.status(400);
      res.json({
        succes: false,
        message: "Incorrect filter : " + req.query["filter"],
      });
      return;
  }
  res.json({ users: users });
  return;
}

module.exports = { getUsers };
