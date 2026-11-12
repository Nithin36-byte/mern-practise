
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const validateRequest = require("../middleware/validateRequest");

const {
    studentCreateSchema,
    studentUpdateSchema,
    idParamsSchema
} = require("../validators/studentValidation");

const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

// Require login for all student routes
router.use(protect);

// View and create students
router.route("/")
    .get(getStudents)
    .post(
        authorize("Admin", "Staff"),
        validateRequest(studentCreateSchema),
        createStudent
    );

// View, update and delete individual students
router.route("/:id")
    .get(
        validateRequest(idParamsSchema, "params"),
        getStudentById
    )
    .patch(
        validateRequest(idParamsSchema, "params"),
        authorize("Admin", "Staff"),
        validateRequest(studentUpdateSchema),
        updateStudent
    )
    .delete(
        validateRequest(idParamsSchema, "params"),
        authorize("Admin"),
        deleteStudent
    );

module.exports = router;
