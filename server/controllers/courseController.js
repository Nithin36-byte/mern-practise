const mongoose = require("mongoose");

const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const Student = require("../models/Student");

// Get all courses
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "fullName email specialization")
      .sort({ createdAt: -1 })
      .lean();

    const courseList = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Student.countDocuments({
          course: course._id,
        });

        return {
          ...course,
          studentCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: courseList.length,
      data: courseList,
    });
  } catch (error) {
    next(error);
  }
};

// Get one course
const getCourseById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id)
      .populate("instructor", "fullName email specialization");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const studentCount = await Student.countDocuments({
      course: course._id,
    });

    res.status(200).json({
      success: true,
      data: {
        ...course.toJSON(),
        studentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get students enrolled in a course
const getCourseStudents = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const students = await Student.find({
      course: course._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      course: course.name,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// Create course
const createCourse = async (req, res, next) => {
  try {
    const {
      name,
      code,
      description,
      duration,
      fee,
      status,
      instructorId,
    } = req.body;

    if (!name || !code || !duration || fee === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, code, duration and fee are required",
      });
    }

    if (!Number.isFinite(Number(fee)) || Number(fee) < 0) {
      return res.status(400).json({
        success: false,
        message: "Fee must be a valid non-negative number",
      });
    }

    const existingCourse = await Course.findOne({
      code: code.trim().toUpperCase(),
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "Course code already exists",
      });
    }

    let instructor = null;

    if (instructorId) {
      if (!mongoose.isValidObjectId(instructorId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid instructor ID",
        });
      }

      instructor = await Instructor.findById(instructorId);

      if (!instructor) {
        return res.status(404).json({
          success: false,
          message: "Instructor not found",
        });
      }
    }

    const course = await Course.create({
      name,
      code,
      description,
      duration,
      fee: Number(fee),
      status,
      instructor: instructor ? instructor._id : null,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// Update course
const updateCourse = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const allowedFields = [
      "name",
      "code",
      "description",
      "duration",
      "fee",
      "status",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    }

    if (req.body.instructorId !== undefined) {
      if (!req.body.instructorId) {
        course.instructor = null;
      } else {
        if (!mongoose.isValidObjectId(req.body.instructorId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid instructor ID",
          });
        }

        const instructor = await Instructor.findById(
          req.body.instructorId
        );

        if (!instructor) {
          return res.status(404).json({
            success: false,
            message: "Instructor not found",
          });
        }

        course.instructor = instructor._id;
      }
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Course code already exists",
      });
    }

    next(error);
  }
};

// Delete course
const deleteCourse = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const studentCount = await Student.countDocuments({
      course: course._id,
    });

    if (studentCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete a course that has enrolled students",
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getCourseStudents,
  createCourse,
  updateCourse,
  deleteCourse,
};