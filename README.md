# SSO

This README provides an overview of the Single Sign-On (SSO) architecture, including how user authentication is managed across multiple apps. This ecosystem comprises one main app (Learn Lounge) and two secondary apps (Quiz Quest and Academix).

## Main App: Learn Lounge

**Technology Stack:**
- Frontend: Next.js 14
- Backend: Node.js + Express

### Features
- **User Registration and Login:** Users can register and log in using email/password or social logins (Google and GitHub).
- **JWT Authentication:** On successful login, the backend generates a JWT access token and a refresh token. The access token is valid for 1 hour.
- **Session Management:** Extends the session using `next-auth`.
- **Token Refresh:** When the access token expires, a new token is obtained using the refresh token.
- **Social Login:** For Google login, the access token is refreshed by contacting Google's servers.

### Flow
1. **Login:** User logs in, and the backend generates and returns a JWT access token and a refresh token.
2. **Token Validation:** The app validates the access token for each request. If the token is expired, it refreshes the token.
3. **Social Login:** Google access tokens are refreshed by sending a request to Google servers.

## Secondary Apps

### Quiz Quest
**Technology Stack:**
- Frontend: Next.js 14

### Academix
**Technology Stack:**
- Frontend: React.js
- Backend: Node.js

## Authentication Flow for Secondary Apps

### Case 1: User Already Logged In On Main App(Learn Lounge)
1. **Redirect to Main App:** User is redirected to Learn Lounge with the current app's URL origin as a query parameter (`next`).
2. **Session Check:** If the user exists in the session, the token is extracted and sent to the main app's backend for verification.
3. **Token Verification:** If valid, a unique ID is generated, and the token is stored in the database against this ID.
4. **Redirect Back:** The user is redirected back to the secondary app's `/identity` route with the unique ID as a query parameter.
5. **Token Retrieval:** The secondary app's backend retrieves the token using the unique ID and sets it as a cookie.
6. **Authentication Confirmation:** User is redirected to the default login route (e.g., dashboard).

### Case 2: User Not Logged In
1. **Redirect to Login:** User is redirected to the Learn Lounge login form.
2. **Complete Login Process:** User logs in, and the flow proceeds as in Case 1.

## Refresh Token Strategy
- **Token Expiry:** On token expiry, a request is sent to the refresh-token endpoint to get a new access token.
- **Token Update:** The unique ID and the old token are used to update the database with the new token.
- **Redirect for Update:** User is redirected to `/identity` route where the new token is stored in the cookie.

## Logout
- **Main App Logout:** Deletes cookies and invalidates the token by storing it in the Invalidated Tokens schema.
- **Secondary App Logout:** Redirects to the main app, deletes cookies, signs out and again redirects user to the secondary app.

## Flow Diagram
- To understand the entire flow in depth, refer this diagram : [SSO Flow Diagram](https://excalidraw.com/)

## Example .env files

### Client

**1. Main App(NextJS):**
```
DATABASE_URL=

AUTH_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_AUTH_HANDLER_APP_URL=
NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL=
```

**2. Secondary App 1(NextJS):**
```
NEXT_PUBLIC_CURRENT_APP_URL=
NEXT_PUBLIC_AUTH_HANDLER_APP_URL=
NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL=
```

**3. Secondary App 2(ReactJS):**
```
VITE_AUTH_HANDLER_APP_URL=
VITE_AUTH_HANDLER_APP_SERVER_URL=

VITE_CURRENT_CLIENT_APP_URL=
VITE_CURRENT_CLIENT_APP_SERVER_URL=
```

- Here, the main app that handles the entire authentication is the AUTH_HANDLER_APP

### Server

**1. Authentication Server(Main App):**
```
PORT=
MONGO_URI=
SECRET_KEY=
REFRESH_SECRET_KEY=
AUTH_HANDLER_APP_URL=
```

- Here SECRET_KEY and REFRESH_SECRET_KEY are used for verifying the custom generated access token and the refresh token respectively.

**2. Resource Server(Secondary App 2):**
```
PORT=
AUTH_HANDLER_APP_SERVER_URL=
CURRENT_CLIENT_APP_URL=
```

## Usage
**1. Clone the Repository**
```
git clone 
```

**2. Install Dependencies for all 3 apps and 2 servers**
```
cd POC-SSO-Implementation
```

#### Server
 
- Install the server dependencies and start the servers
```
cd authentication-server
npm install
npm run dev
```
- Similarly follow the above step for running the resource server.

#### Client

- Install the client dependencies and start the development servers
```
cd learn-lounge
npm install
npm run dev
```
- Similarly follow the above step for running the other two secondary apps - quiz-quest and academix.

## Conclusion
This SSO ecosystem ensures seamless user authentication across multiple apps, providing a secure and efficient user experience. For any issues or further information, please refer to the documentation or contact the development team.


## Author
**Name:** Ritesh Adwani \
**Email:** ritesh.t@simformsolutions.com