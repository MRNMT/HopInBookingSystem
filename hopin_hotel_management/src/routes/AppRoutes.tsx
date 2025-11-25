import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Login} from '../pages/Login';
import { Register } from '../pages/Register';
import { LandingPage } from '../pages/LandingPage';

import { AuthProvider } from '../context/AuthContext';
import { SuperAdminDashboard } from '../pages/superadmin/SuperAdminDashboard';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
