# InterPlayerdex

**Full-stack app:** Node/Express API (this repo) + React frontend. Player data, auth, and related features.

---

## About this repo

- **Backend (this repo)** — REST API built with Express and MongoDB. Run it with `npm start`; it serves JSON for the frontend.
- **Frontend** — React app in `client/` (Vite + React). It talks to this API; see [Running the app](#running-the-app) and [React frontend](#react-frontend).

When you make this repo **public** on GitHub, add a short description and topics (e.g. `nodejs`, `express`, `mongodb`, `react`) on the repo page so others can find it.

---

## Recent updates

<!-- Edit this section whenever you make notable changes. Move older items into "Changelog" below or remove them. -->

- Added `client/` — React frontend (Vite + React). CORS enabled on API; `client/.env.example` and `src/lib/api.js` for API base URL.
- Custom error handling: central `errorHandler`, `AppError`, 404 handling, Mongoose error normalisation.
- Project README added.

---

## Features

- **Players API** — CRUD-style endpoints for player records (list, create).
- **Auth module** — Login, register, logout (module present; wire routes in `app.js` when ready).
- **Central error handling** — Consistent JSON error responses, `AppError`, 404 for unknown routes.
- **MongoDB** — Data persisted via Mongoose.

---

## Tech stack

| Layer      | Tech        |
| ---------- | ----------- |
| **Backend** | Node.js, Express 5, Mongoose, MongoDB |
| **Frontend** | React (Vite) in `client/` |
| Config     | dotenv      |

---

## Setup

1. **Clone and install**

   ```bash
   git clone git@github.com:Ingthing1993/InterPlayerDex_Express.git
   cd InterPlayerdex
   npm install
   cd client && npm install && cd ..
   ```

2. **Environment**

   - **Backend:** Copy `.env.example` to `.env` in the project root and set `MONGO_URI` (and any optional vars). See [Environment variables](#environment-variables).
   - **Frontend:** Copy `client/.env.example` to `client/.env` and set `VITE_API_URL` if your API runs on a different URL (default `http://localhost:3000`).

3. **Run** — see [Running the app](#running-the-app) below.

---

## Environment variables

| Variable   | Description                    | Example              |
| ---------- | ------------------------------ | -------------------- |
| `MONGO_URI` | MongoDB connection string (required) | `mongodb://localhost:27017/interplayerdex` |
| `PORT`     | Server port (optional)         | `3001`               |
| `NODE_ENV` | `development` or `production` (optional) | `development` |
| `FRONTEND_URL` | Extra CORS origin (optional) | `https://your-app.example.com` |
| `SSL_KEY_PATH`, `SSL_CERT_PATH` | Paths to TLS key/cert for HTTPS (optional) | `certs/key.pem`, `certs/cert.pem` |

---

## Running the app

- **Backend:** From the project root, `npm start`. API at `http://localhost:3001` (or your `PORT`).
- **Frontend:** From the project root, `cd client && npm run dev`. App at `http://localhost:5173` (Vite default).

Run both when developing; the React app uses `VITE_API_URL` (see `client/src/lib/api.js`) to call the API. CORS is enabled on the backend so the browser can make requests from the dev server.

## Scripts

| Where   | Command           | Description                |
| ------- | ----------------- | -------------------------- |
| Root    | `npm start`       | Start the Express API      |
| Root    | `npm test`        | Run tests (placeholder)    |
| client/ | `npm run dev`     | Start React dev server     |
| client/ | `npm run build`   | Build React for production |
| client/ | `npm run preview` | Preview production build   |

---

## Project structure

```
InterPlayerdex/
├── app.js                  # Express app, routes, CORS, error middleware
├── server.js               # Entry point, DB connect, start server
├── config/
│   └── db.js               # MongoDB connection
├── common/
│   ├── errors/             # AppError, errorHandler, notFound, asyncHandler
│   └── middleware/         # Shared middleware (e.g. auth)
├── modules/
│   ├── auth/               # Auth controller & model
│   └── players/            # Player routes, controller, model
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── lib/api.js      # API base URL (VITE_API_URL)
│   │   ├── App.jsx
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── .env.example            # Template for env vars (committed)
├── .env                    # Your local env (not committed – create from .env.example)
├── package.json
└── README.md
```

Update this tree when you add new modules or top-level folders.

---

## API overview

Base URL: `http://localhost:<PORT>` (e.g. `http://localhost:3001`).

| Method | Path           | Description        |
| ------ | -------------- | ------------------ |
| GET    | `/api/players` | List all players   |
| POST   | `/api/players` | Create a player    |

All error responses use the same shape: `{ "success": false, "message": "..." }` with an appropriate HTTP status code.

---

## React frontend

The React app lives in `client/` (Vite + React). It calls this API using the base URL in `client/src/lib/api.js` (from `VITE_API_URL` in `client/.env`). CORS is enabled on the backend so the dev server at `http://localhost:5173` can call the API. For production, set `VITE_API_URL` to your deployed API URL before building.

---

## Principles and resources

This project follows patterns that scale well and keep the codebase clear. Below are the main principles and where to read more.

| Principle | What we do | Resources |
| --------- | ---------- | --------- |
| **Modular structure** | Features live in `modules/` (e.g. `players`, `auth`) with a route, controller, and model per feature. `app.js` mounts routes; no business logic in the main app file. | [Express: Router](https://expressjs.com/en/guide/routing.html#express-router), [Express: Project structure](https://expressjs.com/en/advanced/best-practice-performance.html#use-the-correct-approach-to-organize-your-app) |
| **Central error handling** | One error-handling middleware (`common/errors/errorHandler.js`) with four parameters `(err, req, res, next)`. We normalize Mongoose and other errors into a single shape and send a consistent JSON response. Unknown routes go through `notFound` then the error handler. | [Express: Error handling](https://expressjs.com/en/guide/error-handling.html) |
| **Operational errors with AppError** | Controllers throw `new AppError(message, statusCode)` for expected cases (e.g. “Not found”, “Validation failed”). The central handler recognises these and responds with the right status and message without treating them as bugs. | Same as above; [Error handling in Node](https://nodejs.org/en/docs/guides/error-handling/) |
| **Async route handling** | Async route handlers can `throw` or reject; Express 5 forwards rejections to error middleware. We use `asyncHandler` in `common/errors` for clarity and Express 4 compatibility. | [Express: Writing middleware](https://expressjs.com/en/guide/writing-middleware.html), [Express 5 changes](https://expressjs.com/en/guide/migrating-5.html) |
| **Consistent API responses** | Success: JSON body (e.g. array or object). Errors: `{ "success": false, "message": "..." }` plus optional `stack`/`errors` in development only. Same shape for 404, 400, 500, etc. | [REST API design](https://restfulapi.net/), [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) |
| **Named HTTP status codes** | We use constants from `common/errors/httpStatusCodes.js` (e.g. `NOT_FOUND`, `BAD_REQUEST`) instead of magic numbers. | [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) |
| **Configuration via environment** | Secrets and environment-specific settings live in `.env` (loaded with `dotenv`). No credentials in code; `config/db.js` uses `process.env.MONGO_URI`. | [dotenv](https://github.com/motdotla/dotenv), [The Twelve-Factor App: Config](https://12factor.net/config) |
| **CORS and security** | CORS is configured with explicit allowed origins (and `FRONTEND_URL`). Credentials supported where needed. Optional HTTPS via `certs/` (see `npm run certs`). | [Express: CORS](https://expressjs.com/en/resources/middleware/cors.html), [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) |
| **Process-level error handling** | In `server.js`, `unhandledRejection` and `uncaughtException` are handled so the process exits with a clear log instead of failing silently. | [Node: Process](https://nodejs.org/api/process.html#event-unhandledrejection), [Node: Best practices](https://nodejs.org/en/docs/guides/error-handling/) |
| **MongoDB with Mongoose** | Data is modelled with schemas; validation and CastError/duplicate key errors are normalized in the central error handler. | [Mongoose Guide](https://mongoosejs.com/docs/guide.html), [Mongoose Validation](https://mongoosejs.com/docs/validation.html) |

**Security note:** The auth module in `modules/auth` is minimal (e.g. no password hashing). For a production app you would hash passwords (e.g. with [bcrypt](https://github.com/kelektiv/node.bcrypt.js)) and use sessions or JWT; this repo is suitable as a first Express project and portfolio piece.

---

## Changelog

<!-- Optional: move items here from "Recent updates" when the list gets long. -->

- **README** — Initial README with setup, structure, and API overview.

---

## License

ISC (see `package.json`).
