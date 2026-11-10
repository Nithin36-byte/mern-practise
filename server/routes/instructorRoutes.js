const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

const {
  getInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} = require("../controllers/instructorController");

router.use(protect);

router.route("/")
  .get(getInstructors)
  .post(authorize("Admin", "Staff"), createInstructor);

router.route("/:id")
  .get(getInstructorById)
  .patch(authorize("Admin", "Staff"), updateInstructor)
  .delete(authorize("Admin"), deleteInstructor);

module.exports = router;