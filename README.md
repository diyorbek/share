# Share

Small platform for storing and sharing any type of text. A simple [Pastebin](pastebin.com) alternative. [Here](/helpers/pasteLanguages.js) you can see the supported text types.

## API documentation

### Registration

**Endpoint:** `POST /auth/register`

**Body:**

```json
{
  "firstName": "Peter",
  "lastName": "Parker",
  "email": "a@b.cc",
  "password": "strong_password"
}
```

**Responses:**

Success: (201) `"Registered successfully"`

If user already exists: (409) `"Registered successfully"`

Missing field: (400) `"Invalid request"`

### Authentication

**_Authentication is based on JWT and it is sent as a cookie._**

**Endpoint:** `POST /auth/login`

**Body:**

```json
{
  "email": "a@b.cc",
  "password": "strong_password"
}
```

**Responses:**

Success: (200) `"Logged in successfully"` (sets `access_token` cookie)

Missing field: (400) `"Invalid request"`

Wrong credentials: (409) `"Email or password is incorrect"`

### Get paste

This endpoint is publicly available.

**Endpoint:** `GET /api/paste/:id`

**Responses:**

Success: (200)

```json
{
  "title": "first",
  "content": "int main() { return 0; }",
  "language": "C++",
  "expiresAt": "2022-10-08T15:10:26.722Z"
}
```

If paste is not found or expired: (404) `"Not found"`

### Get pastes of a user

Only authenticated users may access.

**Endpoint:** `GET /api/paste`

**Headers:**

```
Cookie: access_token=token
```

**Responses:**

Success: (200)

```json
[
  {
    "title": "first",
    "content": "int main() { return 0; }",
    "language": "C++",
    "expiresAt": "2022-10-08T15:10:26.722Z"
  },
  {
    "title": "second",
    "content": "int main() { return 0; }",
    "language": "C",
    "expiresAt": "2022-10-08T15:10:26.722Z"
  }
]
```

If paste is not found or expired: (404) `"Not found"`

### Create paste

Only authenticated users may access.

**Endpoint:** `POST /api/paste`

**Headers:**

```
Cookie: access_token=token
```

**Body:**

```json
{
  "title": "first",
  "content": "int main() { return 0; }",
  "language": "C++",
  "expiresAfter": "1M"
}
```

Expiration time values:

**1m** = 1 minute

**10m** = 10 minutes

**1H** = 1 hour

**1D** = 1 day

**1W** = 1 week

**1M** = 1 month

**6M** = 6 months

**1Y** = 1 year

**Responses:**

Success: (200)

```json
{
  "url": "http://localhost:5500/api/paste/QSxzN_6d",
  "title": "first",
  "content": "int main() { return 0; }",
  "language": "C++",
  "expiresAfter": "1M"
}
```

If there is missing field, expiration or content language is invalid: (400)

`"Invalid request"`
