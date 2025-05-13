import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/userContext";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If requiredRoles is provided and not empty, check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === "crew_member") {
      return <Navigate to="/crew/dashboard" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
