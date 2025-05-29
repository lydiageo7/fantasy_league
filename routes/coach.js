const express = require('express');
const router = express.Router();
const db = require('../model/db'); // Import the database connection

// Route: GET /api/coaches?team_id=2
// This endpoint retrieves all coaches associated with a specific team
router.get('/', (req, res) => {
  // Get the team_id from the query parameters (e.g., ?team_id=2)
  const teamId = req.query.team_id;
  console.log('Received team_id:', teamId); // Debug log

  // If no team_id is provided, send a 400 Bad Request response
  if (!teamId) {
    return res.status(400).json({ error: 'Missing team_id parameter' });
  }

  // SQL query to fetch coaches for the given team
  const query = `
    SELECT coach_id, c_name, c_lastname, nationality, age, biography
    FROM Coach
    WHERE team_coaching = ?;
  `;

  // Execute the query, using the provided teamId as the parameter
  db.all(query, [teamId], (err, rows) => {
    if (err) {
      // If a database error occurs, log it and send a 500 response
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Send the list of coaches as JSON response
    res.json(rows);
  });
});

// Route: GET /api/coaches/:id
// This endpoint retrieves the details of a specific coach by their ID
router.get('/:id', (req, res) => {
  // Get the coach ID from the URL parameter (e.g., /api/coaches/1)
  const coachId = req.params.id;

  // SQL query to fetch the coach details
  const query = `
    SELECT coach_id, c_name, c_lastname, nationality, age, biography
    FROM Coach
    WHERE coach_id = ?;
  `;

  // Execute the query with the provided coach ID
  db.get(query, [coachId], (err, row) => {
    if (err) {
      // If a database error occurs, log it and send a 500 response
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // If no coach was found with that ID, send a 404 response
    if (!row) {
      return res.status(404).json({ error: 'Coach not found' });
    }

    // Send the coach details as JSON response
    res.json(row);
  });
});

// Export the router to be used in the main server file
module.exports = router;


