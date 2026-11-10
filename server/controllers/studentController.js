const mongoose = require("mongoose");
const Course = require("../models/Course");
const Student = require("../models/Student");

// Get all students

const getStudents = async (req, res, next) => {
  try {
    const {
      search = "",
      course = "",
      gender = "",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;
   const {
  sendEnrollmentConfirmation,
   } = require("../services/emailService");

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    // Validate page number
    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer"
      });
    }

    // Allow only 10, 25 or 50 records
    if (![10, 25, 50].includes(limit)) {
      return res.status(400).json({
        success: false,
        message: "Limit must be 10, 25 or 50"
      });
    }

    // Validate sorting fields
    if (!["fullName", "createdAt"].includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort field"
      });
    }

    if (!["asc", "desc"].includes(sortOrder)) {
      return res.status(400).json({
        success: false,
        message: "Sort order must be asc or desc"
      });
    }

    // Validate search and filter values
    if (
      typeof search !== "string" ||
      typeof course !== "string" ||
      typeof gender !== "string" ||
      search.length > 100 ||
      course.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid search or filter value"
      });
    }

    if (
      gender &&
      !["Male", "Female", "Other"].includes(gender)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender filter"
      });
    }

    // Escape special regular expression characters
    const escapeRegex = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Create MongoDB filter
    const filter = {};

    // Search by student name or email
    if (search.trim()) {
      const searchValue = escapeRegex(search.trim());

      filter.$or = [
        {
          fullName: {
            $regex: searchValue,
            $options: "i"
          }
        },
        {
          email: {
            $regex: searchValue,
            $options: "i"
          }
        }
      ];
    }

    // Filter by course (case-insensitive exact match)
    if (course.trim()) {
      filter.course = {
        $regex: `^${escapeRegex(course.trim())}$`,
        $options: "i"
      };
    }

    // Filter by gender
    if (gender) {
      filter.gender = gender;
    }

    // Sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortOptions = {
      [sortBy]: sortDirection
    };

    // Pagination
    const skip = (page - 1) * limit;

    // Retrieve records and matching total count
    const [students, total] = await Promise.all([
      Student.find(filter)
         .populate("course", "name code")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
        
      Student.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: students
    });

  } catch (error) {
    next(error);
  }
};


// Get student by ID
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
     populate("course", "name code");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};
  
// Create student
const createStudent = async (req, res, next) => {
  try {
    const { fullName, email, mobile, gender, course, address } = req.body;

    if (!fullName || !email || !mobile || !gender || !course || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required student fields"
      });
    }
if (req.body.course) {
  if (!mongoose.isValidObjectId(req.body.course)) {
    return res.status(400).json({
      success: false,
      message: "Invalid course ID",
    });
  }

  const selectedCourse = await Course.findById(req.body.course);

  if (!selectedCourse) {
    return res.status(404).json({
      success: false,
      message: "Selected course not found",
    });
  }
}
    const student = await Student.create({
      fullName,
      email,
      mobile,
      gender,
      course,
      address
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Update student
const updateStudent = async (req, res, next) => {
  try {
    const allowedFields = [
      "fullName", "email", "mobile",
      "gender", "course", "address"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one valid field to update"
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// Delete student
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
