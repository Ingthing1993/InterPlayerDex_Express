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
    'https://interplayerdex.ingthing.co.uk/'
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(null, false);
    },
    credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* routes */
const playerRoutes = require('./modules/players/player.route');
app.use('/api/players', playerRoutes);

/* 404: no route matched; pass to error handler so response shape is consistent */
const { errorHandler, notFound } = require('./common/errors');
app.use(notFound);
/* Central error handler: must be last. Catches errors from routes and from notFound. */
app.use(errorHandler);

/** export for server.js */
module.exports = app;
