const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const employesSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isStaff: {
    type: Boolean,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  dateOfJoining: {
    type: Date,
  },
  salary: {
    type: Number,
  },
  designation: {
    type: String,
  },
  active: {
    type: Number,
  },
  token: {
    type: String,
  },
  image: {
    type: String,
  },
  attendance: [
    {
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["present", "absent", "late", "holiday"],
        required: true,
      },
    },
  ],
});

employesSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

employesSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, userName: this.userName },
    "qwertyuiopasdfghjklzxcvbnmm",
    { expiresIn: "8h" }
  );
  return token;
};

module.exports = mongoose.model("Employee", employesSchema);
