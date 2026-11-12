
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

const validateRequest = require("../middleware/validateRequest");

const {
  studentIdParamsSchema,
  fileIdParamsSchema
} = require("../validators/studentValidation");

const {
  uploadPhoto,
  uploadDocument,
} = require("../middleware/uploadMiddleware");

const {
  uploadProfilePhoto,
  uploadSupportingDocument,
  getStudentFiles,
  getFile,
  deleteFile,
} = require("../controllers/uploadController");

// All file routes require authentication
router.use(protect);

// Get a student's uploaded files
router.get(
  "/student/:studentId",
  validateRequest(studentIdParamsSchema, "params"),
  getStudentFiles
);

// Upload profile photo
router.post(
  "/:studentId/photo",
  validateRequest(studentIdParamsSchema, "params"),
  authorize("Admin", "Staff"),
  uploadPhoto,
  uploadProfilePhoto
);

// Upload supporting PDF document
router.post(
  "/:studentId/document",
  validateRequest(studentIdParamsSchema, "params"),
  authorize("Admin", "Staff"),
  uploadDocument,
  uploadSupportingDocument
);

// Access a protected file
router.get(
  "/:fileId",
  validateRequest(fileIdParamsSchema, "params"),
  getFile
);

// Delete a file
router.delete(
  "/:fileId",
  validateRequest(fileIdParamsSchema, "params"),
  authorize("Admin", "Staff"),
  deleteFile
);

module.exports = router;
