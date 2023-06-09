function requete(username, password, urldetonserveur, titredupost, contenudupost) {
     requetet = new XMLHttpRequest()
     requetet.open("POST", urldetonserveur, false, username, password)
     requetet.send(titredupost)
     requetec = new XMLHttpRequest()
     requetec.open("GET", urldetonserveur, false, username, password)
     requetec.send(contenudupost)
}