const nav = document.querySelector("nav");
/**
 *
 * @param {string[]} datasToGet An array with strings like this : 'get path/to/property'
 * @returns The server response
 */
async function getAccountData(datasToGet) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify({
    data: {
      actions: datasToGet,
    },
  });

  console.info(`Récupération des informations de l'utilisateur.`);
  let response = await fetch(
    "//" +
      location.host +
      "/api/account?username=" +
      sessionStorage.getItem("localpost.username"),
    {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    }
  );

  let data = await response.json();
  return data;
}
/**
 *
 * @param {"*" | "!pdp" | "pdp"} filter The filter for the users
 */
async function fetchUsers(filter) {
  if (filter === undefined) filter = "*";

  console.info(`Récupération de tous les utilisateurs.`);
  let res = await fetch(
    "//" + location.host + "/api/account/users?filter=" + filter
  );
  res = await res.json();
  return res.users;
}

async function checkToken() {
  if (sessionStorage.getItem("localpost.username") !== null) {
    sessionStorage.setItem("trjs.isException", true);
    sessionStorage.setItem("trjs.realPath", "/user/*");
    return true;
  }
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
/**
 *
 * @param {string} formatedDate The formated date like this : DDMMYYYYHHmm
 * @returns {Date} The unformated date
 */
function formatedDate2Date(formatedDate) {
  let date = { 0: "", 2: "", 4: "", 6: "", 8: "", 10: "" };
  for (let i = 0; i < formatedDate.length; i += 2) {
    date[i] = formatedDate.charAt(i) + formatedDate.charAt(i + 1);
  }
  return new Date(
    `${date[4]}${date[6]}-${date[2]}-${date[0]} ${date[8]}:${date[10]}`
  );
}

function load(div, attributesArray) {
  let attrs = {};
  attributesArray.forEach((attrib) => {
    attrs[attrib.asked] = attrib.value;
  });
  div.querySelector("img").setAttribute("src", attrs["account/profilePicture"]);
  div.querySelector("img").style.setProperty("--imgborder", "1px solid black");
  div.querySelector("div#labels > h3#username").textContent =
    decodeURIComponent(sessionStorage.getItem("localpost.username"));
  div
    .querySelector("div#labels > h3#username")
    .style.setProperty("--nameDisplayColor", attrs["account/nameDisplayColor"]);
  div.querySelector("div#labels > h4#accountperms").textContent =
    attrs["account/perms"];
  // div.querySelector("div > h5#join").textContent += formatedDate2Date(
  //   attrs["date"]
  // ).toLocaleDateString();
}
/**
 *
 * @param {string} name Name of the user
 * @param {string} signupFormatedDate Formated date like this : DDMMYYYYHHmm
 * @param {string} nameDisplayColor Color for display the username
 */
function UserSearchResultsBox(name, signupFormatedDate, nameDisplayColor) {
  //Create Box
  const [div, img, h3, span, a] = [
    document.createElement("div"),
    document.createElement("img"),
    document.createElement("h3"),
    document.createElement("span"),
    document.createElement("a"),
  ];
  div.setAttribute("class", "sresult");
  img.src = "/api/assets?file=pdp&name=" + name;
  a.textContent = name;
  a.setAttribute(
    "href",
    name !== sessionStorage.getItem("localpost.username")
      ? "/user/" + name
      : "/home"
  );
  h3.setAttribute("class", "srname");
  a.style.setProperty("--namecolor", nameDisplayColor);
  h3.appendChild(a);
  span.textContent = formatedDate2Date(signupFormatedDate).toLocaleDateString();
  span.setAttribute("class", "srfrom");
  div.appendChild(img);
  div.appendChild(h3);
  div.appendChild(span);
  //Append box to the DOM
  document.body.querySelector("section#search_results").appendChild(div);
}
/**
 *
 * @param {string} query The name of the user you search
 * @param {{name:string;date:string;hasPdp:boolean;}[]} ulist The list of users where search
 * @returns {object[]} The list with filtered users
 */
function search(query, ulist) {
  return ulist.filter((u) =>
    u.name.includes(encodeURIComponent(query).toLowerCase().trim())
  );
}
/**
 *
 * @param {Array<number>} ids The id of the post to create
 * @return {Promise<HTMLElement>} The div with datas inside
 */
async function PostContainer(ids) {
  /**
   *
   * @returns {Element}
   */
  function createElementWithAttr(el, attrs, values) {
    const element = document.createElement(el);
    if (attrs.length !== values.length) return element;
    for (let i = 0; i < attrs.length; i++) {
      element.setAttribute(attrs[i], values[i]);
    }
    return element;
  }
  const postscontainer = createElementWithAttr("div", ["class"], ["posts"]);
  const response = await fetch(
    "//" + location.host + "/api/messages/" + ids.toString(),
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
    }
  );
  let res;
  try {
    res = await response.json();
  } catch (error) {
    const [el, name, text] = [
      createElementWithAttr(
        "p",
        ["style", "class", "id" /*, "trjs"*/],
        ["text-align: center;margin: inherit;", "content", "nopost" /*, ""*/]
      ),
      createElementWithAttr(
        "span",
        ["style", "keepcolor"],
        [
          `color: ${
            document
              .querySelector("h3#username")
              .getAttribute("style")
              .split(": ")[
              document
                .querySelector("h3#username")
                .getAttribute("style")
                .split(": ")
                .indexOf("--nameDisplayColor") + 1
            ]
          };`,
          "",
        ]
      ),
      createElementWithAttr("span", ["keepcolor"], [""]),
    ];

    const opt = {
      server: {
        url:
          "//" +
          location.host +
          "/modules/translatorjs/" +
          navigator.languages.toString(),
        key: ["data"],
      },
      path:
        location.pathname.split("/").filter((e) => e !== "")[
          location.pathname.split("/").filter((e) => e !== "").length - 2
        ] === "user"
          ? "/user/*"
          : undefined,
    };
    if (
      location.pathname.split("/").filter((e) => e !== "")[
        location.pathname.split("/").filter((e) => e !== "").length - 1
      ] === "home"
    ) {
      name.textContent = await GetTranslation("nopost_you", opt);
      text.textContent = await GetTranslation("nopost_text_1", opt);
    } else {
      name.textContent = document.querySelector("h3#username").textContent;

      text.textContent = await GetTranslation("nopost_text_2", opt);
    }

    el.append(name, text);
    console.log(el);
    return el;
  }
  const idsToGet = [];
  for (const resData of res.data) {
    idsToGet.push(resData.data.author.id);
  }

  const usernamesResponse = await fetch(
    "//" + location.host + "/api/user/" + idsToGet.toString(),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const usernames = await usernamesResponse.json();
  const MenuOptions =
    location.pathname.split("/").filter((e) => e !== "")[
      location.pathname.split("/").filter((e) => e !== "").length - 2
    ] !== "user"
      ? ["delete_post", "edit_post"]
      : [];
  for (let i = 0; i < usernames.username.length; i++) {
    const [username, title, content, id] = [
      usernames.username[i],
      res.data[i].post.title,
      res.data[i].post.content,
      res.data[i].data.id,
    ];
    AppendToPostContainer(username, title, content, id);
  }

  function AppendToPostContainer(username, title, content, id) {
    title = DOMPurify.sanitize(marked.parse(title));
    content = DOMPurify.sanitize(marked.parse(content));
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
      threedots,
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

      createElementWithAttr("div", ["class"], ["option"]),
    ];
    [
      usernamecontainer.textContent,
      titlecontainer.innerHTML,
      textcontainer.innerHTML,
      usernamecontainer.style.color,
    ] = [
      username,
      title,
      content,
      sessionStorage.getItem("localpost.nameColor"),
    ];
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
    const tbody = createElementWithAttr("tbody", [], []);
    const table = createElementWithAttr(
      "table",
      ["class"],
      ["content hidden postoption"]
    );
    table.appendChild(tbody);
    for (const option of MenuOptions) {
      const el = createElementWithAttr("tr", [], []);
      const elChild = createElementWithAttr(
        "td",
        ["trjs", "trjsid"],
        ["", option]
      );
      if (
        location.pathname.split("/").filter((e) => e !== "")[
          location.pathname.split("/").filter((e) => e !== "").length - 2
        ] !== "user" &&
        option === "edit_post"
      ) {
        elChild.classList.add("linkTo:/posts/edit?post=" + id);
        elChild.setAttribute("link", "true");
      }
      // elChild.textContent = option;
      el.appendChild(elChild);
      tbody.append(el);
    }
    threedots.append(
      createElementWithAttr(
        "img",
        ["src"],
        ["/api/assets?name=options&file=svg"]
      ),
      table
    );
    postcontainer.append(
      usercontainer,
      posttextcontainer,
      threedots,
      reactionscontainer
    );
    postscontainer.append(postcontainer);
  }
  return postscontainer;
}

function ToggleReactIconsAnimation() {
  window.rticonstate = window.rticonstate === "on" ? "off" : "on";
  if (window.rticonstate === "on") {
    document.querySelectorAll("div.icon").forEach((el) =>
      el.addEventListener("click", (event) => {
        event.target.setAttribute("animation", "icon");
      })
    );
  } else {
    document.querySelectorAll("div.icon").forEach((el) =>
      el.removeEventListener("click", (event) => {
        event.target.setAttribute("animation", "icon");
      })
    );
  }
  return window.rticonstate;
}

document.addEventListener("DOMContentLoaded", async (e) => {
  sessionStorage.removeItem("localpost.username");
  if (
    location.pathname.split("/").filter((e) => e !== "")[
      location.pathname.split("/").filter((e) => e !== "").length - 2
    ] === "user"
  ) {
    sessionStorage.setItem(
      "localpost.username",
      location.pathname.split("/").filter((e) => e !== "")[
        location.pathname.split("/").filter((e) => e !== "").length - 1
      ]
    );
  }
  const checkedToken = await checkToken();
  //Set queries in location.queries
  location.queries = {};
  location.search
    .replace("?", "")
    .split("&")
    .forEach((e) =>
      Object.defineProperty(location.queries, e.split("=")[0], {
        value: e.split("=")[1],
      })
    );
  document.querySelector("title").textContent =
    location.pathname.split("/").filter((e) => e !== "")[
      location.pathname.split("/").filter((e) => e !== "").length - 2
    ] !== "user"
      ? "Mon Compte - LocalPost"
      : location.pathname.split("/").filter((e) => e !== "")[
          location.pathname.split("/").filter((e) => e !== "").length - 1
        ] + " - LocalPost";

  if (
    sessionStorage.getItem("localpost.username") ===
    location.pathname.split("/").filter((e) => e !== "")[
      location.pathname.split("/").filter((e) => e !== "").length - 1
    ]
  ) {
    location.replace("/home");
  }
  if (location.queries["search"] !== undefined) {
    //Check if it is a search page
    //Set text in the search input
    document.querySelector("form > input[type=search]").value =
      decodeURIComponent(location.queries["search"]);
    document
      .querySelector("section#profile > img#pdp")
      .style.setProperty("--imgborder", "none");
    //Create the <section> tag for append search results in
    const section = document.createElement("section");
    section.setAttribute("id", "search_results");
    document.body.appendChild(section);
    //Hide all elements with hideOnSearch attribute
    document
      .querySelectorAll("*[hideOnSearch]")
      .forEach((el) => (el.style.visibility = "hidden"));
    //Search the users
    const query = location.queries["search"];
    if (query === "") {
      document.querySelector("nav").style.setProperty("--warnsize", "1rem");
      document.querySelector("nav").innerHTML =
        '<span type="warn" trjs trjsid="search_empty"></span>';
      await translate(() => {}, {
        server: {
          url:
            "//" +
            location.host +
            "/modules/translatorjs/" +
            navigator.languages.toString(),
          key: ["data"],
        },
        path: "/home",
      });
      return;
    }
    const users = await fetchUsers("*");
    const searchQuery = search(query, users);
    searchQuery.forEach(async (user) => {
      let color = await getAccountData(["get account/nameDisplayColor"]);
      if (!(await checkToken()) || (color.error && color.code === 106)) {
        document.cookie = `token=null; Max-Age=0; Path=/`;
        location.replace("/?from=homesearch");
      }
      // color.data.askedAttributes[0]["value"];
      UserSearchResultsBox(user.name, user.date, color);
    });
    if (searchQuery.toString() === "") {
      document.querySelector("nav").innerHTML =
        '<span type="warn" trjs trjsid="search_not_found"></span>';
    }
    await translate(
      () => {
        document.querySelector("nav").innerHTML = document
          .querySelector("nav")
          .innerHTML.replace("$", "<strong>$</strong>");
        document.querySelector("nav > span > strong").textContent =
          decodeURIComponent(' "' + location.queries["search"] + '" ');
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
        path: "/home",
      }
    );
    return;
  }
  if (checkedToken) {
    const response = await getAccountData([
      "get account/perms",
      "get account/profilePicture",
      "get account/nameDisplayColor",
      "get id",
      "get messages",
    ]);
    let loadArgs = response.data.askedAttributes;
    load(document.querySelector("section#profile"), loadArgs);
    if (sessionStorage.getItem("localpost.nameColor") === null)
      sessionStorage.setItem("localpost.nameColor", loadArgs[2].value);

    document.querySelector("span#postsnbr").textContent =
      response.data.askedAttributes[4].value.length + " posts";
    const posts = [];
    for (const id of loadArgs[4]["value"]) {
      posts.push(id);
    }
    document.querySelector("form").addEventListener("submit", (e) => {
      location.replace("/home?search" + e["target"][0]["value"]);
    });
    document.body.appendChild(await PostContainer(posts));
    document.querySelectorAll("div.option > img").forEach((button) =>
      button.addEventListener("click", (e) => {
        e.target.parentElement
          .querySelector("table")
          .classList.toggle("hidden");
      })
    );
    document.querySelectorAll("*[link=true]").forEach((button) =>
      button.addEventListener("click", (e) => {
        location.href = e.target.className
          .split(" ")
          .filter((string) => string.startsWith("linkTo:"))[0]
          .slice(7);
      })
    );
    //Create options for translation
    const opt = {
      server: {
        url:
          "//" +
          location.host +
          "/modules/translatorjs/" +
          navigator.languages.toString(),
        key: ["data"],
      },
      path:
        location.pathname.split("/").filter((e) => e !== "")[
          location.pathname.split("/").filter((e) => e !== "").length - 2
        ] === "user"
          ? "/user/*"
          : undefined,
    };
    if (
      location.pathname.split("/").filter((e) => e !== "")[
        location.pathname.split("/").filter((e) => e !== "").length - 1
      ] === "home"
    ) {
      document.querySelector("h3#username").oncontextmenu = async (e) => {
        e.preventDefault();
        let x = confirm(await GetTranslation("account_delete", opt));
        if (x) {
          if (confirm(await GetTranslation("account_delete", opt))) {
            fetch(`//${location.host}/api/account/create`, {
              method: "DELETE",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                data: {
                  username: document.querySelector("h3#username").textContent,
                  password: prompt(await GetTranslation("password", opt)),
                },
              }),
            }).then(() => {
              location.reload();
            });
          } else {
            return;
          }
        } else {
          return;
        }
      };
    }

    await translate(() => {
      document
        .querySelector("div#labels")
        .querySelector("div > h5#join").textContent += formatedDate2Date(
        response.data.accountCreateDate
      ).toLocaleDateString();
    }, opt);
  } else {
    // await fetch("//" + location.host + "/api/disconnexion", {
    //   method: "POST",
    // });
    document.cookie = `token=null; Max-Age=0; Path=/`;
    location.replace("/?from=home");
  }
});
