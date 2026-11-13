const Student = require("../models/Student");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");

const getDashboardStats = async (req, res) => {
    try {
        // Read the selected date filter
        const allowedDays = ["7", "30", "90", "365", "all"];
        let days = req.query.days || "30";

        if (!allowedDays.includes(days)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date filter"
            });
        }

        // Filter students based on registration date
        const dateFilter = {};

        if (days !== "all") {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - Number(days));

            dateFilter.createdAt = {
                $gte: startDate
            };
        }

        // Get all dashboard information from MongoDB
        const [
            totalStudents,
            activeCourses,
            totalInstructors,
            recentStudents,
            statusStats,
            courseStats
        ] = await Promise.all([

            // Total students in the database
            Student.countDocuments(),

            // Courses whose status is Active
            Course.countDocuments({
                status: { $in: ["Active", "active"] }
            }),

            // Total instructors
            Instructor.countDocuments(),

            // Recently registered students
            Student.find(dateFilter)
                .select("fullName email mobile course enrollmentStatus createdAt")
                .populate("course", "name code")
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Group students by enrollment status
            Student.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: {
                            $ifNull: ["$enrollmentStatus", "Enrolled"]
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        status: "$_id",
                        count: 1
                    }
                },
                { $sort: { count: -1 } }
            ]),

            // Count students enrolled in each course
            Student.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: "$course",
                        studentCount: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "courses",
                        localField: "_id",
                        foreignField: "_id",
                        as: "courseDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$courseDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        courseName: {
                            $ifNull: ["$courseDetails.name", "Unassigned"]
                        },
                        studentCount: 1
                    }
                },
                { $sort: { studentCount: -1 } }
            ])
        ]);

        res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            filters: {
                days: days
            },
            data: {
                totalStudents,
                activeCourses,
                totalInstructors,
                recentStudents,
                enrollmentStatus: statusStats,
                courseDistribution: courseStats,
                recentActivity: recentStudents
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve dashboard statistics"
        });
    }
};

module.exports = {
    getDashboardStats
};