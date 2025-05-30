import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { sessionMiddleware } from './setup/setup-session.js';
import { login, register } from './controller/adminController.mjs';
//import { getTeams, addTeam, removeTeam, updateTeamName } from './controller/teamController.mjs';
//import matchController from './controller/matchController.mjs';

import teamsViewsRoute from './routes/teams_views.js';
import teamsRoute from './routes/teams.js';
import playersRoute from './routes/players.js';
import coachRoute from './routes/coach.js';
import rankingsRoute from './routes/rankings.js';
import statisticsRoute from './routes/statistics.js';
import matchesRoute from './routes/matches.js';

// Get current filename & directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware: parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (CSS, images, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Session handling
app.use(sessionMiddleware);

// Handlebars (for .hbs views)
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Auth middleware for admin routes
function ensureLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

//  View routes
app.use('/teams', teamsViewsRoute);

// API routes
app.use('/api/teams', teamsRoute);
app.use('/api/players', playersRoute);
app.use('/api/coach', coachRoute);
app.use('/api/matches', matchesRoute);
app.use('/api/rankings', rankingsRoute);
app.use('/api/statistics', statisticsRoute);

//  Admin views & login/logout
app.get('/admin/login', (req, res) => {
  res.render('admin-login', { title: 'Admin Login' });
});

app.post('/admin/login', (req, res) => {
  login(req, (statusCode, data) => {
    if (statusCode === 200) {
      req.session.user = { id: data.adminId, username: data.username };
      res.redirect('/admin-dashboard.html'); // adjust path if needed
    } else {
      res.status(statusCode).render('admin-login', {
        title: 'Admin Login',
        error: data.error || 'An error occurred.'
      });
    }
  });
});

app.get('/admin/register', (req, res) => {
  res.render('admin-register', { title: 'Admin Register' });
});

app.post('/admin/register', (req, res) => {
  register(req, (statusCode, data) => {
    if (statusCode === 201) {
      res.send(`<h2>Registration successful!</h2><p><a href="/admin/login">Login</a></p>`);
    } else {
      res.status(statusCode).render('admin-register', {
        title: 'Admin Register',
        error: data.error || 'An error occurred.'
      });
    }
  });
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) res.send('Error logging out.');
    else res.redirect('/admin/login');
  });
});

//  Example protected admin-only page
//app.get('/admin/edit-matches', ensureLoggedIn, (req, res) => {
 // res.sendFile(path.join(__dirname, 'public', 'edit_matches.html'));
//});

//  Test route
//app.get('/api/test', (req, res) => {
 // res.json({ message: "Root test route working!" });
//});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
  console.log(`Server running at http://localhost:${PORT}`);
});
