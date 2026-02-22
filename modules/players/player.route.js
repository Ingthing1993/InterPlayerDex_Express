const express = require('express');
const router = express.Router();
const { getPlayers, createPlayer } = require('./player.controller');

router.get('/', getPlayers);
router.post('/', createPlayer);

module.exports = router;