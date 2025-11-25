import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../pages/AdminDashboard';
import { Rooms } from '../pages/Rooms';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path='/rooms' element={<Rooms />} />
       
      </Routes>
    </BrowserRouter>
  )
}
