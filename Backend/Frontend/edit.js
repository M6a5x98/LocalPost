async function checkToken() {
  if (document.cookie.includes("token=")) {
    console.info(`Vérification du token.`);
    let response = await fetch(
      "//" +
        location.host +
        "/api/check/tk/" +
        document.cookie
          .split("; ")
          .filter((e) => e.startsWith("token="))[0]
          .split("=")[1],
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    sessionStorage.setItem("localpost.username", response.username);
    return document.cookie.includes("token=") && response.result;
  } else {
    return false;
  }
}

function onTitleTextAreaInput() {
  document.querySelector("section#preview").innerHTML = "";
  document
    .querySelector("section#preview")
    .appendChild(
      AppendToPostContainer(
        sessionStorage.getItem("localpost.username"),
        DOMPurify.sanitize(
          marked.parse(document.querySelector("textarea#title_text").value)
        ),
        DOMPurify.sanitize(
          marked.parse(document.querySelector("textarea#content_text").value)
        )
      )
    );
}

function onContentTextAreaInput() {
  document.querySelector("section#preview").innerHTML = "";
  document
    .querySelector("section#preview")
    .appendChild(
      AppendToPostContainer(
        sessionStorage.getItem("localpost.username"),
        DOMPurify.sanitize(
          marked.parse(document.querySelector("textarea#title_text").value)
        ),
        DOMPurify.sanitize(
          marked.parse(document.querySelector("textarea#content_text").value)
        )
      )
    );
}

function createElementWithAttr(el, attrs, values) {
  const element = document.createElement(el);
  if (attrs.length !== values.length) return element;
  for (let i = 0; i < attrs.length; i++) {
    element.setAttribute(attrs[i], values[i]);
  }
  return element;
}

function AppendToPostContainer(username, title, content) {
  const postcontainer = createElementWithAttr("div", ["class"], ["post"]);
  const [
    usernamecontainer,
    titlecontainer,
    textcontainer,
    posttextcontainer,
    usercontainer,
    reactionscontainer,
    // likediv,
    // unlikediv,
    // whatdiv,
    // okdiv,
    // notokdiv,
  ] = [
    createElementWithAttr("h4", ["class"], ["username"]),
    createElementWithAttr("h3", ["class"], ["postTitle title"]),
    createElementWithAttr("p", ["class"], ["postContent content"]),
    createElementWithAttr("div", ["class"], ["postText"]),
    createElementWithAttr("div", ["class"], ["user"]),
    createElementWithAttr("div", ["class"], ["reactions"]),
    // createElementWithAttr("div", ["class", "style", "action"], ["like focusEl icon", "--normal-width: 1vw; --normal-height: 1vh; --more: 2%;", "like"]),
    // createElementWithAttr("div", ["class", "style", "action"], ["dislike focusEl icon", "--normal-width: 1vw; --normal-height: 1vh; --more: 2%;", "dislike"]),
    // createElementWithAttr("div", ["class", "style", "action"], ["what focusEl icon", "--normal-width: 1vw; --normal-height: 1vh; --more: 2%;", "what"]),
    // createElementWithAttr("div", ["class", "style", "action"], ["ok focusEl icon", "--normal-width: 1vw; --normal-height: 1vh; --more: 2%;", "ok"]),
    // createElementWithAttr("div", ["class", "style", "action"], ["notok focusEl icon", "--normal-width: 1vw; --normal-height: 1vh; --more: 2%;", "notok"]),
  ];
  [
    usernamecontainer.textContent,
    titlecontainer.innerHTML,
    textcontainer.innerHTML,
  ] = [username, title, content];
  usercontainer.append(
    usernamecontainer,
    createElementWithAttr(
      "img",
      ["src"],
      ["/api/assets?file=pdp&name=" + username]
    )
  );
  posttextcontainer.append(titlecontainer, textcontainer);
  // reactionscontainer.append(likediv, unlikediv, okdiv, notokdiv, whatdiv);
  reactionscontainer
    .querySelectorAll("div.focusEl")
    .forEach((div) =>
      div.appendChild(
        createElementWithAttr(
          "img",
          ["src", "type"],
          [`/api/assets?file=svg&name=${div.getAttribute("action")}`, "svg"]
        )
      )
    );
  postcontainer.append(usercontainer, posttextcontainer, reactionscontainer);
  return postcontainer;
}
/**
 *
 * @param {boolean} create
 */
async function sendMessageRequest(create) {
  if (
    // location.pathname.split("/").filter((e) => e !== "")[
    //   location.pathname.split("/").filter((e) => e !== "").length - 1
    // ] === "create"
    create
  ) {
    if (
      !confirm(
        await GetTranslation("confirm_create_post", {
          server: {
            url:
              "//" +
              location.host +
              "/modules/translatorjs/" +
              navigator.languages.toString(),
            key: ["data"],
          },
        })
      )
    )
      return;
    await fetch("//" + location.host + "/api/messages", {
      method: "PATCH",
      body: JSON.stringify({
        post: {
          title: document.querySelectorAll("textarea").item(0).value,
          content: document.querySelectorAll("textarea").item(1).value,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        "localpost-token": document.cookie
          .split("; ")
          .filter((e) => e.startsWith("token="))[0]
          .split("=")[1],
      },
    });
  } else if (
    // location.pathname.split("/").filter((e) => e !== "")[
    //   location.pathname.split("/").filter((e) => e !== "").length - 1
    // ] === "edit"
    !create
  ) {
    if (
      !confirm(
        await GetTranslation("confirm_edit_post", {
          server: {
            url:
              "//" +
              location.host +
              "/modules/translatorjs/" +
              navigator.languages.toString(),
            key: ["data"],
          },
        })
      )
    )
      return;
    let response = await fetch(
      "//" +
        location.host +
        "/api/messages/edit/" +
        sessionStorage.getItem("localpost.postID"),
      {
        method: "PUT",
        body: JSON.stringify({
          data: {
            newPost: {
              title: document.querySelectorAll("textarea").item(0).value,
              content: document.querySelectorAll("textarea").item(1).value,
            },
          },
        }),
        headers: {
          "Content-Type": "application/json",
          "localpost-token": document.cookie
            .split("; ")
            .filter((e) => e.startsWith("token="))[0]
            .split("=")[1],
        },
      }
    );
    location.replace("/home");
  }
}

document.addEventListener("DOMContentLoaded", async (e) => {
  sessionStorage.removeItem("localpost.postID");
  location.queries = {};
  location.search
    .replace("?", "")
    .split("&")
    .forEach((e) =>
      Object.defineProperty(location.queries, e.split("=")[0], {
        value: e.split("=")[1],
      })
    );
  if (await checkToken()) {
    document
      .querySelector("textarea#title_text")
      .addEventListener("input", (e) => {
        onTitleTextAreaInput();
      });
    document
      .querySelector("textarea#content_text")
      .addEventListener("input", (e) => {
        onTitleTextAreaInput();
      });
    document
      .querySelector("button#publish")
      .addEventListener("click", async (e) => {
        if (
          (document.querySelectorAll("textarea").item(0).value !== "" ||
            document.querySelectorAll("textarea").item(1).value !== "") &&
          location.queries["post"] !== undefined
        ) {
          await sendMessageRequest(false);
        } else if (
          (document.querySelectorAll("textarea").item(0).value !== "" ||
            document.querySelectorAll("textarea").item(1).value !== "") &&
          location.queries["post"] === undefined
        ) {
          await sendMessageRequest(true);
        } else if (
          document.querySelectorAll("textarea").item(0).value === "" ||
          document.querySelectorAll("textarea").item(1).value === ""
        ) {
          alert(
            await GetTranslation("cant_publish_empty", {
              server: {
                url:
                  "//" +
                  location.host +
                  "/modules/translatorjs/" +
                  navigator.languages.toString(),
                key: ["data"],
              },
            })
          );
          location.replace("/home");
        }
      });
    document
      .querySelector("section#preview")
      .appendChild(
        AppendToPostContainer(
          sessionStorage.getItem("localpost.username"),
          DOMPurify.sanitize(
            marked.parse(document.querySelector("textarea#title_text").value)
          ),
          DOMPurify.sanitize(
            marked.parse(document.querySelector("textarea#content_text").value)
          )
        )
      );
    if (
      location.queries["post"] !== undefined &&
      parseInt(location.queries["post"]).toString() === "NaN"
    ) {
      document
        .querySelector("nav")
        .replaceChildren(
          createElementWithAttr(
            "span",
            ["type", "trjs", "trjsid"],
            ["warn", "", "postNotExist"]
          )
        );
    } else if (
      location.queries["post"] !== undefined &&
      parseInt(location.queries["post"]).toString() !== "NaN"
    ) {
      await fetch(
        "//" +
          location.host +
          "/api/messages/" +
          parseInt(location.queries["post"]).toString(),
        {
          method: "POST",
          "Content-Type": "application/json",
        }
      )
        .then((res) => res.json())
        .then(async (post) => {
          let response = await fetch(
            "//" +
              location.host +
              "/api/account?username=" +
              sessionStorage.getItem("localpost.username"),
            {
              method: "POST",
              body: JSON.stringify({
                data: {
                  actions: ["get id"],
                },
              }),
              headers: {
                "content-type": "application/json",
              },
            }
          );
          response = await response.json();
          if (
            response.data.askedAttributes[0]["value"] !==
            post.data[0].data.author.id
          ) {
            document
              .querySelector("nav")
              .replaceChildren(
                createElementWithAttr(
                  "span",
                  ["type", "trjs", "trjsid"],
                  ["warn", "", "cantEditPost"]
                )
              );
          } else {
            document.querySelector("textarea#content_text").value =
              post.data[0].post.content;
            document.querySelector("textarea#title_text").value =
              post.data[0].post.title;
            onContentTextAreaInput();
            onTitleTextAreaInput();
            sessionStorage.setItem("localpost.postID", post.data[0].data.id);
            document
              .querySelector("button#publish")
              .setAttribute("trjsid", "edit");
          }
          // console.log(post.data[0].data.author.id);
          // sessionStorage.setItem("localpost.editmode", "edit");
        });
    }
    await translate(
      () => {
        document.querySelector("title").textContent += " - Localpost";
      },
      {
        server: {
          url:
            "//" +
            location.host +
            "/modules/translatorjs/" +
            navigator.languages.toString(),
          key: ["data"],
        },
      }
    );
  } else {
    document.cookie = `token=null; Max-Age=0; Path=/;`;
    location.replace("/?from=posts%2Fedit");
  }
});
// let headersList = {
//   Accept: "*/*",
//   "User-Agent": "Thunder Client (https://www.thunderclient.com)",
// };

// let response = await fetch("http://localhost:5000/api/messages/3", {
//   method: "POST",
//   headers: headersList,
// });

// let data = await response.text();
// console.log(data);
