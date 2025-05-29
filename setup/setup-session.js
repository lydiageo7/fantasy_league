const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME,
    cookie: {maxAge: 3600000, sameSite: true},
    resave: false,
    saveUninitialized: false
});

module.exports = {sessionMiddleware};