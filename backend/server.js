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
const allowedSubdomainRegex = /^https:\/\/.*\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin like mobile apps or curl requests
      if (!origin) return callback(null, true);

      if (allowedSubdomainRegex.test(origin)) {
        // The origin matches our pattern (any subdomain ending with .vercel.app)
        return callback(null, true);
      } else {
        // Otherwise, block the request with an error
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true // If you need credentials like cookies
  })
);

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

