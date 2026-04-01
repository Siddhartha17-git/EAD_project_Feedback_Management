const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

router.post('/register', async (req, res) => {
  try {
    const { rollNumber, password, confirmPassword } = req.body;
    if (!rollNumber || !password || !confirmPassword) return res.status(400).json({ error: 'Missing fields' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    const rn = Number(rollNumber);
    if (isNaN(rn) || rn < 71 || rn > 137) return res.status(400).json({ error: 'Roll number must be between 71 and 137' });
    const exists = await User.findOne({ rollNumber });
    if (exists) return res.status(400).json({ error: 'Roll number already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ rollNumber, passwordHash: hash, role: 'student' });
    await user.save();
    return res.json({ success: true, message: 'Registered' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ $or: [{ email: identifier }, { rollNumber: identifier }] });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ success: true, token, role: user.role, name: user.name || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash').lean();
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
