const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendanceModel");
const Employee = require("../models/employe");
const { io } = require("../socket");
const moment = require("moment");

//checkin
router.post("/checkin", async (req, res) => {
  try {
    const { employeeId, date, checkIn } = req.body;

    const normalizedDate = moment(date).startOf("day"); 

    // Fetch all attendance records for the given employee
    const allAttendanceRecords = await Attendance.find({
      employeeId: employeeId,
    });

    // Check if any of the fetched records have the same date as today
    const hasExistingRecordForToday = allAttendanceRecords.some((record) => {
      return moment(record.date).isSame(normalizedDate, "day");
    });

    if (hasExistingRecordForToday) {
      // If an attendance record exists for today's date, return an error
      return res
        .status(400)
        .json({ message: "Already checked in for this date" });
    }

    console.log(allAttendanceRecords, "employee");
    // Create a new attendance record
    const newAttendance = new Attendance({
      employeeId: employeeId,
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

    io.emit("attendanceUpdate", {
      eventType: "checkin",
      message: `${employee.firstName} ${employee.lastName} checked in.`,
    });
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

    // Add the break start time to the array
    attendance.breakStart.push(breakStart); // Assuming "breakStart" is a single date

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

    // Add the break start time to the array
    attendance.breakEnd.push(breakEnd);

    await attendance.save();

    return res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Checkout route
// Check-in Route (/checkin)
router.post("/checkin", async (req, res) => {
  try {
    const { employeeId, date, checkIn } = req.body;

    // Check if an attendance record for the given employee and date already exists
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date,
    });

    if (!existingAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Attendence get route

router.get("/view/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const attendence = await Attendance.find({ employeeId: id });

    if (!attendence) {
      return res.status(404).json({ message: "Attendence not found" });
    }

    res.status(200).json(attendence);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
