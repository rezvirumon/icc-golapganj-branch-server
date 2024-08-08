// server.js or app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const ConnectionRequest = require('./models/ConnectionRequest'); // Ensure this path is correct

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB database connection established successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// POST route for connection requests
app.post('/api/connection-requests', async (req, res) => {
  try {
    const { name, mobile, email, unionName, message, packageName } = req.body;
    
    // Validate input data
    if (!name || !mobile || !email || !unionName || !message || !packageName) {
      return res.status(400).send('All fields are required');
    }
    
    // Create and save a new connection request
    const newRequest = new ConnectionRequest({ name, mobile, email, unionName, message, packageName });
    await newRequest.save();
    
    res.status(201).send('Connection request saved successfully');
  } catch (error) {
    console.error('Error saving connection request:', error.message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
