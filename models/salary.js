const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to the Employee model
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  monthlySalary: {
    type: Number,
    required: true,
  },
  totalWorkingDays: {
    type: Number,
    required: true,
  },
  totalSalary: {
    type: Number,
    required: true,
  },
  bonus: {
    type: Number,
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  hraSalary: {
    type: Number,
    required: true,
  },
  conveyance: {
    type: Number,
    required: true,
  },
  pfSalary: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Salary", salarySchema);
