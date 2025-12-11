const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  grade: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grade', gradeSchema);