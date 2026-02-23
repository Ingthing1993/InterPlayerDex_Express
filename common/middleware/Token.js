const jwt = require('jsonwebtoken');

const generateAccessToken = (username) => {
    return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (username) => {
    return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};