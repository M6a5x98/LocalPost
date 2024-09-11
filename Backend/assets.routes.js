const { Router } = require("express");
const { readFileSync, existsSync } = require("fs");
const { resolve } = require("path");
const router = Router();
router.get("/", async (req, res) => {
  let e = true;
  if (req.query["file"].includes(".") || req.query["file"].includes("/")) {
    res.sendFile("../database/Users/img/none.jpg", { root: __dirname });
    res.status(404);
    // console.log(
    //   `File ./database/Users/img/${req.query["name"]}.jpg doesn't exists, 404 sent to client(${req.ip}).`
    // );
  }
  switch (req.query["file"]) {
    case "stylescss":
      res.send(readFileSync("../assets/styles.css", "utf-8"));
      break;
    case "pdp":
      if (req.query["name"].includes(".") || req.query["name"].includes("/")) {
        res.status(400);
        return;
      }
      let imageName = req.query["name"] + ".jpg";
      let imagePath = resolve("database", "Users", "img", imageName);

      if (existsSync(imagePath)) {
        res.sendFile(imagePath);
        // console.log(
        //   `File ${imagePath} succesfully sended to client(${req.ip}).`
        // );
      } else {
        let defaultImagePath = resolve("database", "Users", "img", "none.jpg");
        res.sendFile(defaultImagePath);
        // console.log(
        //   `File ${imagePath} doesn't exists, none.jpg sent to client(${req.ip}).`
        // );
      }
      break;
    case "likescode":
      res.sendFile("./assets/likescode.txt", {
        root: __dirname,
      });
      break;
    case "svg":
      if (
        !req.query["name"] ||
        !existsSync(resolve("Frontend", "svg", req.query["name"] + ".svg"))
      ) {
        res.sendFile(resolve("Frontend", "svg", "like.svg"));
        break;
      }
      res.sendFile(resolve("Frontend", "svg", req.query["name"] + ".svg"));
      break;
    case "theme":
      res.sendFile("./Frontend/localpost.theme.css", {
        root: __dirname,
      });
      break;
    case "module":
      if (
        !req.query["name"] ||
        !existsSync(resolve("Frontend", "modules", req.query["name"] + ".js"))
      ) {
        res
          .setHeader("content-type", "application/javascript")
          .status(404)
          .send("console.log('Module " + req.query["name"] + " not found')");
        break;
      }
      res.sendFile(resolve("Frontend", "modules", req.query["name"] + ".js"));
      break;
    case "loginstyle":
      res.sendFile("./Frontend/loginstyle.css", {
        root: __dirname,
      });
      break;
    case "loginscript":
      res.sendFile("./Frontend/login.js", {
        root: __dirname,
      });
      break;
    case "homestyle":
      res.sendFile("./Frontend/homestyle.css", {
        root: __dirname,
      });
      break;
    case "homescript":
      res.sendFile("./Frontend/home.js", {
        root: __dirname,
      });
      break;
    case "editstyle":
      res.sendFile("./Frontend/editstyle.css", {
        root: __dirname,
      });
      break;
    case "editscript":
      res.sendFile("./Frontend/edit.js", {
        root: __dirname,
      });
      break;
    case "signupstyle":
      res.sendFile("./Frontend/signupstyle.css", {
        root: __dirname,
      });
      break;
    case "signupscript":
      res.sendFile("./Frontend/signup.js", {
        root: __dirname,
      });
      break;
    case "releases":
      res.sendFile("./assets/releases.json", { root: __dirname });
      break;
    default:
      res.send("This assets doesn't exists");
      break;
  }
});
module.exports = router;
