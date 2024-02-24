const {
  readFileSync,
  readdirSync,
  existsSync,
  unlinkSync,
  appendFileSync,
} = require("fs");

const GetValueFromAccountFile = (username, propertyPath) => {
  let coucou = ReadAccountFile(username);
  for (let i = 0; i < propertyPath.length; i++) {
    coucou = coucou[propertyPath[i]];
    if (i === propertyPath.length - 1) {
      return coucou;
    }
  }
};

const Token = (token) => {
  let TokenList = readFileSync(
    "../assets/tokens.prop",
    "utf-8"
  ).split("\n");

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
  if (header === undefined) throw new Error("token is undefiend");
};

const TestReqBody = (reqBody) => {
  if (reqBody == {}) throw new Error("req.body is undefiend");
};

const ReadAccountFile = (username) => {
  try {
    return JSON.parse(
      readFileSync(
        "../assets/Users/" +
          encodeURIComponent(username) +
          ".json",
        "utf-8"
      )
    );
  } catch (error) {
    console.error("Fs error :%d", error.errno, "syscall :", error.syscall);
    return false;
  }
};

const GetFormatedDate = () => {
  const date = new Date();
  let MonthYear = "";
  let Day = "";
  let Hour = "";
  let Minute = "";
  //Get the Month and the Year
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
  readdirSync(
    "../assets/message/"
  ).forEach((file) => numberOfFiles++);
  let dateData = GetFormatedDate();

  let data = {
    id: numberOfFiles,
    author: {
      id: GetValueFromAccountFile(Token(writerToken), ["id"]),
      perms: GetValueFromAccountFile(Token(writerToken), ["account", "perms"]),
    },
    dateData: dateData,
  };
  return { post, data };
};

const Post2HTML = (parsedPost) => {
  const html = `<!DOCTYPE html><html><head><link rel='stylesheet' href='http://localhost:5000/api/assets?file=stylescss'></head><body><main class='${parsedPost.data.author.perms}'><h2 class='${parsedPost.data.author.perms}'>${parsedPost.post.title}</h2><br /><p class='${parsedPost.data.author.perms}'>${parsedPost.post.content}</p><br /></main></body></html>`;
  return html;
};

const DelPost = (postID) => {
  if (
    existsSync(
      `../assets/message/${parseInt(
        postID
      )}.json`
    )
  ) {
    unlinkSync(
      `../assets/message/${parseInt(
        postID
      )}.json`
    );
    return true;
  } else {
    return false;
  }
};

const generateToken = () => {
  return (
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2)
  );
};

const AppendTokenFile = (username) => {
  let token = generateToken();
  appendFileSync(
    "../assets/tokens.prop",
    `${username}=${token}\n`,
    "utf-8"
  );
  console.info(`Token ${token} was assignated to ${username}`);
  return token;
};

const IsTokenAlredyAssignatedTo = (username) => {
  let IsTokenAlredyAssignatedTo;
  let TokenList = readFileSync(
    "../assets/tokens.prop",
    "utf-8"
  ).split("\n");

  for (let i = 0; i < TokenList.length; i++) {
    const userAndToken = TokenList[i];
    if (userAndToken.split("=")[0] === username) {
      IsTokenAlredyAssignatedTo = true;
    }
  }

  if (IsTokenAlredyAssignatedTo) {
    console.log(true);
    return true;
  } else {
    console.log(false);
    return false;
  }
};

const TokenExists = (token) => {
  let tokens = [];
  readFileSync(
    "../assets/tokens.prop",
    "utf-8"
  )
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

function CanLike(postId, userId) {
  const postLikes = readFileSync(
    "../assets/likes.prop",
    "utf-8"
  )
    .split("\n")
    .filter((post) => post.startsWith(postId.toString()))
    .map((string) => string.replace("\r", ""));
  const likers = postLikes.filter(
    (likedPost) =>
      likedPost.split("=")[1]["split"](",")[0] === userId.toString()
  );
  return likers.length > 1 ? false : true;
}

module.exports = {
  GetValueFromAccountFile,
  ReadAccountFile,
  TestTokenHeader,
  TestReqBody,
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
};
