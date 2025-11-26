import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../pages/AdminDashboard';
import { Rooms } from '../pages/Rooms';
import { CustomerMetricsPage } from '../pages/CustomerMetricsPage';
import { Analytics } from '../pages/Analytics';
import { Settings } from '../pages/Settings';
import { Bookings } from '../pages/Bookings';
import { SuperAdmin } from '../pages/SuperAdmin';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path='/rooms' element={<Rooms />} />
        <Route path='/customer-metrics' element={<CustomerMetricsPage />} />
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/bookings' element={<Bookings/>}/>
         <Route path='/users' element={<SuperAdmin/>}/>
      </Routes>
    </BrowserRouter>
  )
}
