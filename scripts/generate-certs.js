#!/usr/bin/env node
/**
 * Generate self-signed TLS certs for local HTTPS (certs/key.pem, certs/cert.pem).
 * Run: npm run certs
 * Then start the server; it will use HTTPS if these files exist.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, '..', 'certs');
const keyPath = path.join(certsDir, 'key.pem');
const certPath = path.join(certsDir, 'cert.pem');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    console.log('Certificates already exist at certs/key.pem and certs/cert.pem');
    process.exit(0);
}

fs.mkdirSync(certsDir, { recursive: true });

const subj = '/CN=localhost';
const cmd = `openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "${subj}"`;
try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('Created certs/key.pem and certs/cert.pem. Start the server with npm start to use HTTPS.');
} catch (e) {
    console.error('openssl failed. Install OpenSSL or generate certs manually, e.g.:');
    console.error('  mkdir -p certs && openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes -subj "/CN=localhost"');
    process.exit(1);
}
