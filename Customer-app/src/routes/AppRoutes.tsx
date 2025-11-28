import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { LandingPage } from '../pages/LandingPage';
import { BookingPage } from '../pages/BookingPage';
import { FindPage } from '../pages/FindPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ConfirmPayment } from '../pages/ConfirmPayment';
import { SuperAdminDashboard } from '../pages/superadmin/SuperAdminDashboard';
import { AdminManagement } from '../pages/superadmin/AdminManagement';
import { AboutPage } from '../pages/AboutPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/find" element={<FindPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/confirm_payment" element={<ConfirmPayment />} />
        
        {/* Super Admin Routes (Protected) */}
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
      </Routes>
    </BrowserRouter>
  )
}
