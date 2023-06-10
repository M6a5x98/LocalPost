let requeteUsername = new XMLHttpRequest();
let requetePassword = new XMLHttpRequest();
requeteUsername.open("POST", "url");
requetePassword.open("POST", "url");
let uname;
let pword;

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  uname = e.target[0].value;
  pword = e.target[1].value;
  /*requeteUsername.send(uname)
    requetePassword.send(pword)*/
});

//wait 30s

requetePassword.abort()
requeteUsername.abort()