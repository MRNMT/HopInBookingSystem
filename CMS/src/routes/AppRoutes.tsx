import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../pages/AdminDashboard';
import { Rooms } from '../pages/Rooms';
import { CustomerMetricsPage } from '../pages/CustomerMetricsPage';
import { Analytics } from '../pages/Analytics';
import { Settings } from '../pages/Settings';
import { Bookings } from '../pages/Bookings';
import { SuperAdmin } from '../pages/SuperAdmin';
import { Login } from '../pages/Login';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path='/rooms' element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        } />
        <Route path='/customer-metrics' element={
          <ProtectedRoute>
            <CustomerMetricsPage />
          </ProtectedRoute>
        } />
        <Route path='/analytics' element={
          <ProtectedRoute>
            <Analytics/>
          </ProtectedRoute>
        } />
        <Route path='/settings' element={
          <ProtectedRoute>
            <Settings/>
          </ProtectedRoute>
        } />
        <Route path='/bookings' element={
          <ProtectedRoute>
            <Bookings/>
          </ProtectedRoute>
        } />
         <Route path='/users' element={
          <ProtectedRoute requiredRole="superadmin">
            <SuperAdmin/>
          </ProtectedRoute>
         } />
      </Routes>
    </BrowserRouter>
  )
}
