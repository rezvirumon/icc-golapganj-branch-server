// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  photoURL: { type: String },
  role: { type: String, default: 'User' },
});

const User = mongoose.model('User', userSchema);

module.exports = User; // Ensure the model is exported correctly
