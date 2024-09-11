const {
  readFileSync,
  readdirSync,
  existsSync,
  unlinkSync,
  appendFileSync,
  statSync,
  writeFileSync,
} = require("fs");
const { resolve, sep } = require("path");
const { Logger } = require("../logger");

const TokenInCookies2TokenHeader = (req, res, next) => {
  if (req.method === "GET" || req.headers["cookie"] === undefined) {
    next();
    return;
  }
  req.headers["cookie"]
    .split("; ")
    .filter((e) => e.includes("token"))
    .map((e) => e.split("="))
    .forEach((e) => {
      if (e[0] === "token") {
        req.headers["localpost-token"] = e[1];
      }
    });
  next();
};

const GetValueFromAccountFile = (username, propertyPath) => {
  let content = ReadAccountFile(username);
  for (let i = 0; i < propertyPath.length; i++) {
    content = content[propertyPath[i]];
    if (i === propertyPath.length - 1) {
      return content;
    }
  }
};

const Token = (token) => {
  let TokenList = readFileSync("./assets/tokens.prop", "utf-8").split("\n");

  for (let i = 0; i < TokenList.length; i++) {
    const userAndToken = TokenList[i];
    if (userAndToken.split("=")[1] === token) {
      return userAndToken.split("=")[0];
    } else {
      continue;
    }
  }
};

const TestTokenHeader = (header) => {
  return header === undefined;
};

const TestReqBody = (ctHeader) => {
  return ctHeader === "application/json";
};

const TestReqParams = (reqParams, param) => {
  return reqParams[param] === undefined;
};

const ReadAccountFile = (username) => {
  try {
    const result = JSON.parse(
      readFileSync(
        "./database/Users/" + encodeURIComponent(username) + ".json",
        "utf-8"
      )
    );
    return result;
  } catch (error) {
    console.log("\x1b[31mUser not found\x1b[0m");
    return false;
  }
};
/**
 *
 * @param {Date} date
 * @returns The formated date like this DDMMYYYYhhmm
 */
const GetFormatedDate = (date) => {
  let MonthYear = "";
  let Day = "";
  let Hour = "";
  let Minute = "";
  if (date.getMonth().toString().length === 1) {
    MonthYear =
      "0" +
      (parseInt(date.getMonth().toString()) + 1) +
      date.getFullYear().toString();
  } else {
    MonthYear =
      parseInt(date.getMonth().toString()) + 1 + date.getFullYear().toString();
  }
  //Get the Day
  if (date.getDate().toString().length === 1) {
    Day = "0" + date.getDate();
  } else {
    Day = date.getDate();
  }
  //Get the Hour
  if (date.getHours().toString().length === 1) {
    Hour = "0" + date.getHours().toString();
  } else {
    Hour = date.getHours().toString();
  }
  //Get the Minute
  if (date.getMinutes().toString().length === 1) {
    Minute = "0" + date.getMinutes().toString();
  } else {
    Minute = date.getMinutes().toString();
  }
  return Day + MonthYear + Hour + Minute;
};

const GetPostProperties = (rawPost, writerToken) => {
  let post = {
    title: rawPost.title,
    content: rawPost.content,
  };
  let numberOfFiles = 0;
  readdirSync("./database/messages/").forEach((file) => numberOfFiles++);
  let dateData = GetFormatedDate(new Date());

  let data = {
    id: numberOfFiles,
    author: {
      id: JSON.parse(
        readFileSync("./database/Users/" + Token(writerToken) + ".json", "utf8")
      )["id"],
      perms: JSON.parse(
        readFileSync("./database/Users/" + Token(writerToken) + ".json", "utf8")
      )["account"]["perms"],
    },
    dateData: dateData,
  };
  return { post, data };
};

const Post2HTML = (parsedPost) => {
  return "/api/messages/" + parsedPost.data.id;
};

const DelPost = (postID) => {
  if (existsSync(`./database/messages/${parseInt(postID)}.json`)) {
    writeFileSync(`./database/messages/${parseInt(postID)}.json`, "{}");
    return true;
  } else {
    return false;
  }
};

const generateToken = () => {
  return (
    Math.random().toString(36).substring(2) +
    "-" +
    Math.random().toString(36).substring(2) +
    "-" +
    Math.random().toString(36).substring(2)
  );
};

const AppendTokenFile = (username) => {
  let token = generateToken();
  appendFileSync("./assets/tokens.prop", `${username}=${token}\n`, "utf-8");
  new Logger("./routes.log").log(
    `Token ${token} assignated to ${username}`,
    __filename.split(require("path").sep)[
      __filename.split(require("path").sep).length - 1
    ]
  );
  require("./disconnecter")(username);
  return token;
};

const IsTokenAlredyAssignatedTo = (username) => {
  let IsTokenAlredyAssignatedTo;
  let TokenList = readFileSync("./assets/tokens.prop", "utf-8").split("\n");

  for (let i = 0; i < TokenList.length; i++) {
    const userAndToken = TokenList[i];
    if (userAndToken.split("=")[0] === username) {
      IsTokenAlredyAssignatedTo = true;
    }
  }
  return IsTokenAlredyAssignatedTo;
};
/**
 *
 * @param {string} token The *token* to check
 * @returns **true** if the token exists **false** if not
 */
const TokenExists = (token) => {
  let tokens = [];
  readFileSync("assets/tokens.prop", "utf-8")
    .split("\n")
    .forEach((line) => tokens.push(line.split("=")[1]));
  for (let i = 0; i < tokens.length; i++) {
    const element = tokens[i];
    if (element === token) {
      return true;
    }
  }
  return false;
};
/**
 *
 * @param {number} postId The *ID* of the post to check
 * @param {number} userId The *ID* of the user to check for
 * @returns {boolean} **false** if the user can't like **true** if he can
 */
function CanLike(postId, userId) {
  const postLikes = readFileSync("./assets/likes.prop", "utf-8")
    .split("\n")
    .filter((post) => post.startsWith(postId.toString()))
    .map((string) => string.replace("\r", ""));
  const likers = postLikes.filter(
    (likedPost) =>
      likedPost.split("=")[1]["split"](",")[0] === userId.toString()
  );
  return likers.length > 0 ? false : true;
}

const DataUrlToFile = (dataUrl, fileName) => {
  return {
    name: fileName + "." + dataUrl.match(/^data:.+\/(.+);base64,(.*)$/)[1],
    value: Buffer.from(
      dataUrl.match(/^data:.+\/(.+);base64,(.*)$/)[2],
      "base64"
    ),
  };
};
/**
 *
 * @param {number} id The Id of the user
 * @returns {string} The username matching with this Id
 */
const IdToUserName = (id) => {
  const creationDates = [];
  const files = readdirSync("./database/Users", { withFileTypes: true }).filter(
    (e) => e.isFile()
  );
  for (const file of files) {
    creationDates.push({
      date: statSync(resolve(file.path) + sep + file.name).birthtimeMs,
      name: file.name.split(".")[0],
    });
  }
  return id > creationDates.sort().length - 1
    ? null
    : creationDates.sort()[id]["name"];
};

module.exports = {
  TokenInCookies2TokenHeader,
  GetValueFromAccountFile,
  ReadAccountFile,
  TestTokenHeader,
  TestReqBody,
  TestReqParams,
  Token,
  GetFormatedDate,
  GetPostProperties,
  Post2HTML,
  DelPost,
  generateToken,
  AppendTokenFile,
  IsTokenAlredyAssignatedTo,
  TokenExists,
  CanLike,
  DataUrlToFile,
  IdToUserName,
};

// class DisconnecterStackManager {
//   static #log() {}
//   /**
//    *
//    * @param {Date} date
//    * @param {String} token
//    * @returns expiration date of the token
//    */
//   static add(date, token) {
//     appendFileSync(
//       "./assets/disconnection.prop",
//       `${Token(token)}=${date.getTime() + 5400000}\n`
//     );
//     return date.getTime() + 5400000;
//   }
//   /**
//    *
//    * @param {Date} initDate
//    * @param {String} token
//    */
//   static remove(initDate, token) {
//     // writeFileSync(
//     //   "./assets/disconnection.prop",
//     //   readFileSync("./assets/disconnection.prop", "utf-8").replace(
//     //     `${Token(token)}=${initDate.getTime() /* + 5400000*/}`
//     //   )
//     // );
//     console.log(`${Token(token)}=${initDate.getTime() /* + 5400000*/}`);
//     return `${Token(token)}=${initDate.getTime() /* + 5400000*/}`;
//   }
// }
// // DisconnecterStackManager.remove(new Date(), "imlpjkf61wil5ajucmjrp");
