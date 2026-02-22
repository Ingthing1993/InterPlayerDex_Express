/* loads env before anything else */
require('dotenv').config();

const fs = require('fs');
const https = require('https');
const http = require('http');

/* starts server */
const app = require('./app');
const connectDB = require('./config/db');

/** sets port */
const PORT = process.env.PORT || 3001;

/** HTTPS: use SSL_KEY_PATH and SSL_CERT_PATH, or ./certs/key.pem and ./certs/cert.pem (run npm run certs to generate) */
const keyPath = process.env.SSL_KEY_PATH || 'certs/key.pem';
const certPath = process.env.SSL_CERT_PATH || 'certs/cert.pem';
const useHttps = fs.existsSync(keyPath) && fs.existsSync(certPath);

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

/** starts server */
async function startServer() {
    await connectDB();
    const protocol = useHttps ? 'https' : 'http';
    if (useHttps) {
        const server = https.createServer(
            { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
            app
        );
        server.listen(PORT, () => {
            console.log(`Server is running on ${protocol}://localhost:${PORT}`);
        });
    } else {
        http.createServer(app).listen(PORT, () => {
            console.log(`Server is running on ${protocol}://localhost:${PORT}`);
        });
    }
}

startServer().catch (error => {
    console.error('Server startup error:', error);
    process.exit(1);
});