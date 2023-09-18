const Salary = require("../models/salary");
const Employee = require("../models/employe"); // Import the Employee model
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Calculate and save monthly salary for an employee
const calculateAndSaveSalary = async (employeeId, totalWorkingDays) => {
  try {
    // Retrieve the employee's monthly salary from the Employee model
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }

    // Calculate the salary based on the provided formula
    const calculatedSalary = (employee.salary / 30) * totalWorkingDays;

    // Create or update the corresponding salary record in the Salary model
    await Salary.findOneAndUpdate(
      { employeeId },
      {
        employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        monthlySalary: employee.salary,
        totalWorkingDays,
        calculatedSalary,
      },
      { upsert: true } // Create a new record if it doesn't exist
    );

    return calculatedSalary;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { calculateAndSaveSalary };
