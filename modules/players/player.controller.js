const playerModel = require('./player.model');

const getPlayers = async (req, res) => {
    const players = await playerModel.find();
    res.json(players);
};

const createPlayer = async (req, res) => {
    const player = await playerModel.create(req.body);
    res.json(player);
};

module.exports = {
    getPlayers,
    createPlayer,
};  