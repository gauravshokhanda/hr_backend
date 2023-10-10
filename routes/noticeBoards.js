const express = require("express");
const router = express.Router();
const Notice = require("../models/noticeBoard");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./upload/images", // Specify the directory where uploaded images will be stored
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// POST: Create a notice
router.post("/notice", upload.single("image"), async (req, res) => {
  try {
    const { heading, description, noticeDate, tags } = req.body;
    const imgPath = req.file ? req.file.path : null;

    const notice = new Notice({
      heading,
      description,
      imgPath,
      noticeDate: new Date(),
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
    res.status(200).json(notices);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Log the specific validation errors
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      console.error("Validation errors:", validationErrors);
      res
        .status(400)
        .json({ message: "Validation failed", errors: validationErrors });
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

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/notice/update", upload.single("image"), async (req, res) => {
  try {

    const { id, heading, description, imgPath, tags } = req.body;

    const updateNotice = {
      heading: heading,
      description: description,
      imgPath: imgPath,
      tags: tags,
    };

    const findNotice = await Notice.findByIdAndUpdate({ _id: id }, updateNotice);

    if(!findNotice){
      return res.status(404).json({ message: "Notice not found" });
    }
    res.status(200).json(findNotice);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
