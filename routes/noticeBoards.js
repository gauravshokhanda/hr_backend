const express = require("express");
const router = express.Router();
const Notice = require("../models/noticeBoard"); // Import the Notice model

// POST: Create a notice
router.post("/notice", async (req, res) => {
  try {
    const { heading, description, imgPath, tags } = req.body;

    const notice = new Notice({
      heading,
      description,
      imgPath,
      tags,
    });

    // Save the notice to the database
    await notice.save();
    console.log("Notice saved successfully");
    res.status(201).json({ message: "Notice created successfully" });
  } catch (error) {
    console.error("Error saving notice:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET: List all notices
router.get("/list", async (req, res) => {
  try {
    const notices = await Notice.find();
    const mappedNotices = notices.map((notice) => ({
      _id: notice._id,
      heading: notice.heading,
      description: notice.description,
      imgPath: notice.imgPath,
      tags: notice.tags,
    }));
    console.log(mappedNotices, "notices");
    res.status(200).json(notices);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Log the specific validation errors
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      console.error("Validation errors:", validationErrors);
      res.status(400).json({ message: "Validation failed", errors: validationErrors });
    } else {
      console.error("Error saving notice:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// GET: View a single notice by ID
router.get("/notice/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the notice by ID
    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json(notice);
    768;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
