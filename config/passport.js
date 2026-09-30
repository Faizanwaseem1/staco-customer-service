const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.js');

const BASE = process.env.BASE_URL || 'http://localhost:3000';

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try { done(null, await User.findById(id)); } catch (e) { done(e); }
});

// Social login: pehle id se dhoondo, phir email se, warna naya user banao
async function findOrCreate(field, profile) {
  const email = profile.emails && profile.emails[0] && profile.emails[0].value;
  let user = await User.findOne({ [field]: profile.id });
  if (!user && email) user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name: profile.displayName, email,
      avatar: profile.photos && profile.photos[0] && profile.photos[0].value
    });
  }
  user[field] = profile.id;
  return user.save();
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BASE}/auth/google/callback`
  }, async (at, rt, profile, done) => {
    try { done(null, await findOrCreate('googleId', profile)); } catch (e) { done(e); }
  }));
} else console.log('Google login off: .env mein GOOGLE_CLIENT_ID/SECRET nahi hain');

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${BASE}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails', 'photos']
  }, async (at, rt, profile, done) => {
    try { done(null, await findOrCreate('facebookId', profile)); } catch (e) { done(e); }
  }));
} else console.log('Facebook login off: .env mein FACEBOOK_APP_ID/SECRET nahi hain');