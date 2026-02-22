const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    birthdate: {
        type: String,
        required: true,
    },
    games_played: {
        type: Number,
        required: true,
    },
    goals: {
        type: Number,
        required: true,
    },
    assists: {
        type: Number,
        required: true,
    },
    joining_date: {
        type: String,
        required: true,
    },
    leaving_date: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Player', playerSchema);