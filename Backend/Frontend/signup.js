/**
 *
 * @param {string} el
 * @param {Array<string>} attrs
 * @param {Array<string>} values
 * @returns {Element} The element that was created
 */
function createElementWithAttr(el, attrs, values) {
  const element = document.createElement(el);
  if (
    attrs.length !== values.length ||
    attrs === undefined ||
    values === undefined
  )
    return element;
  for (let i = 0; i < attrs.length; i++) {
    element.setAttribute(attrs[i], values[i]);
  }
  return element;
}

function CreateImageUploadForm() {
  document.querySelector("main").innerHTML = "";
  createElementWithAttr("form");
}

function DrawSecondForm(reverse) {
  if (!reverse) {
    document.querySelector("form").style.display = "none";
    document.querySelector("form#upload").style.display = "grid";
    return;
  } else if (reverse) {
    document.querySelector("form").style.display = "block";
    document.querySelector("form#upload").style.display = "none";
    return;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (
    parseInt(localStorage.getItem("token.expires")) <
    parseInt(Date.now() / 1000)
  ) {
    localStorage.removeItem("token.expires");
    localStorage.removeItem("token");
    localStorage.removeItem("logintoken");
  } else if (localStorage.getItem("token") !== null) {
    DrawSecondForm();
  }
  const trjsOptions = {
    server: {
      url:
        "//" +
        location.host +
        "/modules/translatorjs/" +
        navigator.languages.toString(),
      key: ["data"],
    },
  };
  //#region features
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
  //#endregion
  //#region infos_form_listener
  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const [name, password] = [event.target[0].value, event.target[1].value];
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      data: {
        name,
        password,
      },
    });

    let response = await fetch(
      "//" + location.host + "/api/account/create/infos",
      {
        method: "PATCH",
        body: bodyContent,
        headers: headersList,
      }
    );

    let data = await response.json();
    if (!data.succes) {
      const nav = document.querySelector("nav");
      nav.querySelector("span").setAttribute("class", "");
      nav.querySelector("span").setAttribute("type", "warn");
      nav.querySelector("span").textContent = data.message;
    } else if (data.succes) {
      fetch("//" + location.host + "/api/time")
        .then((res) => res.text())
        .then((res) => {
          res = parseInt(res);
          const time = res + 600000;
          localStorage.setItem("token", data.token);
          localStorage.setItem("logintoken", btoa(name + ";" + password));
          localStorage.setItem("token.expires", parseInt(time / 1000));
        });
      DrawSecondForm();
    }
  });
  //#endregion
  //#region pdp_events_listeners
  document
    .querySelector("input[type=file]")
    .addEventListener("input", async (e) => {
      GetTranslation("selected_file", trjsOptions).then((r) => {
        document.querySelector("#label_pp").textContent =
          r + e.target.files[0].name;
      });
    });
  document
    .querySelector("form#upload")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      /*if (e.target[0].files.length < 1) {
        let el = createElementWithAttr("span", ["type"], ["warn"]);
        el.textContent = await GetTranslation("no_file", trjsOptions);
        document.querySelector("nav").appendChild(el);
        return;
      } else*/ if (localStorage.getItem("token") === null) {
        DrawSecondForm(true);
        return;
      } else if (
        !e.target[0].files[0]?.type.startsWith("image/") &&
        e.target[0].files.length > 0
      ) {
        let el = createElementWithAttr("span", ["type"], ["warn"]);
        el.textContent = await GetTranslation("file_not_valid", trjsOptions);
        document.querySelector("nav").innerHTML = "";
        document.querySelector("nav").appendChild(el);
        return;
      } else if (e.target[0].files.length > 0) {
        GetFileAndCreateAccount(e);
      } else if (e.target[0].files.length === 0) {
        let fmData = new FormData();
        fmData.append("token", localStorage.getItem("token"));
        const req = await fetch(
          `//${location.host}/api/account/create/upload`,
          {
            method: "PATCH",
            body: fmData,
          }
        );
        const res = await req.json();
        if (!res.succes) {
          let el = createElementWithAttr("span", ["type"], ["warn"]);
          el.textContent = res.message;
          document.querySelector("nav").innerHTML = "";
          document.querySelector("nav").appendChild(el);
          localStorage.removeItem("token.expires");
          localStorage.removeItem("token");
          localStorage.removeItem("logintoken");
          return;
        } else {
          location.replace(
            `/?username=${encodeURIComponent(
              atob(localStorage.getItem("logintoken")).split(";")[0]
            )}&password=${encodeURIComponent(
              atob(localStorage.getItem("logintoken")).split(";")[1]
            )}`
          );
          localStorage.removeItem("token.expires");
          localStorage.removeItem("token");
          localStorage.removeItem("logintoken");
        }
      }
      function GetFileAndCreateAccount(e) {
        const file = e.target[0].files[0];
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 225;
          canvas.height = 225;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (newBlob) => {
            let fmData = new FormData();
            fmData.append("profile_picture", newBlob);
            fmData.append("token", localStorage.getItem("token"));
            const req = await fetch(
              `//${location.host}/api/account/create/upload`,
              {
                method: "PATCH",
                body: fmData,
              }
            );
            const res = await req.json();
            if (!res.succes) {
              let el = createElementWithAttr("span", ["type"], ["warn"]);
              el.textContent = res.message;
              document.querySelector("nav").innerHTML = "";
              document.querySelector("nav").appendChild(el);
              localStorage.removeItem("token.expires");
              localStorage.removeItem("token");
              localStorage.removeItem("logintoken");
              return;
            } else {
              location.replace(
                `/?username=${encodeURIComponent(
                  atob(localStorage.getItem("logintoken")).split(";")[0]
                )}&password=${encodeURIComponent(
                  atob(localStorage.getItem("logintoken")).split(";")[1]
                )}`
              );
              localStorage.removeItem("token.expires");
              localStorage.removeItem("token");
              localStorage.removeItem("logintoken");
            }
          }, "image/jpeg");
        };
      }
    });
  //#endregion
  document.getElementById("view").onclick = (event) => {
    const PSWRinput = document.getElementById("passWord");
    const isPSWR = PSWRinput.getAttribute("type") === "password";
    if (isPSWR) PSWRinput.setAttribute("type", "text");
    else if (!isPSWR) PSWRinput.setAttribute("type", "password");
  };
  await translate(() => {}, {
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
