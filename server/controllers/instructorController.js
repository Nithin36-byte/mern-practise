const mongoose = require("mongoose");

const Instructor = require("../models/Instructor");
const Course = require("../models/Course");

// Get all instructors
const getInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.find()
      .sort({ createdAt: -1 })
      .lean();

    const instructorList = await Promise.all(
      instructors.map(async (instructor) => {
        const courseCount = await Course.countDocuments({
          instructor: instructor._id,
        });

        return {
          ...instructor,
          courseCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: instructorList.length,
      data: instructorList,
    });
  } catch (error) {
    next(error);
  }
};

// Get one instructor
const getInstructorById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid instructor ID",
      });
    }

    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const courses = await Course.find({
      instructor: instructor._id,
    }).select("name code status");

    res.status(200).json({
      success: true,
      data: {
        ...instructor.toJSON(),
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create instructor
const createInstructor = async (req, res, next) => {
  try {
    const { fullName, email, specialization } = req.body;

    if (!fullName || !email || !specialization) {
      return res.status(400).json({
        success: false,
        message: "All instructor fields are required",
      });
    }

    const existingInstructor = await Instructor.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingInstructor) {
      return res.status(409).json({
        success: false,
        message: "Instructor email already exists",
      });
    }

    const instructor = await Instructor.create({
      fullName,
      email,
      specialization,
    });

    res.status(201).json({
      success: true,
      message: "Instructor created successfully",
      data: instructor,
    });
  } catch (error) {
    next(error);
  }
};

// Update instructor
const updateInstructor = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid instructor ID",
      });
    }

    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const allowedFields = [
      "fullName",
      "email",
      "specialization",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        instructor[field] = req.body[field];
      }
    }

    await instructor.save();

    res.status(200).json({
      success: true,
      message: "Instructor updated successfully",
      data: instructor,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Instructor email already exists",
      });
    }

    next(error);
  }
};

// Delete instructor
const deleteInstructor = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid instructor ID",
      });
    }

    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const courseCount = await Course.countDocuments({
      instructor: instructor._id,
    });

    if (courseCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Remove this instructor from courses before deleting",
      });
    }

    await instructor.deleteOne();

    res.status(200).json({
      success: true,
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor,
};