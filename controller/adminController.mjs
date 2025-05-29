import sqlite3 from 'sqlite3';
import argon2 from 'argon2';

const db = new sqlite3.Database('./project2.db');

// Admin Login
export const login = async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM Admin WHERE username = ?';

  db.get(query, [username], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(400).json({ error: 'Admin not found' });

    try {
      const valid = await argon2.verify(row.password, password);
      if (valid) {
        return res.status(200).json({ message: 'Login successful', adminId: row.a_id });
      } else {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};

// Admin Registration
export const register = async (req, res) => {
  const { username, password } = req.body;

  // Check if username exists
  const checkQuery = 'SELECT * FROM Admin WHERE username = ?';
  db.get(checkQuery, [username], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(400).json({ error: 'Username already exists' });

    try {
      const hashedPassword = await argon2.hash(password);
      const insertQuery = 'INSERT INTO Admin (username, password) VALUES (?, ?)';
      db.run(insertQuery, [username, hashedPassword], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'Admin registered successfully', adminId: this.lastID });
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};
