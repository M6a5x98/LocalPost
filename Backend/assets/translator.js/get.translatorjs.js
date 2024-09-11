const { existsSync, readFileSync } = require("fs");

function getJSON(req, res) {
  const languages = req.params["language"].split(",");
  for (let i = 0; i < languages.length; i++) {
    const language = languages[i].split("-")[0];
    if (
      existsSync(
        "./assets/translator.js/translations/" + language + ".translation.json"
      )
    ) {
      res.status(200).json({
        succes: true,
        data: JSON.parse(
          readFileSync(
            "./assets/translator.js/translations/" +
              language +
              ".translation.json",
            "utf-8"
          )
        ),
      });
      return;
    }
  }
  res.status(404).json({
    succes: false,
    message: "Language not found. Sending english instead.",
    data: JSON.parse(
      readFileSync(
        "./assets/translator.js/translations/en.translation.json",
        "utf-8"
      )
    ),
  });
}

module.exports = { getJSON };
