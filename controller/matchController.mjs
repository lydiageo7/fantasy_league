import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = express.Router();

// Open the database connection
const db = await open({
  filename: './project2.db',
  driver: sqlite3.Database
});

// Middleware to ensure the user is authenticated (admin session)
function ensureLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
  }
}

// GET /api/matches – fetch all matches (public access)
router.get('/matches', async (req, res) => {
  try {
    const query = `
      SELECT M.match_id, M.date AS match_date, M.time AS match_time, M.field, M.delay, M.result,
             T1.team_name AS team1_name, T2.team_name AS team2_name
      FROM Match M
      JOIN Playing_Match PM ON M.match_id = PM.playing_match_id
      LEFT JOIN Team T1 ON PM.home_team_id = T1.team_id
      LEFT JOIN Team T2 ON PM.guest_team_id = T2.team_id
      ORDER BY M.date DESC
    `;
    const matches = await db.all(query);
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error while fetching matches.' });
  }
});

// POST /api/matches – create a new match (admin-only)
router.post('/matches', ensureLoggedIn, async (req, res) => {
  const { team1, team2, date, time, field } = req.body;
  if (!team1 || !team2 || !date || !time || !field) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Insert match details
    const result = await db.run(
      `INSERT INTO Match ("date", "time", "field") VALUES (?, ?, ?)`,
      [date, time, field]
    );
    const matchId = result.lastID;

    // Insert into Playing_Match table
    await db.run(
      `INSERT INTO Playing_Match (playing_match_id, home_team_id, guest_team_id, score_home_team, score_guest_team)
       VALUES (?, ?, ?, 0, 0)`,
      [matchId, team1, team2]
    );

    res.status(201).json({
      match_id: matchId,
      match_date: date,
      match_time: time,
      field,
      delay: null,
      result: null
    });
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Database error while creating match.' });
  }
});

// PUT /api/matches/:matchId – update delay and result (admin-only)
router.put('/matches/:matchId', ensureLoggedIn, async (req, res) => {
  const matchId = parseInt(req.params.matchId, 10);
  const { delay, result } = req.body;
  try {
    await db.run(`UPDATE Match SET delay = ?, result = ? WHERE match_id = ?`, [
      delay,
      result,
      matchId
    ]);

    // Return updated match
    const updated = await db.get(
      `
        SELECT M.match_id, M.date AS match_date, M.time AS match_time, M.field, M.delay, M.result,
               T1.team_name AS team1_name, T2.team_name AS team2_name
        FROM Match M
        JOIN Playing_Match PM ON M.match_id = PM.playing_match_id
        LEFT JOIN Team T1 ON PM.home_team_id = T1.team_id
        LEFT JOIN Team T2 ON PM.guest_team_id = T2.team_id
        WHERE M.match_id = ?
      `,
      [matchId]
    );
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error while updating match.' });
  }
});

export default router;
