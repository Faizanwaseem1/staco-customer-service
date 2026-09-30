require('dotenv').config();
console.log('BASE_URL =', process.env.BASE_URL);
console.log('Google ID =', (process.env.GOOGLE_CLIENT_ID || '').slice(0, 12));
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

require('./config/passport');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// Header ka "Sign in" button /auth/login par jata hai
app.get('/auth/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.use('/auth', require('./routes/auth'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staco')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));