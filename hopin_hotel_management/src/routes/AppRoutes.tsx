import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Login} from '../pages/Login';
import { Register } from '../pages/Register';
import { LandingPage } from '../pages/LandingPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
