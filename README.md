# Haste Project API

## Usage

- [/user] route
  - /user (POST) - account creation - request body:
    - phone - account phone number
    - password - account password

    NOTE: **password** must be at least 3 characters long (only for now)!

  ```typescript
    {
        username: string,
        password: string
    }
  ```

  - /user/login (POST) - login - request body:
    - phone - account phone number
    - password - password provided when creating the account
    - uid - unique device identifier

    **Returns JWT** inside "Set-Cookie" header

  ```typescript
    {
        username: string,
        password: string,
        uid: string
    }
  ```

- [/profile] route
  
  **JWT must be provided inside Cookie header**

  - /profile (POST) - profile creation - request body:

  ```typescript
    {
        firstName: string,
        birthDate: Date,
        location: [number, number],
        gender: string,
        targetGender: string,
        lookingFor: string,
        photos: string[],
        interests: string[],
        socialsList: string[],
        bio: string,
        personality: number[]
    }
  ```

  - /profile/edit (POST) - profile edit - request body: (same as in /profile, but here every field is optional)

  - /profile (GET) - returns logged user's profile

  - /profile/nearby?radius=`<radius in meters>` (GET) - returns profiles of every user in nearby area of requesting user

## What is done?

- ✅  MVC project structure
- ✅  MongoDB added
- ✅  User endpoint (login/create)
- 🟥  (removed) T2F Auth with secret encrypted by password
- ✅  Generating JWT after login (JWT Web Token)
- ✅  Middleware for validating JWT
- 🟨  Profiles
- ✅ Geospartial Queries
- 🟥 (removed) Ban
- 🟨 Matching algorithm (AI & more)

## To do?

- ➡️ Add WebRTC for communication
