const express = require('express');
const router = express.Router();
const db = require('../model/db'); // Import the database connection

// Test route to verify the API is working
router.get('/test', (req, res) => {
  res.json({ message: "Test route working!" });
});

// Route: GET /api/teams
// This endpoint retrieves all teams
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Team'; // SQL query to get all teams

  // Execute the query
  db.all(sql, [], (err, rows) => {
    if (err) {
      // If there’s a database error, log it and return a 500 error
      console.error('Error fetching teams:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    // Send the list of teams as JSON
    res.json(rows);
  });
});

// Route: GET /api/teams/:id/details
// This endpoint retrieves detailed info for a specific team (by team ID)
// It includes the team data, players, and coaches
router.get('/:id/details', (req, res) => {
  const teamId = req.params.id; // Get the team ID from the URL

  // SQL queries
  const teamQuery = 'SELECT * FROM Team WHERE team_id = ?'; // Query to get the team
  const playersQuery = 'SELECT * FROM Player WHERE team_plays = ?'; // Query to get the players
  const coachesQuery = 'SELECT * FROM Coach WHERE team_coaching = ?'; // Query to get the coaches

  // First: fetch the team itself
  db.get(teamQuery, [teamId], (err, team) => {
    if (err) {
      console.error('Error fetching team:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    // If team not found, send a 404 error
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Initialize an object to hold all team-related info
    const teamInfo = { team };

    // Second: fetch the players of the team
    db.all(playersQuery, [teamId], (err, players) => {
      if (err) {
        console.error('Error fetching players:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      teamInfo.players = players; // Add players to the teamInfo object

      // Third: fetch the coaches of the team
      db.all(coachesQuery, [teamId], (err, coaches) => {
        if (err) {
          console.error('Error fetching coaches:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }

        teamInfo.coaches = coaches; // Add coaches to the teamInfo object

        // Finally, send the complete team details as JSON
        res.json(teamInfo);
      });
    });
  });
});

// Export the router to be used in the main server file (e.g., app.js)
module.exports = router;
