require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const authRoutes = require('../backend/routes/authRoutes');
const feedbackRoutes = require('../backend/routes/feedbackRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

// Serve static frontend files
app.use('/', express.static(path.join(__dirname, '../frontend')));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

module.exports = app;
