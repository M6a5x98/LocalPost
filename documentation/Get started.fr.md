# Introduction

Bienvenue sur la documentation officielle de l'API LocalPost !
Avant tout, vous devez pouvoir :

- Envoyer des requêtes HTTP (Via [[`cURL`](https://curl.se/docs/tutorial.html)], [[`Invoke-WebRequest`](https://learn.microsoft.com/fr-fr/powershell/module/microsoft.powershell.utility/invoke-webrequest)], [[`Reqbin`](https://reqbin.com/)], `Postman`, ou d'autres outils similaires)
- Utiliser les Headers et les différentes méthodes (`POST`, `PUT`, `PATCH`, `DELETE`)

**Warning: L'utilisateur test que je vais utiliser n'existe pas, son token non plus. Son nom d'utilisateur sera `test` son token sera `192p198p1p1`, et son mot de passe `mein name ist test`**

## Headers

Pour chaque route mis à part `/api/login` vous devrez mettre dans la requête le header `localpost-token`. Mais un autre header devra être en permanence présent dans vos requêtes, il s'agit de `Content-Type`. Sa valeur devra obligatoirement être : `application/json` sans quoi vous recevrez un petit poème que j'ai concoté.

## Codes d'erreur

L'API a un certain nombre de codes d'erreur, les voici :

```properties
101=User not found
102=Wrong password
103=Bad request
104=Unauthorized connection from multiple devices
105=Post doesn‘t exits
106=Token doesn‘t exits
201=Request was too long
202=Internal server error
301=Need SecretPin
302=You need higher perms to perform this action
```

Les codes commençant par 1 indiquent une erreur côté client, ceux commençant par 2 une erreur côté serveur, et ceux commençant par 3 une condition à satifaire.
