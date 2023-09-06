const express = require("express");
const router = express.Router();
const Employee = require("../models/employe");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");

// Registration endpoint
router.post("/register", async (req, res) => {
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

    const employee = new Employee({
      firstName,
      lastName,
      userName,
      password: hashedPassword, // Save the hashed password
      isStaff,
      isAdmin,
      dateOfJoining,
      salary,
    });

    // Save the employee to the database
    await employee.save();
    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Find the employee by username
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

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// authenticateToken,

//list
router.get("/list", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
