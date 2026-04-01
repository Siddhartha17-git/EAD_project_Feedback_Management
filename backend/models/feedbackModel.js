const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: { type: String, default: '' },
  rollNumber: { type: String, required: true },
  courseBranch: { type: String, required: true },
  courseName: { type: String, required: true },
  facultyName: { type: String, required: true },
  classType: { type: String, enum: ['Theory','Lab'], required: true },
  teachingRating: { type: Number, required: true, min: 1, max: 5 },
  contentRating: { type: Number, required: true, min: 1, max: 5 },
  labRating: { type: Number, min: 0, max: 5, default: 0 },
  comments: { type: String, default: '' },
  issues: { type: String, default: '' },
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = require('mongoose').model('Feedback', FeedbackSchema);
