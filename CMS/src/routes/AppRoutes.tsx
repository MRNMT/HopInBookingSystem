import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../pages/AdminDashboard';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
       
      </Routes>
    </BrowserRouter>
  )
}
