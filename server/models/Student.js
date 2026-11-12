
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Student name is required"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        mobile: {
            type: String,
            required: [true, "Mobile number is required"],
            trim: true
        },

        gender: {
            type: String,
            required: [true, "Gender is required"],
            enum: ["Male", "Female", "Other"]
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            default: null
        },

        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true
        },

        enrollmentStatus: {
            type: String,
            enum: ["Enrolled", "Active", "Completed", "Dropped"],
            default: "Enrolled"
        }
    },
    {
        timestamps: true
    }
);

// Indexes for common listing queries
studentSchema.index({ createdAt: -1 });
studentSchema.index({ course: 1, gender: 1 });

// Create Student model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
