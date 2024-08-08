const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  unionName: String,
  message: String,
  packageName: String,
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;
