
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Supports both nested routes and children
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
