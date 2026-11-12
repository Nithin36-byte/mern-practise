
require("dotenv").config({ path: __dirname + "/.env" });

const mongoose = require("mongoose");
const Student = require("./models/Student");
const Course = require("./models/Course");

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

async function fixStudentCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for migration");

        // Read existing student records directly from MongoDB
        const students = await Student.collection
            .find({ course: { $type: "string" } })
            .toArray();

        // Read all available courses
        const courses = await Course.collection.find({}).toArray();

        console.log("Students with old course names:", students.length);
        console.log("Available courses:", courses.length);

        let updated = 0;
        let unmatched = 0;

        for (const student of students) {
            const oldCourseName = student.course;

            // Find a matching course by name or code
            const matchedCourse = courses.find((course) => {
                return (
                    normalize(course.name) === normalize(oldCourseName) ||
                    normalize(course.code) === normalize(oldCourseName)
                );
            });

            if (matchedCourse) {
                await Student.collection.updateOne(
                    { _id: student._id },
                    {
                        $set: {
                            course: matchedCourse._id
                        },
                        $unset: {
                            legacyCourseName: ""
                        }
                    }
                );

                updated++;

                console.log("Updated:", oldCourseName);
            } else {
                // Preserve the old course name before removing
                // the invalid string reference.
                await Student.collection.updateOne(
                    { _id: student._id },
                    {
                        $set: {
                            course: null,
                            legacyCourseName: oldCourseName
                        }
                    }
                );

                unmatched++;

                console.log("No matching course found:", oldCourseName);
            }
        }

        console.log("--------------------------------");
        console.log("Migration completed");
        console.log("Updated students:", updated);
        console.log("Unmatched students:", unmatched);
        console.log("--------------------------------");

    } catch (error) {
        console.error("Migration failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

fixStudentCourses();
