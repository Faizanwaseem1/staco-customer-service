const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

const fail = (res, code, msg) => res.status(code).json({ ok: false, message: msg });

// Sign up (email + password)
router.post('/sign-up', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || password.length < 6) return fail(res, 400, 'Write email and atleat 6 characters password.');
    if (await User.findOne({ email: email.toLowerCase() })) return fail(res, 409, 'this email is already registered.');
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    req.login(user, err => err ? fail(res, 500, 'Login nahi ho saka.') : res.json({ ok: true }));
  } catch (e) { fail(res, 500, 'Server error.'); }
});

// Login (email + password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = email && await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password || !(await bcrypt.compare(password || '', user.password)))
      return fail(res, 401, 'Invalid email or Password.');
    req.login(user, err => err ? fail(res, 500, 'Cannot login.') : res.json({ ok: true }));
  } catch (e) { fail(res, 500, 'Server error.'); }
});

// Google
router.get('/google', (req, res, next) =>
  passport._strategy('google') ? passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
  : res.redirect('/auth/login?error=Google+login+abhi+setup+nahi+hua'));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login?error=Google+login+fail+hua' }),
  (req, res) => res.redirect('/'));

// Facebook
router.get('/facebook', (req, res, next) =>
  passport._strategy('facebook') ? passport.authenticate('facebook', { scope: ['email'] })(req, res, next)
  : res.redirect('/auth/login?error=Facebook+login+abhi+setup+nahi+hua'));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/login?error=Facebook+login+fail+hua' }),
  (req, res) => res.redirect('/'));

// Current user / logout
router.get('/me', (req, res) => {
  if (!req.user) return res.json({ loggedIn: false });
  const { name, email, avatar } = req.user;
  res.json({ loggedIn: true, user: { name, email, avatar } });
});
router.post('/logout', (req, res, next) => req.logout(err => err ? next(err) : res.json({ ok: true })));

module.exports = router;