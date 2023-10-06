const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    holiday: {
        type: Boolean,
    },
    allDay: Boolean,
})

module.exports = mongoose.model("Holiday", holidaySchema);