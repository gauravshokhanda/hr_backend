const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendanceModel");
const Employee = require("../models/employe");

// Check-in route
router.post("/checkin", async (req, res) => {
  try {
    const { employeeId, date, checkIn } = req.body;

    // Check if an attendance record for the given employee and date already exists
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date,
    });

    if (existingAttendance) {
      // If an attendance record exists, update the check-in time
      existingAttendance.checkIn = checkIn;
      existingAttendance.status = "present"; // Mark as present
      await existingAttendance.save();
      return res.status(200).json(existingAttendance);
    }

    // Create a new attendance record
    const newAttendance = new Attendance({
      employee: employeeId,
      date,
      checkIn,
      status: "present", // Mark as present
    });

    // Add the employee's name and ID to the attendance record
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    newAttendance.employeeName = `${employee.firstName} ${employee.lastName}`;
    newAttendance.employeeId = employeeId;

    await newAttendance.save();
    return res.status(201).json(newAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Break route
router.post("/break", async (req, res) => {
  try {
    const { attendanceId, breakStart } = req.body;

    // Find the attendance record by ID
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Add the break start time
    attendance.breakStart = breakStart;
    await attendance.save();

    return res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Break End route
router.post("/breakend", async (req, res) => {
  try {
    const { attendanceId, breakEnd } = req.body;

    // Find the attendance record by ID
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Add the break end time
    attendance.breakEnd = breakEnd;
    await attendance.save();

    return res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Checkout route
router.post("/checkout", async (req, res) => {
  try {
    const { attendanceId, checkOut } = req.body;

    // Find the attendance record by ID
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Update the checkout time
    attendance.checkOut = checkOut;
    await attendance.save();

    return res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
