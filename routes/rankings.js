const express = require('express');
const router = express.Router();
const db = require('../model/db'); // Import the database connection

// Route: GET /api/rankings
// This endpoint returns the rankings of all teams
router.get('/', (req, res) => {
  // SQL query to select all team rankings and order them
  const sql = `
    SELECT * 
    FROM team_rankings
    ORDER BY Pts DESC, GD DESC, F DESC;
  `;

  // Execute the query without parameters (since we’re getting all rankings)
  db.all(sql, [], (err, rows) => {
    if (err) {
      // If a database error occurs, log it and send a 500 error response
      console.error("Database error:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      // If successful, send the list of team rankings as a JSON response
      res.json(rows);
    }
  });
});

// Export the router to be used in the main server file (e.g., app.js)
module.exports = router;
