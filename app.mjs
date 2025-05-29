import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { login, register } from './controller/adminController.mjs';
import { getTeams, addTeam, removeTeam, updateTeamName } from './controller/teamController.mjs';
import matchController from './controller/matchController.mjs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars setup
app.engine('hbs', engine({ 
  extname: '.hbs', 
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/test', (req, res) => {
  res.send('Test route works!');
});

app.get('/admin/login', (req, res) => {
  console.log('GET /admin/login route hit!'); // 👈
  res.render('admin-login', { title: 'Admin Login' });
});


// Home page redirects to admin login
app.get('/', (req, res) => {
  res.redirect('/admin/login');
});

// Admin Login page
//app.get('/admin/login', (req, res) => {
//  res.render('admin-login', { title: 'Admin Login' });
//});

// GET route to retrieve teams
app.get('/api/teams', getTeams);

// Admin Login form submission
app.post('/admin/login', (req, res) => {
  login(req, {
    status: (code) => ({
      json: (data) => {
        if (code === 200) {
          // Login successful
          res.redirect('/admin-dashboard.html');        
        } else {
          // Login failed, show error
          res.render('admin-login', {
            title: 'Admin Login',
            message: data.error,
          });
        }
      },
    }),
  });
});

// Admin Registration page
app.get('/admin/register', (req, res) => {
  res.render('admin-register', { title: 'Admin Register' });
});

// Admin Registration form submission
app.post('/admin/register', (req, res) => {
  register(req, {
    status: (code) => ({
      json: (data) => {
        if (code === 201) {
          // Registration successful
          res.send(`<h2>Registration successful!</h2><p><a href="/admin/login">Login</a></p>`);
        } else {
          // Registration failed, show error
          res.render('admin-register', {
            title: 'Admin Register',
            message: data.error,
          });
        }
      },
    }),
  });
});


// Use /api/teams endpoint to add new teams
app.post('/api/teams', addTeam);
// Adjust remove and update routes if necessary:
app.delete('/api/teams/remove', removeTeam);
app.post('/api/teams/update', updateTeamName);

//  mount the match controller endpoints:
app.use('/api', matchController);


app.get('/admin/edit-matches', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit_matches.html'));
});


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
