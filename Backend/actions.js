if (!require("./features.json").APIActions.enabled) {
  console.warn("This feature isn't enabled");
  process.exit(1);
}
const { Token } = require("./Routes/utils");
const { getDatas } = require("./Routes/messages/messages.post");
const { del } = require("./Routes/messages/messages.delete");
const { like, edit } = require("./Routes/messages/messages.put");
const { create } = require("./Routes/messages/messages.patch");
const fs = require("fs");
const token = process.argv.forEach((arg, i) => {
  if (arg === "-token" && typeof process.argv[i + 1] === "string") {
    process.env.TOKEN = process.argv[i + 1];
  }
});
const Posts = {
  datas: getDatas,
  delete: del,
  like,
  edit,
  create,
};
//Define res, res
let Json = {};
let json = (responseJSON) => {
  Json = responseJSON;
};
let STATUS = {};
let status = (responseSTATUS) => {
  STATUS = responseSTATUS;
};
const res = { status, json };
switch (process.argv[2]) {
  case "deleteP":
    Posts.delete(
      {
        headers: { "localpost-token": process.env.TOKEN },
        body: {},
        params: { id: process.argv[process.argv.indexOf("-id") + 1] },
        json,
      },
      res
    );
    console.log("\n");
    console.info(
      `Post n°${
        process.argv[process.argv.indexOf("-id") + 1]
      } deleted by ${Token(process.env.TOKEN)}.`
    );
    console.log("\n");
    break;
  case "createP":
    if (
      process.argv[process.argv.indexOf("-content") + 1] === undefined ||
      process.argv[process.argv.indexOf("-title") + 1] === undefined
    )
      break;
    Posts.create(
      {
        headers: { "localpost-token": process.env.TOKEN },
        body: {
          post: {
            content: process.argv[process.argv.indexOf("-content") + 1],
            title: process.argv[process.argv.indexOf("-title") + 1],
          },
        },
        json,
      },
      res
    );
    console.log("\n");
    console.info(
      `Post n°${Json.postID} created by ${Token(
        process.env.TOKEN
      )} avec le titre : "${
        process.argv[process.argv.indexOf("-title") + 1]
      }" et le contenu : "${
        process.argv[process.argv.indexOf("-content") + 1]
      }"`
    );
    console.log("\n");
    break;
  case "likeP":
    if (
      process.argv[process.argv.indexOf("-reactcode") + 1] === undefined ||
      process.argv[process.argv.indexOf("-id") + 1] === undefined
    )
      break;
    Posts.like(
      {
        headers: { "localpost-token": process.env.TOKEN },
        body: {
          data: {
            reactCode: parseInt(
              process.argv[process.argv.indexOf("-reactcode") + 1]
            ),
          },
        },
        params: { id: process.argv[process.argv.indexOf("-id") + 1] },
        json,
      },
      res
    );
    console.log("\n");
    console.info(
      `Post n°${process.argv[process.argv.indexOf("-id") + 1]} liked by ${Token(
        process.env.TOKEN
      )}.`
    );
    console.log("\n");
    break;
  case "reacts":
    console.table({
      0: "Like",
      1: "Dislike",
      2: "D'accord",
      3: "Pas d'accord",
      4: "What ??",
    });
    break;
  case "show":
    try {
      console.log(
        JSON.parse(
          fs.readFileSync(
            "./assets/Users/" +
              process.argv[process.argv.indexOf("-name") + 1] +
              ".json",
            "utf-8"
          )
        )[process.argv[process.argv.indexOf("-name") + 1]] === undefined
          ? "Propriété non existante"
          : JSON.parse(
              fs.readFileSync(
                "./assets/Users/" +
                  process.argv[process.argv.indexOf("-name") + 1] +
                  ".json",
                "utf-8"
              )
            )[process.argv[process.argv.indexOf("-property") + 1]]
      );
    } catch (error) {
      console.log("Cet utilisateur n'existe pas");
    }
    break;
  case "?":
    console.table({
      createP: {
        for: "create a post",
        syntax: "npm run manager createP [args]",
        args: ["title", "content"],
      },
      deleteP: {
        for: "delete a post",
        syntax: "npm run manager deleteP [arg]",
        args: ["postID"],
      },
      likeP: {
        for: "create a post",
        syntax: "npm run manager likeP [args]",
        args: ["postID", "reactCode (see npm run manager reacts)"],
      },
      show: {
        for: "show infos for a user",
        syntax: "npm run manager show [args]",
        args: ["username", "property"],
      },
    });
    break;
  default:
    console.error(`La commande "${process.argv[2]}" n'est pas valide.`);
    break;
}
