const url = "";
const nav = document.getElementById("nav");
let reqRes;
let requestLogin = new XMLHttpRequest();

reqRes = requestLogin.addEventListener("load", requestResponse);

function requestResponse() {
  if (JSON.parse(requestLogin.response).error) {
    nav.innerHTML =
      "<p class='warn'>Le mot de passe ou le nom d'utilisateur est faux.</p>" /*<div class='circle'>+</div>*/;
    console.error(JSON.parse(requestLogin.response).error);
  } else if (
    !JSON.parse(requestLogin.response).error &&
    JSON.parse(requestLogin.response).message === "Login"
  ) {
    nav.innerHTML =
      "<p class='good'>Login !</p>" /*<div class='circle'>+</div>*/;
    /*setTimeout(() => {
      location.replace("./home.htm");
    }, duration);*/
  }
  return JSON.parse(requestLogin.response);
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  requestLogin.open("POST", url, true);
  requestLogin.setRequestHeader("Content-Type", "application/json");
  u = e.target[0].value;
  p = e.target[1].value;
  requestLogin.send(
    JSON.stringify({ action: "Login", data: { username: u, password: p } })
  );
});
