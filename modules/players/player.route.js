const express = require('express');
const router = express.Router();
const { getPlayers, createPlayer, updatePlayer } = require('./player.controller');

router.get('/', getPlayers);
router.post('/', createPlayer);
router.put('/:id', updatePlayer);

module.exports = router;