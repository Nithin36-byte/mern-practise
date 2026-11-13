import Dashboard from "./pages/Dashboard";
import StudentUploads from "./pages/StudentUploads";
import CourseManagement from "./pages/CourseManagement";
import InstructorManagement from "./pages/InstructorManagement";
import CourseDetails from "./pages/CourseDetails";
import {
  Routes,
  Route,
  Link
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentManagement from "./pages/StudentManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
 
  return (
    <div className="student-container">
      <h1>Welcome to Student Portal</h1>
      <p>Manage your student information in one place.</p>

      <nav>
        <Link to="/courses">Courses</Link>{" | "}
<Link to="/instructors">Instructors</Link>
<Link to="/dashboard">Dashboard</Link>
<Link to="/student-uploads">Student File Management</Link>
        <Link to="/">Home</Link> |
        <Link to="/login"> Login</Link> |
        <Link to="/register"> Register</Link> |
        <Link to="/students"> Student Management</Link> |
        <Link to="/profile"> My Profile</Link>
      </nav>

      <div className="student-card">
        <h2>Student Management</h2>
        <p>Manage student information easily.</p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="student-container">
      <h1>404 - Page Not Found</h1>
      <Link to="/">Go Back to Home</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
  path="/courses"
  element={
    <ProtectedRoute>
      <CourseManagement />
    </ProtectedRoute>
  }
/>
<Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>
<Route
  path="/student-uploads"
  element={
    <ProtectedRoute>
      <StudentUploads />
    </ProtectedRoute>
  }
/>
<Route
  path="/instructors"
  element={
    <ProtectedRoute>
      <InstructorManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/courses/:id"
  element={
    <ProtectedRoute>
      <CourseDetails />
    </ProtectedRoute>
  }
/>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <StudentManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
