import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'admin' | 'superadmin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
      // If user is admin/superadmin but required role is specific, handle it
      // For CMS, we generally allow admin and superadmin
      if ((requiredRole === 'admin' || requiredRole === 'superadmin') && (user.role === 'admin' || user.role === 'superadmin')) {
          return <>{children}</>;
      }
    return <Navigate to="/login" replace />;
  }
  
  // General check for admin access if no specific role passed but it's a protected route in CMS
  if (!requiredRole && user?.role !== 'admin' && user?.role !== 'superadmin') {
       return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
