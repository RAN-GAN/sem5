import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
