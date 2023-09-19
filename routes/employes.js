const express = require("express");
const router = express.Router();
const Employee = require("../models/employe");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//start engine
const storage = multer.diskStorage({
  destination: "./upload//images/employees",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: storage,
});

router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      password,
      isStaff,
      isAdmin,
      dateOfJoining,
      salary,
      userEmail,
    } = req.body;

    // Check if an employee with the same username already exists
    const existingEmployee = await Employee.findOne({ userName });

    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this username already exists" });
    }

    // Hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Get the uploaded image file and store its path
    const image = req.file ? req.file.path : "";

    const employee = new Employee({
      firstName,
      lastName,
      userName,
      password: hashedPassword,
      isStaff,
      isAdmin,
      dateOfJoining,
      salary,
      image,
      userEmail,
    });

    // Save the employee to the database
    await employee.save();
    res
      .status(201)
      .json({ message: "Employee registered successfully", image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const employee = await Employee.findOne({ userName });

    // Check if the employee exists
    if (!employee) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, employee.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { _id: employee._id, userName: employee.userName },
      process.env.JWT_SECRET, // Use an environment variable for the secret
      { expiresIn: "8h" }
    );

    // Return the user information and token
    res.status(200).json({ user: employee, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// authenticateToken,

//list
router.get("/list", authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      isStaff,
      isAdmin,
      dateOfJoining,
      salary,
      userEmail,
    } = req.body;

    // Check if an image file was uploaded
    let imagePath;
    if (req.file) {
      imagePath = req.file.path; // Get the path to the uploaded image
    }

    // Find the employee by ID
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the employee's information
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.isStaff = isStaff;
    employee.isAdmin = isAdmin;
    employee.dateOfJoining = dateOfJoining;
    employee.salary = salary;
    employee.userEmail = userEmail;

    // Update the image path if an image was uploaded
    if (imagePath) {
      employee.image = imagePath;
    }

    // Save the updated employee
    await employee.save();

    res
      .status(200)
      .json({
        message: "Employee updated successfully",
        updatedEmployee: employee,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// View Single Employee endpoint
router.get("/view/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the employee by ID
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/:id/attendance", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status, checkIn, checkOut, breakStart, breakEnd } = req.body;

    // Find the employee by ID
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.attendance.push({
      date,
      status,
      checkIn,
      checkOut,
      breakStart,
      breakEnd,
    });
    await employee.save();

    res.status(201).json({ message: "Attendance record added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id/attendance", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee.attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put(
  "/:id/attendance/:attendanceId",
  authenticateToken,
  async (req, res) => {
    try {
      const { id, attendanceId } = req.params;
      const { date, status } = req.body;

      const employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Find the attendance record by ID in the employee's attendance array
      const attendanceRecord = employee.attendance.id(attendanceId);

      if (!attendanceRecord) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      // Update the attendance record
      attendanceRecord.date = date;
      attendanceRecord.status = status;

      // Save the updated employee with the modified attendance record
      await employee.save();

      res
        .status(200)
        .json({ message: "Attendance record updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Delete an attendance record for a specific employee
router.delete(
  "/:id/attendance/:attendanceId",
  authenticateToken,
  async (req, res) => {
    try {
      const { id, attendanceId } = req.params;

      // Find the employee by ID
      const employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Remove the attendance record by ID from the employee's attendance array
      employee.attendance.pull({ _id: attendanceId });

      // Save the updated employee with the removed attendance record
      await employee.save();

      res
        .status(200)
        .json({ message: "Attendance record deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
