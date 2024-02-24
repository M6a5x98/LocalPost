const {
  ReadAccountFile,
  generateToken,
  AppendTokenFile,
  IsTokenAlredyAssignatedTo,
} = require("../utils");

function post(req, res) {
  let username;
  let password;
  try {
    username = req.body.data.username;
    password = req.body.data.password;
  } catch (error) {
    res.status(400);
    res.send(`
        <h1>Error</h1>
        <strong>Bonjour, s'il vous plaît arretez de faire joujou avec mon API,</strong><br />
        <p>vous saviez que si j'avais pas mis un try catch,</p><br />
        <p>le serveur aurait crash (ça rime hihihi)</p><br />
        <span><a href="https://github.com/m6a5x98" target="_blank">m6a5x98</a> le créateur de l'API vous remercie de prendre compte au + vite de ce message et de mettre le header qu'il faut</span>
        <footer>
        <p>For pepole who come from USA or from other countries I didn't do the translation so use <a href="https://translate.google.com/">the best tool</a> !</p>
        </footer>`);
    console.warn(`Request without Content-Type header sended from ${req.ip}`);
    return;
  }
  //read Data
  if (!ReadAccountFile(username)) {
    res.json({ error: true, code: 101, message: "User Not Found" });
    res.status(200);
    return;
  }
  if (ReadAccountFile(username).password === password) {
    if (IsTokenAlredyAssignatedTo(username)) {
      res.status(200);
      res.json({
        error: true,
        code: 104,
        message: "Unauthorized connection from multiple devices",
      });
    } else {
      res.setHeader("localpost-token", AppendTokenFile(username));
      res.json({
        succes: true,
        userData: {
          username: ReadAccountFile(username).username,
          id: ReadAccountFile(username).id,
        },
      });
      res.status(200);
      return;
    }
  } else {
    res.json({ error: true, code: 102, message: "Wrong password" });
    res.status(200);
    return;
  }
}
module.exports = { post };

/*{
      data: { username: u, password: p },
      navigatorData: {
        langs: navigator.languages,
      }
*/
