const nav = document.getElementById("nav");

/**
 *
 * @param {string} el
 * @param {Array<string>} attrs
 * @param {Array<string>} values
 * @returns {Element} The element that was created
 */
function createElementWithAttr(el, attrs, values) {
  const element = document.createElement(el);
  if (attrs.length !== values.length) return element;
  for (let i = 0; i < attrs.length; i++) {
    element.setAttribute(attrs[i], values[i]);
  }
  return element;
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (
    event.submitter.getAttribute("type") !== "submit" ||
    event.target[0].value === "" ||
    event.target[1].value === ""
  )
    return;
  else sendLoginRequest(event);
});

const sendLoginRequest = async ({ target }) => {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify({
    data: {
      username: target[0].value,
      password: target[1].value,
    },
  });

  let response = await fetch("//" + location.host + "/api/login", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let data = await response.json();
  handleRequestResponse(data);
};

function handleRequestResponse(requestResponse) {
  if (!requestResponse.succes) {
    nav.querySelector("span").setAttribute("class", "");
    nav.querySelector("span").setAttribute("type", "warn");
    nav.querySelector("span").textContent = requestResponse.message;
  } else if (requestResponse.succes) {
    document.cookie = `token=${requestResponse.token}; Max-Age=5400; SameSite=Lax`;
    nav.querySelector("span").setAttribute("class", "");
    nav.querySelector("span").setAttribute("type", "good");
    nav.querySelector("span").textContent =
      "Welcome " + requestResponse.data.username + " !";
    login();
  }
}

function login() {
  location.replace(
    location.queries["from"] !== undefined
      ? decodeURIComponent(location.queries["from"])
      : "/home"
  );
}

//Make the button to show the password clickable
document.getElementById("view").onclick = (event) => {
  const PSWRinput = document.getElementById("passWord");
  const isPSWR = PSWRinput.getAttribute("type") === "password";
  if (isPSWR) PSWRinput.setAttribute("type", "text");
  else if (!isPSWR) PSWRinput.setAttribute("type", "password");
};

// Check if there is already a cookie
document.addEventListener("DOMContentLoaded", async () => {
  location.queries = {};
  location.search
    .replace("?", "")
    .split("&")
    .forEach((e) =>
      Object.defineProperty(location.queries, e.split("=")[0], {
        value: decodeURIComponent(e.split("=")[1]),
      })
    );
  if (
    location.queries["username"] !== undefined &&
    location.queries["password"] !== undefined
  ) {
    await sendLoginRequest({
      target: [
        { value: location.queries["username"] },
        { value: location.queries["password"] },
      ],
    });
    return;
  }
  if (
    document.cookie.includes("token=") &&
    document.cookie
      .split("; ")
      .filter((e) => e.startsWith("token="))[0]
      .split("=")[1] !== "null"
  )
    login();
  // Add the updates to the dedicated section
  const response = await fetch(`//${location.host}/api/assets?file=releases`);
  const data = await response.json();
  const releases = [];
  for (let i = 0; i < data.length; i++) {
    releases.push(data[i]);
  }
  // console.log(releases);
  releases.forEach((release) => {
    const [updatesSection, version, major, description, itAdds] = [
      document.querySelector("section#updates"),
      createElementWithAttr("h3", ["class"], ["update"]),
      createElementWithAttr(
        "span",
        ["trjs", "trjsid"],
        ["", release.major ? "major_update" : "minor_update"]
      ),
      createElementWithAttr("p", ["class"], ["content"]),
      createElementWithAttr(
        "p",
        ["class", "trjs", "trjsid", "id"],
        ["content", "", "features_added", "additions_header"]
      ),
    ];
    version.textContent = release["version"] + " : ";
    version.appendChild(major);
    description.textContent = Object.keys(release.description).includes(
      navigator.language
    )
      ? release["description"][navigator.language]
      : release["description"]["en"];
    updatesSection.append(version, description, itAdds);
    //features
    const features = Object.keys(release.description).includes(
      navigator.language
    )
      ? release["features"][navigator.language]
      : release["features"]["en"];
    features.forEach((feature) => {
      let element = createElementWithAttr(
        "li",
        ["class"],
        ["addition content"]
      );
      element.textContent = feature;
      updatesSection.appendChild(element);
    });
  });
  translate(() => {}, {
    server: {
      url:
        "//" +
        location.host +
        "/modules/translatorjs/" +
        navigator.languages.toString(),
      key: ["data"],
    },
  });
});
