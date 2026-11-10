const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

const {
  getCourses,
  getCourseById,
  getCourseStudents,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

router.use(protect);

router.route("/")
  .get(getCourses)
  .post(authorize("Admin", "Staff"), createCourse);

router.get("/:id/students", getCourseStudents);

router.route("/:id")
  .get(getCourseById)
  .patch(authorize("Admin", "Staff"), updateCourse)
  .delete(authorize("Admin"), deleteCourse);

module.exports = router;