const express = require('express');
const router = express.Router();
const { getTeams, createTeam, updateTeam } = require('./team.controller');

router.get('/', getTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);

module.exports = router;