const authModel = require('./auth.model');

const register = async (req, res) => {
    const auth = await authModel.create(req.body);
    res.json(auth);
};

const login = async (req, res) => {
    const auth = await authModel.findOne({ username: req.body.username });
    if (!auth) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.json(auth);
};

const logout = async (req, res) => {
    res.json({ message: 'Logged out' });
};

module.exports = {
    register,
    login,
    logout,
};