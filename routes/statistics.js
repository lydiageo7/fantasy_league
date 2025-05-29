const express = require('express');
const router = express.Router();
const db = require('../model/db'); // Import the database connection

// Route: GET /api/statistics
// This endpoint retrieves various league-wide statistics in one API call
router.get('/', (req, res) => {
  // Define all the SQL queries we want to execute
  const queries = {
    // Top 3 scoring teams
    topScoringTeams: `
      SELECT team_name, F AS goals_scored
      FROM team_rankings
      ORDER BY F DESC
      LIMIT 3
    `,
    // Best defence (team with fewest goals conceded)
    bestDefence: `
      SELECT team_name, A AS goals_conceded
      FROM team_rankings
      ORDER BY A ASC
      LIMIT 1
    `,
    // Average goals per match across all matches
    avgGoals: `
      SELECT ROUND(AVG(score_home_team + score_guest_team), 2) AS avg_goals
      FROM Playing_Match
    `,
    // Team with most wins
    mostWins: `
      SELECT team_name, W AS wins
      FROM team_rankings
      ORDER BY W DESC
      LIMIT 1
    `,
    // Team with most draws
    mostDraws: `
      SELECT team_name, D AS draws
      FROM team_rankings
      ORDER BY D DESC
      LIMIT 1
    `,
    // Team with most losses
    mostLosses: `
      SELECT team_name, L AS losses
      FROM team_rankings
      ORDER BY L DESC
      LIMIT 1
    `,
    // Top 3 individual scorers (players)
    topScorers: `
      SELECT p.player_id, p.name || ' ' || p.lastname AS player_name, COUNT(*) AS goals
      FROM Goal g
      JOIN Player p ON p.player_id = g.player_scored
      GROUP BY g.player_scored
      ORDER BY goals DESC
      LIMIT 3
    `,
    // All teams and their goals scored
    allTeamsGoals: `
      SELECT team_name, F AS goals_scored
      FROM team_rankings
      ORDER BY goals_scored DESC
    `,
    // Individual player statistics: matches, goals, yellow and red cards
    playersStats: `
      SELECT 
        p.player_id,
        p.name || ' ' || p.lastname AS player_name,
        t.team_name,
        COUNT(DISTINCT pm.playing_match_id) AS matches_played,
        COUNT(DISTINCT g.goal_id) AS goals_scored,
        SUM(CASE WHEN part.yellow_card = 1 THEN 1 ELSE 0 END) AS yellow_cards,
        SUM(CASE WHEN part.red_card = 1 THEN 1 ELSE 0 END) AS red_cards
      FROM Player p
      LEFT JOIN Goal g ON p.player_id = g.player_scored
      LEFT JOIN Playing_Match pm ON pm.home_team_id = p.team_plays OR pm.guest_team_id = p.team_plays
      LEFT JOIN Team t ON t.team_id = p.team_plays
      LEFT JOIN Participation part ON part.player_participated = p.player_id
      GROUP BY p.player_id
      ORDER BY goals_scored DESC
    `
  };

  // Initialize an empty object to store the results of all queries
  const results = {};
  const keys = Object.keys(queries); // All the query keys
  let count = 0; // Counter to track how many queries have completed

  // Loop through each query
  keys.forEach((key) => {
    const sql = queries[key];

    // Use db.all for queries returning multiple rows, and db.get for single row
    const exec = (key === 'topScorers' || key === 'allTeamsGoals' || key === 'playersStats' || key === 'topScoringTeams') ? db.all : db.get;

    // Execute the SQL query
    exec.call(db, sql, [], (err, rows) => {
      if (err) {
        // If an error occurs, log it and return a 500 error
        console.error(`Error in ${key}:`, err);
        return res.status(500).json({ error: "Database error" });
      }

      // Store the result (rows for multi-row queries, row for single-row queries)
      results[key] = rows;
      count++;

      // If all queries have completed, send the combined results as JSON
      if (count === keys.length) {
        res.json(results);
      }
    });
  });
});

// Export the router so it can be used in the main server file
module.exports = router;

