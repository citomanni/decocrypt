const multer = require("multer");

// Set up the storage engine for multer
const storage = multer.memoryStorage();

// Filter for image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

// Initialize multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
