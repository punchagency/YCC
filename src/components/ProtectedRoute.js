import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirect to login page with the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
