const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
  password: String,          // sirf email/password users ke liye (hashed)
  googleId: String,
  facebookId: String,
  avatar: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);