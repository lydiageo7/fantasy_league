import sqlite3 from 'sqlite3';
import argon2 from 'argon2';

const db = new sqlite3.Database('./project2.db');

// Admin Login
export const login = async (req, resHandler) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM Admin WHERE username = ?';

  db.get(query, [username], async (err, row) => {
    if (err) return resHandler(500, { error: err.message });
    if (!row) return resHandler(400, { error: 'Admin not found' });

    try {
      const valid = await argon2.verify(row.password, password);
      if (valid) {
        resHandler(200, { message: 'Login successful', adminId: row.a_id, username: row.username });
      } else {
        resHandler(401, { error: 'Invalid password' });
      }
    } catch (error) {
      resHandler(500, { error: error.message });
    }
  });
};

// Admin Registration
export const register = async (req, resHandler) => {
  const { username, password } = req.body;

  const checkQuery = 'SELECT * FROM Admin WHERE username = ?';
  db.get(checkQuery, [username], async (err, row) => {
    if (err) return resHandler(500, { error: err.message });
    if (row) return resHandler(400, { error: 'Username already exists' });

    try {
      const hashedPassword = await argon2.hash(password);
      const insertQuery = 'INSERT INTO Admin (username, password) VALUES (?, ?)';
      db.run(insertQuery, [username, hashedPassword], function (err) {
        if (err) return resHandler(500, { error: err.message });
        resHandler(201, { message: 'Admin registered successfully', adminId: this.lastID });
      });
    } catch (error) {
      resHandler(500, { error: error.message });
    }
  });
};

