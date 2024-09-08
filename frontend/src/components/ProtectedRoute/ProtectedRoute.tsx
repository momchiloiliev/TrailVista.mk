import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element; // The component (route) to protect
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();  // Get the logged-in user from the AuthContext
  const location = useLocation(); // Get the current location

  if (!user) {
    // If user is not logged in, redirect to login page and pass the attempted location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;  // If user is logged in, render the children (protected component)
};

export default ProtectedRoute;