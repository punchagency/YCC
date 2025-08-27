import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/userContext";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Get role name from object or string
  let userRole = user.role;
  if (typeof userRole === 'object' && userRole.name) {
    userRole = userRole.name;
  }

  // If requiredRoles is provided and not empty, check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    // Redirect based on user role
    if (userRole === "crew_member") {
      return <Navigate to="/crew/dashboard" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "supplier") {
      return <Navigate to="/supplier/dashboard" replace />;
    } else if (userRole === "service_provider") {
      return <Navigate to="/service-provider/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
