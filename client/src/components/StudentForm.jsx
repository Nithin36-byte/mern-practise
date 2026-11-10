
import React from "react";
import { Routes, Route, Link } from "react-router-dom";

// Authentication pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Student page
import StudentManagement from "./pages/StudentManagement";

// Task 12 pages
import CourseManagement from "./pages/CourseManagement";
import InstructorManagement from "./pages/InstructorManagement";
import CourseDetails from "./pages/CourseDetails";

// Protected route
import ProtectedRoute from "./components/ProtectedRoute";

// Home page
function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Management System</h1>

      <p>Welcome to the Student Management System.</p>

      <nav>
        <Link to="/login">Login</Link>{" | "}
        <Link to="/register">Register</Link>{" | "}
        <Link to="/students">Students</Link>{" | "}
        <Link to="/courses">Courses</Link>{" | "}
        <Link to="/instructors">Instructors</Link>{" | "}
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  );
}

// Page not found
function NotFound() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>404 - Page Not Found</h1>

      <p>The page you are looking for does not exist.</p>

      <Link to="/">Go to Home</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Student Management */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <StudentManagement />
          </ProtectedRoute>
        }
      />

      {/* User Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Task 12 - Course Management */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CourseManagement />
          </ProtectedRoute>
        }
      />

      {/* Task 12 - Instructor Management */}
      <Route
        path="/instructors"
        element={
          <ProtectedRoute>
            <InstructorManagement />
          </ProtectedRoute>
        }
      />

      {/* Task 12 - Course Details */}
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />

      {/* Invalid routes */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;
