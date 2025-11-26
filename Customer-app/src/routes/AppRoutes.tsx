import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { LandingPage } from '../pages/LandingPage';
import { BookingPage } from '../pages/BookingPage';
import { FindPage } from '../pages/FindPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ConfirmPayment } from '../pages/ConfirmPayment';
import { SuperAdminDashboard } from '../pages/superadmin/SuperAdminDashboard';

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
        <Route path="/confirm_payment" element={<ConfirmPayment />} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
