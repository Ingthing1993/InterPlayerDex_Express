// create a player in the database

require('dotenv').config();
const connectDB = require('./config/db');
const playerModel = require('./modules/players/player.model');

const viewPlayer = async () => {
    await connectDB();
    const players = await playerModel.find();
    console.log('Players:', players);
    process.exit(0);
};


viewPlayer().catch((err) => {
    console.error(err);
    process.exit(1);
});