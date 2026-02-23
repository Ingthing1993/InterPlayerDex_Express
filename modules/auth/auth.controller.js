const authModel = require('./auth.model');

const register = async (req, res) => {
    const auth = await authModel.create(req.body);
    if (!auth) {
        return res.status(400).json({ message: 'Failed to register' });
    }
    const accessToken = generateAccessToken(auth.username);
    const refreshToken = generateRefreshToken(auth.username);
    res.status(201).json({ accessToken, refreshToken });
    
};

const login = async (req, res) => {
    const auth = await authModel.findOne({ username: req.body.username });
    if (!auth) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const accessToken = generateAccessToken(auth.username);
    const refreshToken = generateRefreshToken(auth.username);
    res.status(200).json({ accessToken, refreshToken });
};

const logout = async (req, res) => {
    res.json({ message: 'Logged out' });
};

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const accessToken = generateAccessToken(decoded.username);
    // new refresh token
    const newRefreshToken = generateRefreshToken(decoded.username);
    res.status(200).json({ accessToken, newRefreshToken });
};

const me = async (req, res) => {
    res.json({ message: 'Me' });
};

module.exports = {
    register,
    login,  
    refresh,
    me,
    logout,
};