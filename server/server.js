const uploadRoutes = require("./routes/uploadRoutes");
const courseRoutes = require("./routes/courseRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

console.log("Environment mode:", process.env.NODE_ENV);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);

// Home route
app.get("/", (req, res) => {
  res.status(200).send("Student Management System API is running");
});

// Student routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
// Error handling
app.use("/api/uploads", uploadRoutes);
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
};

startServer();
