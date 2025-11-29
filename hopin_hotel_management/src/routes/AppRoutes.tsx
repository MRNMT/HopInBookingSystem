import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { SuperAdminDashboard } from '../pages/SuperAdminDashboard';
import { AdminManagement } from '../pages/AdminManagement';
import { SuperAdminProfile } from '../pages/SuperAdminProfile';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/superadmin" replace />} />
        <Route 
          path="/superadmin" 
          element={
            <ProtectedRoute requiredRole="superadmin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/admins" 
          element={
            <ProtectedRoute requiredRole="superadmin">
              <AdminManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/profile" 
          element={
            <ProtectedRoute requiredRole="superadmin">
              <SuperAdminProfile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}
