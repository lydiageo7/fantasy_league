const express = require('express');
const router = express.Router();
const db = require('../model/db');

// GET /teams/add - Show form to add a new team
router.get('/add', (req, res) => {
  res.render('add_team', { title: 'Add New Team' });
});

// POST /teams/add - Add new team to the database
router.post('/add', (req, res) => {
  const { team_name, number_of_players, home_field } = req.body;

  // Basic validation
  if (!team_name || !number_of_players || !home_field) {
    return res.render('add_team', {
      title: 'Add New Team',
      error: 'All fields are required.',
      team_name,
      number_of_players,
      home_field
    });
  }

  const insertQuery = `
    INSERT INTO Team (team_name, number_of_players, home_field)
    VALUES (?, ?, ?)
  `;
  const params = [team_name, number_of_players, home_field];

  db.run(insertQuery, params, function (err) {
    if (err) {
      console.error('Error adding team:', err.message);
      return res.render('add_team', {
        title: 'Add New Team',
        error: 'Error adding team. Team name must be unique.',
        team_name,
        number_of_players,
        home_field
      });
    }

    // Success
    res.render('add_team', {
      title: 'Add New Team',
      message: 'Team added successfully!'
    });
  });
});

module.exports = router;
