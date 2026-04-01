const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedbackModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

async function auth(req, res, next) {
  try {
    const authh = req.headers.authorization;
    if (!authh) return res.status(401).json({ error: 'No token' });
    const token = authh.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Only students can submit feedback' });
    const data = req.body;
    data.studentId = req.user.id;
    const fb = new Feedback(data);
    await fb.save();
    return res.json({ success: true, feedback: fb });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const q = req.query;
    const filter = {};
    if (q.course && q.course !== 'All') filter.courseName = q.course;
    if (q.faculty && q.faculty !== 'All') filter.facultyName = q.faculty;
    if (q.classType && q.classType !== 'All') filter.classType = q.classType;
    if (req.user.role === 'student') filter.studentId = req.user.id;
    const list = await Feedback.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, feedbacks: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/meta', auth, async (req, res) => {
  try {
    const courses = await Feedback.distinct('courseName');
    const faculties = await Feedback.distinct('facultyName');
    res.json({ success: true, courses, faculties });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
