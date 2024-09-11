# Introduction

Welcome to the LocalPost'API official documentation.<br>
Before you start, you must be able to:

- Send HTTP requests (With [`cURL`](https://curl.se/docs/tutorial.html), [`Invoke-WebRequest`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest), [`Reqbin`](https://reqbin.com/), `Postman`, or other similar tools)
- Use Headers and HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`)
- Know HTTP response codes. [MDN guid](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

**Warning: The "test" user I'm going to use doesn't exists, its token neither. Its username is `test` its token `192p198p1p1`, and its password `mein name ist test`**

## Headers

For each route except `/api/login` you must set the header `localpost-token`. But another header must be in your request, it's `Content-Type`. Its value must be : `application/json` else the reponse will be a poem write by me in french.

## Codes d'erreur

The API has custom error codes, you can see them behind :

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

Codes starting with 1 are client side error, Those starting with 2 a server side error, and those starting with 3 a condition required.
