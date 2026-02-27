const playerModel = require('./player.model');

const getPlayers = async (req, res) => {
    const players = await playerModel.find();
    res.json(players);
};

const createPlayer = async (req, res) => {
    const player = await playerModel.create(req.body);
    res.json(player);
};

const updatePlayer = async (req, res) => {
    const player = {
        name: req.body.name,
        position: req.body.position,
        birthdate: req.body.birthdate,
        games_played: req.body.games_played,
        goals: req.body.goals,
        assists: req.body.assists,
        joining_date: req.body.joining_date,
        leaving_date: req.body.leaving_date,
        image: req.body.image,
    };
    if (!player) {
        return res.status(404).json({ message: 'Player not found' });
    }
    const updatedPlayer = await playerModel.findByIdAndUpdate(req.params.id, player, { new: true });
    if (!updatedPlayer) {
        return res.status(404).json({ message: 'Player not found' });
    }
    console.log(updatedPlayer);
    res.json(updatedPlayer);
};

module.exports = {
    getPlayers,
    createPlayer,
    updatePlayer,
};  