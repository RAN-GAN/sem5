import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();

  console.log("ProtectedRoute - isAuthenticated:", authenticated);

  if (!authenticated) {
    console.log("Not authenticated, redirecting to login");
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  console.log("Authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;
