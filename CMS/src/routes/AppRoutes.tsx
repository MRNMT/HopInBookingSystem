import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../pages/AdminDashboard';
import { Rooms } from '../pages/Rooms';
import { CustomerMetricsPage } from '../pages/CustomerMetricsPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path='/rooms' element={<Rooms />} />
        <Route path='/customer-metrics' element={<CustomerMetricsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
