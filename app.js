const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config();



const teamsViewsRoute = require('./routes/teams_views');
const teamsRoute = require('./routes/teams');
const playersRoute = require('./routes/players');
const coachRoute = require('./routes/coach');
const matchesRoute = require('./routes/matches');
const rankingsRoute = require('./routes/rankings');
const statisticsRoute = require('./routes/statistics');

const db = require('./model/db'); // Database connection

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup for Handlebars
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main', // default layout file: views/layouts/main.hbs
  layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// View routes (HTML pages)
app.use('/teams', teamsViewsRoute);
// API Routes
//app.use('/api/teams', teamsApiRoute);
app.use('/api/teams', teamsRoute);
app.use('/api/players', playersRoute);
app.use('/api/coach', coachRoute);
app.use('/api/matches', matchesRoute);
app.use('/api/rankings', rankingsRoute);
app.use('/api/statistics', statisticsRoute);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: "Root test route working!" });
});

// Views Routes
// Admin views (like add_team.hbs) will be handled in teams.js (via /teams/add GET)
// Static files
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
