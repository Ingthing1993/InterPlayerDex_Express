# My First Express.js Backend — What I Built and What I Learned

I just shipped my first real Node/Express API. Here’s the project, the stack, and the patterns that made it stick.

---

## Why this project?

I wanted to build something full-stack that I could actually deploy and extend — not a tutorial clone. **InterPlayerdex** is a player-data API with a React frontend: think a small “dex” of players (name, position, stats, dates, image) that the frontend can list and create. The backend is Express 5 + MongoDB; the frontend is Vite + React. Both run locally for now, with CORS set up so the React app can talk to the API cleanly.

---

## What’s in the backend?

- **REST API** — `GET /api/players` and `POST /api/players` for listing and creating players. All errors come back as the same JSON shape: `{ "success": false, "message": "..." }` with the right status codes.
- **Modular structure** — Each feature lives in its own folder under `modules/` (e.g. `players`, and a stub `auth` for later). Each module has its route file, controller, and Mongoose model. The main `app.js` only mounts routes and middleware; no business logic there. That kept the codebase easy to navigate and easy to add to.
- **Central error handling** — One error-handling middleware at the end of the pipeline. Controllers throw a small custom `AppError(message, statusCode)` for “expected” failures (e.g. validation, not found). The handler turns those — and Mongoose validation/cast errors — into consistent JSON. Unknown routes hit a `notFound` middleware and then the same handler, so the client always gets the same response shape.
- **MongoDB + Mongoose** — Player schema with required fields (name, position, birthdate, games, goals, assists, joining/leaving dates, image URL). Validation and duplicate-key type errors are normalized in the central handler so the API doesn’t leak stack traces or raw DB errors.
- **Config and safety** — Environment variables via `dotenv` (e.g. `MONGO_URI`, `PORT`, optional `FRONTEND_URL` for CORS). Process-level handlers for `unhandledRejection` and `uncaughtException` so the server exits with a clear log instead of failing silently. Optional HTTPS using certs (e.g. from a small `npm run certs` script).

---

## What I learned (and why it matters)

1. **Structure first.** Spending a bit of time on a clear `modules/` layout and a single place for errors saved a lot of “where does this go?” later. Express doesn’t enforce this; doing it myself made the project feel like something I could grow.

2. **Errors are part of the API.** Users (and the frontend) see your errors. One handler, one response shape, and named status codes (e.g. from an `httpStatusCodes.js`) made the API predictable and easier to debug.

3. **CORS and env aren’t afterthoughts.** Letting the React dev server call the API meant configuring CORS properly (and optionally supporting a production frontend URL). Keeping secrets and ports in `.env` made local and “later production” setup straightforward.

4. **Process-level handling.** Catching `unhandledRejection` and `uncaughtException` in `server.js` was a small addition that made crashes visible and the app easier to run in the real world.

---

## Stack in a nutshell

| Layer   | Tech                          |
|--------|-------------------------------|
| Backend| Node.js, Express 5, Mongoose, MongoDB |
| Frontend | React (Vite) in `client/`   |
| Config | dotenv, optional HTTPS        |

The repo has a README with setup, env vars, API overview, and a short “principles and resources” section so the patterns are documented for future me — and for anyone who might clone it.

---

## If you’re building your first Express API

Start with a tiny feature (e.g. one resource, GET and POST). Add one central error handler and a simple module layout early. Use env for anything that changes between your machine and production. You don’t need every best practice on day one — but a few solid patterns (modules, central errors, consistent responses) will make the project feel like a real codebase, not a throwaway script.

InterPlayerdex is my first Express backend, and it’s already the base I want to build auth, more endpoints, and real deployment on. If you’re working on your first Node/Express or full-stack project, I’d be curious to hear what patterns you’re leaning on — drop a comment or DM.

---

*Repo: [InterPlayerdex](https://github.com/Ingthing1993/InterPlayerDex_Express) (backend + React client). Built with Express 5, Mongoose, MongoDB, and Vite.*
