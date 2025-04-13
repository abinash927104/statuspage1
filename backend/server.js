// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ extended: false }));

app.use(cors({
  origin: 'statuspagenew-git-main-abinash927104s-projects.vercel.app', // Change this to the correct origin for your frontend
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/incidents', require('./routes/incidents'));

// Default route
app.get('/', (req, res) => {
  res.send('API running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

