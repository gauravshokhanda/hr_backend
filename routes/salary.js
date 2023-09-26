const express = require("express");
const router = express.Router();
const Salary = require("../models/salary");
const Employee = require("../models/employe");
const {
  calculateAndSaveSalary,
  calculateAndSaveSalaries,
} = require("../utils/calculatesalary");

// Create a new salary record for an employee
// Create a new salary record for an employee
router.post("/create-salary", async (req, res) => {
  try {
    const { employeeId, totalWorkingDays, bonus } = req.body;

    // Check if the employee with the specified ID exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Calculate HRA, Conveyance, and PF based on percentages
    const totalSalary = employee.salary + bonus;
    const hraSalary = (2 / 100) * totalSalary;
    const conveyance = (4 / 100) * totalSalary;
    const pfSalary = (8 / 100) * totalSalary;

    // Calculate Basic Salary as the remaining amount after deducting HRA, Conveyance, and PF
    const basicSalary = totalSalary - hraSalary - conveyance - pfSalary;

    // Create a new salary record
    const salaryRecord = new Salary({
      employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      monthlySalary: employee.salary,
      totalWorkingDays,
      bonus,
      basicSalary,
      hraSalary,
      conveyance,
      pfSalary,
      totalSalary,
      bonus,
    });

    // Save the salary record to the database
    await salaryRecord.save();

    res.status(201).json({
      message: "Salary record created successfully",
      totalSalary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/calculate-salaries", async (req, res) => {
  try {
    const { employeeIds } = req.body;

    // Check if the employeeIds field is an array
    if (!Array.isArray(employeeIds)) {
      return res
        .status(400)
        .json({ message: "employeeIds should be an array" });
    }

    const salaryResults = [];

    for (const employeeId of employeeIds) {
      // Check if the employee with the specified ID exists
      const employee = await Employee.findById(employeeId);

      if (!employee) {
        salaryResults.push({
          employeeId,
          error: "Employee not found",
        });
        continue; // Skip to the next employee
      }

      // Calculate the salary
      let calculatedSalary;
      try {
        calculatedSalary = await calculateAndSaveSalary(employeeId, 30);

        console.log(calculatedSalary, "test");

        // Check if calculatedSalary is a valid number
        if (isNaN(calculatedSalary) || calculatedSalary < 0) {
          throw new Error("Invalid salary calculation result");
        }
      } catch (error) {
        // Handle any errors that occur during salary calculation
        console.error(error);
        salaryResults.push({
          employeeId,
          error: "Error calculating salary",
        });
        continue; // Skip to the next employee
      }

      salaryResults.push({
        employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        calculatedSalary,
      });
    }

    res.status(200).json(salaryResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// View a single salary record by employee ID
router.get("/view-salary/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find the salary record for the specified employee ID
    const salaryRecord = await Salary.findOne({ employeeId });

    if (!salaryRecord) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.status(200).json(salaryRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Edit a single salary record by employee ID
router.put("/edit-salary/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { totalWorkingDays, bonus } = req.body;

    // Find the salary record for the specified employee ID
    const salaryRecord = await Salary.findOne({ employeeId });

    if (!salaryRecord) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    // Update the salary record with the new data
    salaryRecord.totalWorkingDays = totalWorkingDays;
    salaryRecord.bonus = bonus;

    // Recalculate the total salary with the updated data
    salaryRecord.totalSalary = salaryRecord.calculatedSalary + bonus;

    // Save the updated salary record to the database
    await salaryRecord.save();

    res.status(200).json({
      message: "Salary record updated successfully",
      salaryRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a single salary record by employee ID
router.delete("/delete-salary/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find and delete the salary record for the specified employee ID
    const deletedSalaryRecord = await Salary.findOneAndDelete({ employeeId });

    if (!deletedSalaryRecord) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.status(200).json({
      message: "Salary record deleted successfully",
      deletedSalaryRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
