const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

const validateStudentId = require("../middleware/validateStudentId");

const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// Require login for all student routes
router.use(protect);

// View and create students
router.route("/")
  .get(getStudents)
  .post(authorize("Admin", "Staff"), createStudent);

// View, update and delete individual students
router.route("/:id")
  .get(validateStudentId, getStudentById)
  .patch(
    validateStudentId,
    authorize("Admin", "Staff"),
    updateStudent
  )
  .delete(
    validateStudentId,
    authorize("Admin"),
    deleteStudent
  );

module.exports = router;