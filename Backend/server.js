const express = require("express");
const { readFileSync, existsSync } = require("fs");
const app = express();
const port = 5000;

//Middleware
app.use(express.json());
app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Set-Cookie", "LPVersion=1.0.0");
  res.setHeader("Report-Bug-Url", "https://github.com/m6a5x98/Posts/issues");
  next();
});

//Setup de la route des assets
app.use("/api/assets", async (req, res) => {
  let e = true;
  switch (req.query["file"]) {
    case "stylescss":
      res.send(readFileSync("./assets/styles.css", "utf-8"));
    case "pdp":
      try {
        readFileSync(
          "/Fichiers.txt/Code/LocalPost/FrontAndBack/Backend/assets/Users/" +
            req.query["name"] +
            ".jpg"
        );
      } catch (error) {
        res.status(404);
        res.send(
          "<strong style='color: red'>Error : </strong><span style='color: orangered'>User \"" +
            req.query["name"] +
            '" not found.</span>'
        );
        console.log(
          `File /Fichiers.txt/Code/LocalPost/FrontAndBack/Backend/assets/Users/${req.query["name"]}".jpg doesn't exists, 404 sent to client(${req.ip}).`
        );
        e = false;
        return;
      }
      e = true;
      if (e) {
        await res.sendFile(
          "/Fichiers.txt/Code/LocalPost/FrontAndBack/Backend/assets/Users/" +
            req.query["name"] +
            ".jpg"
        );
        console.log(
          `File /Fichiers.txt/Code/LocalPost/FrontAndBack/Backend/assets/Users/${req.query["name"]}".jpg succesfully sended to client(${req.ip}).`
        );
      }
      return;
    case "likescode":
      res.sendFile(
        "/Fichiers.txt/Code/LocalPost/FrontAndBack/Backend/assets/likescode.txt"
      );
  }
});
// Setup de la route de login
app.use("/api/login", require("./Routes/login/login.routes"));
console.log("You can send at /api/login");
// Setup la route des comptes
app.use("/api/account", require("./Routes/account/account.routes"));
console.log("You can send at /api/account");
// Setup la route des messages
app.use("/api/messages", require("./Routes/messages/messages.routes"));
console.log("You can send at /api/messages");
// Setup la route de la déconnexion
app.use(
  "/api/disconnexion",
  require("./Routes/disconnection/disconnection.routes")
);
console.log("You can send at /api/disconnexion");
// Setup de la page d'accueil
app.get("/", (req, res) =>
  res.sendFile("/Fichiers.txt/Code/LocalPost/Localpost.png")
);

//Lancer le serveur
app.listen(port, () => console.log(`Le serveur a démarré au port ${port}`));
