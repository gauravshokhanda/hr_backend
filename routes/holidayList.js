const express = require("express");
const router = express.Router();
const Holiday = require("../models/holidayListModel");

router
  .route("/holiday-list")
  .post(async (req, res) => {
    try {
      const eventData = req.body;
      console.log(eventData);

      const newHoliday = new Holiday(eventData);

      await newHoliday.save();
      console.log("Holiday saved successfully");
      res.status(200).json({ message: "Hoiday saved successfully" });
    } catch (error) {
      console.error("There is some error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
  .get(async (req, res) => {
    try {
      const holidays = await Holiday.find();
      res.status(200).json(holidays);
    } catch (error) {
      res.status(500).json({ message: "Internal server Error" });
      console.error("There is some error", error);
    }
  });

router.delete("/holiday-list/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const deleteHoliday = await Holiday.findOneAndDelete({ _id: id });

    if (!deleteHoliday) {
      return res.status(404).json({ message: "Holiday record not found" });
    }

    res.status(200).json({
      message: "Holiday deleted successfully",
      deleteRecord: deleteHoliday,
    });
  } catch (error) {
    console.error("There is some error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/holiday-list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end, holiday, allDay } = req.body;
 
    console.log(id);

    const updateRecord = await Holiday.findOneAndUpdate({ _id: id }, {
      start: start,
      end: end,
      allDay: allDay,
      holiday: holiday,
    });

    if (!updateRecord) {
      return res.status(404).json({ message: "Holiday record not found" });
    }

    res.status(200).json({
      message: "Holiday Updated successfully",
      deleteRecord: updateRecord,
    });
  } catch (error) {
    console.error("There is some error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
