// create a player in the database

require('dotenv').config();
const connectDB = require('./config/db');
const playerModel = require('./modules/players/player.model');

const players = [
    {
        name: 'Javier Zanetti',
        position: 'Defender',
        birthdate: '1973-08-10',
        games_played: 615,
        goals: 12,
        assists: 0,
        joining_date: '1995-07-01',
        leaving_date: '2014-06-30',
        image: 'https://media.gettyimages.com/id/100329136/photo/bayern-muenchen-v-inter-milan-uefa-champions-league-final.webp?s=612x612&w=gi&k=20&c=a7pq7YRSMXMTs8xc-tZmflP20yCg_9Jej4H5nELjgHE=',
    },
    {
        name: 'Lothar Matthaus',
        position: 'Midfielder',
        birthdate: '1976-09-18',
        games_played: 115,
        goals: 40,
        assists: 0,
        joining_date: '1988-07-01',
        leaving_date: '1992-06-30',
        image: 'https://media.gettyimages.com/id/52934986/photo/matthaeus-juventus-turin-inter-mailand.webp?s=612x612&w=gi&k=20&c=ylEAnS8rgAEu9YsGUbaawK7pUSlsUvtB_NvM-wetfr8=',
    }
];


const createPlayer = async (player) => {
    await connectDB();
    const created = await playerModel.create(player);
    console.log('Created:', created);
    process.exit(0);
};

players.forEach(async (player) => {
    await createPlayer(player);
});