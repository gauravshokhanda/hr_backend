const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  checkIn: {
    type: Date,
    required: false,
  },
  checkOut: {
    type: Date,
    required: false,
  },
  breakStart: [
    {
      type: Date,
      required: false,
    },
  ],
  breakEnd: [
    {
      type: Date,
      required: false,
    },
  ],
  status: {
    type: String,
    enum: ["present", "absent", "late", "holiday"],
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  employeeImage: {
    type: String,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  breakStatus: { type: String, enum: ["in", "break"], default: "in" },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
