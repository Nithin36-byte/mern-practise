
require("dotenv").config();

const connectDB = require("./config/db");
const Student = require("./models/Student");

const testStudent = async () => {
  try {
    await connectDB();

    const student = await Student.create({
      fullName: "Rahul Kumar",
      email: "rahul.test@example.com",
      mobile: "9876543210",
      gender: "Male",
      course: "MERN Stack Development",
      address: "Hyderabad, Telangana"
    });

    console.log("Student created successfully:");
    console.log(student);

    process.exit(0);
  } catch (error) {
    console.error("Student creation failed:", error.message);
    process.exit(1);
  }
};

testStudent();
