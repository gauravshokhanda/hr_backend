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
router.get("/list", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Employee endpoint
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, isStaff, isAdmin, dateOfJoining, salary } =
      req.body;
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

    // Save the updated employee to the database
    await employee.save();

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// View Single Employee endpoint
router.get("/view/:id", async (req, res) => {
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

module.exports = router;
