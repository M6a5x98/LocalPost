const express = require("express");
const {
  appendFileSync,
  rmdirSync,
  readdir,
  unlinkSync,
  writeFileSync,
  readFileSync,
} = require("fs");
const { TokenExists, IdToUserName, Token } = require("./Routes/utils");
const { Logger } = require("./logger");
const bowser = require("bowser");
const { createHash } = require("crypto");
const { resolve, sep } = require("path");
const app = express();
const port =
  process.argv.indexOf("-port") === -1
    ? 5000
    : parseInt(process.argv[process.argv.indexOf("-port") + 1]);

if (port !== 80) {
  console.log("You can send at /api/login");
  console.log("You can send at /api/account");
  console.log("You can send at /api/messages");
  console.log("You can send at /api/disconnexion");
}

// if (process.argv.indexOf("-clear") !== -1) {
//   writeFileSync(
//     "./assets/tokens.prop",
//     readFileSync("./assets/tokens.prop", "utf-8").replace(
//       readFileSync("./assets/tokens.prop", "utf-8").split("\n")[
//         readFileSync("./assets/tokens.prop", "utf-8")
//           .split("\n")
//           .indexOf(
//             readFileSync("./assets/tokens.prop", "utf-8")
//               .split("\n")
//               .filter(
//                 (line) =>
//                   !line.startsWith("#") &&
//                   line !== "" &&
//                   line.split("=")[0] ===
//                     process.argv[process.argv.indexOf("-clear") + 1]
//               )[0]
//           )
//       ] + "\n",
//       ""
//     )
//   );
// }

//Middleware
app.use(
  express.json({
    type: "application/json",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, PATCH, DELETE, GET"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,User-Agent,localpost-token"
  );
  res.setHeader("Report-Bug-Url", "https://github.com/m6a5x98/LocalPost/issues");
  if (require("./features.json").csvUAStats.enabled) {
    if (req.url.split("?")[0] === "/" || req.url.split("?")[0] === "/home") {
      appendFileSync(
        "./database/stats/UA.csv",
        `${createHash("sha256")
          .update(req.ip)
          .update("localpost")
          .digest("hex")};${bowser.parse(req.headers["user-agent"]).os.name};${
          bowser.parse(req.headers["user-agent"]).platform.type
        };${bowser.parse(req.headers["user-agent"]).browser.name}\n`
      );
    }
  }
  next();
});

app.use(require("./Routes/utils").TokenInCookies2TokenHeader);
//Setup de la route des assets
app.use("/api/assets", require("./assets.routes"));
app.get("/favicon.ico", (req, res) => {
  res.sendFile("./LPIcon.ico", {
    root: __dirname,
  });
});
app.get("/api/check/:protocol/:data", (req, res) => {
  switch (req.params["protocol"]) {
    case "tk":
      res.json({
        result: TokenExists(req.params["data"]),
        username: Token(req.params["data"]),
      });
      break;
    default:
      break;
  }
});
app.get("/api/user/:id", (req, res) => {
  const ids = [];
  for (const userID of req.params["id"].split(",")) {
    ids.push(IdToUserName(parseInt(userID)));
  }
  res.json({ username: ids });
});
app.get("/api/time", (req, res) => {
  res.send(readFileSync("assets/time", "utf8"));
});
// Setup de la route de login
app.use("/api/login", require("./Routes/login/login.routes"));
// Setup la route des comptes
app.use("/api/account", require("./Routes/account/account.routes"));
// Setup la route des messages
app.use("/api/messages", require("./Routes/messages/messages.routes"));
// Setup la route de la déconnexion
app.use(
  "/api/disconnexion",
  require("./Routes/disconnection/disconnection.routes")
);
app.use(
  "/modules/translatorjs",
  require("./assets/translator.js/translator.routes")
);
// Setup de la page d'accueil
app.get("/", (req, res) =>
  res.sendFile("./login.htm", { root: __dirname + "/Frontend" })
);
app.get("/home", (req, res) =>
  res.sendFile("./home.htm", { root: __dirname + "/Frontend" })
);
app.get("/user/:name", (req, res) =>
  res.sendFile("./home.htm", { root: __dirname + "/Frontend" })
);
app.get("/posts/edit", (req, res) =>
  res.sendFile("./edit.htm", { root: __dirname + "/Frontend" })
);
app.get("/privacy-policy", (req, res) =>
  res.sendFile("./privacy_policy.html", { root: __dirname + "/Frontend" })
);
app.get("/posts/:id", (req, res) =>
  res.sendFile("./message.html", { root: __dirname + "/Frontend" })
);
app.get("/signup", (req, res) =>
  res.sendFile("./signup.htm", { root: __dirname + "/Frontend" })
);
app.get("*", (req, res) => {
  res
    .setHeader("Content-Type", "text/html")
    .status(404)
    .send(
      `
    <strong style='color: red;'>The requested page doesn't exists or a bad protocol is used.</strong>
    <a href='/'>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20" fill="none">
        <rect x="6" y="11" height="8" width="8" stroke="#000" stroke-width="0.5"/>
        <polyline points="4,11 16,11 10,5 4,11" fill="#000"/>
      </svg>
    </a>`
    );
});

//Lancer le serveur
app.listen(port, () => {
  process.chdir(__dirname);
  if (port !== 80) {
    let ip = process.argv.includes("--public") ? "" : "localhost";

    if (!process.argv.includes("--public")) {
      console.log(
        `Le serveur a démarré au port ${port} : http://localhost:${port}/`
      );
    } else {
      require("http").get("http://ifcfg.me/", (res) => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          console.log(
            `Le serveur a démarré au port ${port} : http://${rawData}:${port}/`
          );
        });
      });
    }
  } else {
    new Logger("./server.log").log(
      "Server started at port 80",
      __filename.split(sep)[__filename.split(sep).length - 1]
    );
  }
  writeFileSync("assets/time", Date.now().toString());
  setInterval(() => {
    writeFileSync("assets/time", Date.now().toString());
    console.log("\x1b[32m[$temp manager] Deleting all temporary files");
    readdir("$temp/", { withFileTypes: true }, (err, files) => {
      files.forEach((file) => {
        if (file.isDirectory()) {
          rmdirSync(resolve(file.parentPath + file.name));
        } else {
          unlinkSync(resolve(file.parentPath + file.name));
        }
      });
    });
    console.log(
      "\x1b[31m[$temp manager] All temporary files were deleted\x1b[0m"
    );
  }, 600000);
});
