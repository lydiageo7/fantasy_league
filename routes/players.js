const express = require('express');
const router = express.Router();
const db = require('../model/db');

// GET /api/players?team_id=2 → All players of a team
router.get('/', (req, res) => {
  const teamId = req.query.team_id;
  console.log('Received team_id:', teamId);

  if (!teamId) {
    return res.status(400).json({ error: 'Missing team_id parameter' });
  }

  const query = `
    SELECT player_id, name, lastname, age, active_years, biography
    FROM Player
    WHERE team_plays = ?;
  `;

  db.all(query, [teamId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(rows);
  });
});

// GET /api/players/:id → Individual player profile
router.get('/:id', (req, res) => {
  const playerId = req.params.id;
  console.log('Received player_id:', playerId);

  const query = `
    SELECT player_id, name, lastname, age, active_years, biography
    FROM Player
    WHERE player_id = ?;
  `;

  db.get(query, [playerId], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(row);
  });
});

module.exports = router;

