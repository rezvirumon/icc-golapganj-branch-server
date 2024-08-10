const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const ConnectionRequest = require('./models/ConnectionRequest');
const User = require('./models/User');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
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

// User routes

// GET route for fetching all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send('Server error');
  }
});

// Express route example
app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PATCH route for updating a user's role
app.patch('/api/users/:email/role', async (req, res) => {
  try {
    const { email } = req.params;
    const { role } = req.body; // The new role from the request body

    if (!role) {
      return res.status(400).send('Role is required');
    }

    const user = await User.findOneAndUpdate({ email }, { role }, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user role:', error.message);
    res.status(500).send('Server error');
  }
});

// ConnectionRequest routes

// POST route for creating a new connection request
app.post('/api/connection-requests', async (req, res) => {
  try {
    const { name, mobile, email, unionName, message, packageName } = req.body;

    if (!name || !mobile || !email || !unionName || !message || !packageName) {
      return res.status(400).send('All fields are required');
    }

    const newRequest = new ConnectionRequest({ name, mobile, email, unionName, message, packageName });
    await newRequest.save();

    res.status(201).send('Connection request saved successfully');
  } catch (error) {
    console.error('Error saving connection request:', error.message);
    res.status(500).send('Server error');
  }
});

// GET route for fetching all connection requests
app.get('/api/connection-requests', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {}; // Optional filter by status
    const requests = await ConnectionRequest.find(filter);
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching connection requests:', error.message);
    res.status(500).send('Server error');
  }
});

// PATCH route for updating the status of a connection request
app.patch('/api/connection-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // The new status from the request body

    if (!status) {
      return res.status(400).send('Status is required');
    }

    const request = await ConnectionRequest.findByIdAndUpdate(id, { status }, { new: true });

    if (!request) return res.status(404).send('Request not found');
    res.status(200).json(request);
  } catch (error) {
    console.error('Error updating request status:', error.message);
    res.status(500).send('Server error');
  }
});

// DELETE route for deleting a connection request
app.delete('/api/connection-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ConnectionRequest.findByIdAndDelete(id);

    if (!request) return res.status(404).send('Request not found');
    res.status(200).send('Request deleted successfully');
  } catch (error) {
    console.error('Error deleting request:', error.message);
    res.status(500).send('Server error');
  }
});

// GET route for fetching connection requests by user email
app.get('/api/connection-requests/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await ConnectionRequest.find({ email });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching connection requests:', error.message);
    res.status(500).send('Server error');
  }
});

// POST route for logging out
app.post('/logout', (req, res) => {
  res.status(200).send('Logged out successfully');
});

// Server listening
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
