require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback_db';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('MongoDB connection error', err));

app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use('/', express.static(path.join(__dirname, '../frontend')));

app.get('*', (req,res)=> {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
