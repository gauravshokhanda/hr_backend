const mongoose = require('mongoose');

const employesSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  present: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model('Attendance', employesSchema);
