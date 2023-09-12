const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgPath: {
    type: String,
    required: true,
  },
  noticeDate: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
    enum: ["present", "absent", "late", "holiday"],
    required: false,
  },
});


module.exports = mongoose.model("Notice", noticeSchema);
