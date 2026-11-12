
const express = require("express");
const router = express.Router();

// Authentication and authorization
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

// Validation middleware
const validateRequest = require("../middleware/validateRequest");
const { idParamsSchema } = require("../validators/studentValidation");

// Course controllers
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

// Require login for all course routes
router.use(protect);

// Get all courses and create a course
router.route("/")
    .get(getCourses)
    .post(
        authorize("Admin", "Staff"),
        createCourse
    );

// Get, update and delete an individual course
router.route("/:id")
    .get(
        validateRequest(idParamsSchema, "params"),
        getCourseById
    )
    .patch(
        validateRequest(idParamsSchema, "params"),
        authorize("Admin", "Staff"),
        updateCourse
    )
    .delete(
        validateRequest(idParamsSchema, "params"),
        authorize("Admin"),
        deleteCourse
    );

module.exports = router;
