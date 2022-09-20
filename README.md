# Haste Project API

## Usage

- [/user] route
  - /user (POST) - account creation - request body:
    - username - account name
    - secret - RFC3548 secret encoded by user **password**

    NOTE: **password** must be at least 8 characters long!

  ```typescript
    {
        username: string,
        secret: string
    }
  ```

  - /user/login (POST) - login - request body:
    - username - account name
    - password - password provided when creating the account
    - token - 6-digit token from the authenticator app
    - uid - unique device identifier

    **Returns JWT** inside "Set-Cookie" header

  ```typescript
    {
        username: string,
        password: string,
        token: string,
        uid: string
    }
  ```

- [/profile] route
  - /profile (POST) - profile creation - request body:
  
    **JWT must be provided inside Cookie header**

  ```typescript
    {
        firstName: string,
        location: [number, number],
        birthDate: Date,
        sex: string,
        target: string,
        intimacy: string,
        photos: string[],
        interests: string[],
        socials: string[],
        bio: string
    }
  ```

  - /profile (GET) - returns logged user's profile

    **JWT must be provided inside Cookie header**

  - /profile/user/`<username>` (GET) - returns the profile of the user specified in the `username` param

  - /profile/nearby?radius=`<radius in meters>` (GET) - returns profiles of every user in nearby area of requesting user

## What is done?

- ✅  MVC project structure
- ✅  MongoDB added
- ✅  User endpoint (login/create)
- ✅  T2F Auth with secret encrypted by password
- ✅  Generating JWT after login (JWT Web Token)
- ✅  Middleware for validating JWT
- 🟨  Profiles
- 🟨  Geospartial Queries
- ✅  Ban

## To do?

- ➡️ Matching algorithm (AI & more)

- ➡️ Add WebRTC for communication
