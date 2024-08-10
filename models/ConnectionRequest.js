// models/ConnectionRequest.js
const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  unionName: String,
  message: String,
  packageName: String,
  status: {
    type: String,
    default: 'Pending',
  },
});

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);
