const { readFileSync, writeFileSync } = require("fs");
const { Logger } = require("../logger");
function Disconnect(who) {
  setTimeout(() => {
    writeFileSync(
      "./assets/tokens.prop",
      readFileSync("./assets/tokens.prop", "utf-8").replace(
        readFileSync("./assets/tokens.prop", "utf-8").split("\n")[
          readFileSync("./assets/tokens.prop", "utf-8")
            .split("\n")
            .indexOf(
              readFileSync("./assets/tokens.prop", "utf-8")
                .split("\n")
                .filter(
                  (line) =>
                    !line.startsWith("#") &&
                    line !== "" &&
                    line.split("=")[0] === who
                )[0]
            )
        ] + "\n",
        ""
      )
    );
    new Logger("./routes.log").log(
      `${who} was succesfully disconnected.`,
      __filename.split(require("path").sep)[
        __filename.split(require("path").sep).length - 1
      ]
    );
  }, 5400000 /*6000*/);
}

module.exports = Disconnect;
