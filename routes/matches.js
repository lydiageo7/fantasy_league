const express = require('express');
const router = express.Router();
const db = require('../model/db'); // Import the database connection

// Route: GET /api/matches
// Retrieves matches based on either a specific date or a specific month (yearMonth)
router.get('/', (req, res) => {
  // Destructure date and yearMonth from query parameters (e.g., ?date=2025-05-18 or ?yearMonth=2025-03)
  const { date, yearMonth } = req.query;

  // Base SQL query to fetch match details, joining the Match, Playing_Match, and Team tables
  let query = `
    SELECT m.date, t1.team_name AS home_team, t2.team_name AS guest_team,
           pm.score_home_team, pm.score_guest_team, m.field, m.result
    FROM Match m
    JOIN Playing_Match pm ON m.match_id = pm.playing_match_id
    JOIN Team t1 ON pm.home_team_id = t1.team_id
    JOIN Team t2 ON pm.guest_team_id = t2.team_id
  `;

  // Array to store parameters for the query
  const params = [];

  // If a specific date is provided in the query (e.g., ?date=2025-05-18)
  if (date) {
    query += ` WHERE m.date = ?`; // Filter by that exact date
    params.push(date);
  } else if (yearMonth) {
    // If a specific month is provided (e.g., ?yearMonth=2025-03)
    query += ` WHERE strftime('%Y-%m', m.date) = ?`; // Filter by month and year
    params.push(yearMonth); // Expects 'YYYY-MM' format
  }

  // Order the matches by date in ascending order
  query += ` ORDER BY m.date ASC`;

  // Execute the query with parameters
  db.all(query, params, (err, rows) => {
    if (err) {
      // If there is a database error, log it and send a 500 response
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Send the retrieved match rows as a JSON response
    res.json(rows);
  });
});

// Export the router to be used in the main server file
module.exports = router;
