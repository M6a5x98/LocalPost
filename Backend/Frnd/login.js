const nav = document.getElementById("nav");

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  sendLoginRequest(event);
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

  let response = await fetch("http://192.168.1.93:5000/api/login", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let data = await response.json();
  console.log(data);
  handleRequestResponse(data);
};

function handleRequestResponse(requestResponse) {
  if (requestResponse.error) {
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
  location.replace("/home");
}

//Make the button to show the password clickable
document.getElementById("view").onclick = (event) => {
  const PSWRinput = document.getElementById("passWord");
  const isPSWR = PSWRinput.getAttribute("type") === "password";
  if (isPSWR) PSWRinput.setAttribute("type", "text");
  else if (!isPSWR) PSWRinput.setAttribute("type", "password");
};

// Check if there is already a cookie
document.onload = (event) => {
  if (document.cookie.includes("token=")) login();
  else return;
};
