/** builds express server */
const express = require('express');
const cors = require('cors');
const app = express();

// CORS: allow frontend origin(s). Local API can run http or https (see server.js / npm run certs).
const allowedOrigins = [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://localhost:5173',
    'https://localhost:5173',
    'https://interplayerdex.ingthing.co.uk',
    'https://ingthing.co.uk',
    'https://www.ingthing.co.uk',
    'http://ingthing.co.uk',
    'http://www.ingthing.co.uk',
    process.env.FRONTEND_URL,
].filter(Boolean);

function isAllowedOrigin(origin) {
    if (!origin) return true;
    const normalized = origin.replace(/\/$/, ''); // strip trailing slash
    if (allowedOrigins.includes(origin) || allowedOrigins.includes(normalized)) return true;
    // Allow any subdomain of ingthing.co.uk (e.g. interplayerdex.ingthing.co.uk)
    try {
        const u = new URL(origin);
        const host = u.hostname.toLowerCase();
        return host === 'ingthing.co.uk' || host.endsWith('.ingthing.co.uk');
    } catch {
        return false;
    }
}

app.use(cors({
    origin: (origin, cb) => {
        if (isAllowedOrigin(origin)) return cb(null, true);
        cb(null, false);
    },
    credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* routes */
const playerRoutes = require('./modules/players/player.route');
app.use('/api/players', playerRoutes);

// Redirect root to the player creation form for convenience
app.get('/', (req, res) => {
    res.redirect('/players/new');
});

// Simple HTML form to create players (for manual testing)
app.get('/players/new', (req, res) => {
    res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Create Player</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; background: #0b1020; color: #f4f4f5; }
    h1 { margin-bottom: 1.5rem; }
    form { display: grid; gap: 1rem; }
    label { display: flex; flex-direction: column; font-size: 0.9rem; gap: 0.25rem; }
    input { padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #27272a; background: #09090b; color: inherit; }
    input:focus { outline: 2px solid #22c55e; outline-offset: 1px; border-color: transparent; }
    .row { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
    button { padding: 0.6rem 1.25rem; border-radius: 999px; border: none; background: #22c55e; color: #020617; font-weight: 600; cursor: pointer; justify-self: flex-start; }
    button:hover { background: #16a34a; }
    small { opacity: 0.7; }
  </style>
</head>
<body>
  <h1>Create Player</h1>
  <form method="POST" action="/api/players">
    <label>
      Name
      <input type="text" name="name" required />
    </label>
    <label>
      Position
      <input type="text" name="position" required />
    </label>
    <div class="row">
      <label>
        Birthdate
        <input type="date" name="birthdate" required />
      </label>
      <label>
        Joining date
        <input type="date" name="joining_date" required />
      </label>
      <label>
        Leaving date
        <input type="date" name="leaving_date" required />
      </label>
    </div>
    <div class="row">
      <label>
        Games played
        <input type="number" name="games_played" min="0" step="1" required />
      </label>
      <label>
        Goals
        <input type="number" name="goals" min="0" step="1" required />
      </label>
      <label>
        Assists
        <input type="number" name="assists" min="0" step="1" required />
      </label>
    </div>
    <label>
      Image URL
      <input type="url" name="image" required />
      <small>Provide a full image URL.</small>
    </label>
    <button type="submit">Create player</button>
  </form>
</body>
</html>`);
});

/* 404: no route matched; pass to error handler so response shape is consistent */
const { errorHandler, notFound } = require('./common/errors');
app.use(notFound);
/* Central error handler: must be last. Catches errors from routes and from notFound. */
app.use(errorHandler);

/** export for server.js */
module.exports = app;
