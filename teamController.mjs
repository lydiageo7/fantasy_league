
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open the database
const db = await open({
  filename: './project2.db',
  driver: sqlite3.Database
});

// Middleware to ensure the user is authenticated
function ensureLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
  }
}

// Function to get all teams (public)
export async function getTeams(req, res) {
  try {
    const teams = await db.all(`SELECT * FROM Team`);
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving teams.');
  }
}

// Function to add a new team (admin-only)
export const addTeam = [
  ensureLoggedIn,
  async (req, res) => {
    const { team_name, number_of_players, home_field } = req.body;

    if (!team_name || !number_of_players || !home_field) {
      return res.status(400).send('All fields are required.');
    }

    try {
      const result = await db.run(
        `INSERT INTO Team (team_name, number_of_players, home_field) VALUES (?, ?, ?)`,
        [team_name, number_of_players, home_field]
      );

      res.status(200).send(`Team added with ID: ${result.lastID}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding team. Check if the team name is unique.');
    }
  }
];

// Function to remove a team (admin-only)
export const removeTeam = [
  ensureLoggedIn,
  async (req, res) => {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).send('Team ID is required.');
    }

    try {
      const result = await db.run(
        `DELETE FROM Team WHERE team_id = ?`,
        [teamId]
      );

      if (result.changes === 0) {
        return res.status(404).send('Team not found.');
      }

      res.status(200).send(`Team with ID ${teamId} removed.`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error removing team.');
    }
  }
];

// Function to update a team name (admin-only)
export const updateTeamName = [
  ensureLoggedIn,
  async (req, res) => {
    const { teamId, newTeamName, newNumberOfPlayers, newHomeField } = req.body;

    if (!teamId || !newTeamName || !newNumberOfPlayers || !newHomeField) {
      return res.status(400).json({
        error: 'Team ID, new team name, number of players and new home field are required.'
      });
    }

    try {
      const result = await db.run(
        `UPDATE Team SET team_name = ?, number_of_players = ?, home_field = ? WHERE team_id = ?`,
        [newTeamName, newNumberOfPlayers, newHomeField, teamId]
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Team not found.' });
      }

      res.status(200).json({ message: `Team with ID ${teamId} updated.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating team.' });
    }
  }
];


