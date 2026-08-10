import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, ready, user } = useAuth();

  if (!ready) return null;
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles.length && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

export default RoleProtectedRoute;
