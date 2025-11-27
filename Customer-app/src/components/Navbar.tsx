import logo from "../assets/logo.jpg";
import { Button } from "./Button";
import { User, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NotificationBell } from "./NotificationBell";
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { useState } from 'react';


export const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-40">
      
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
        <span className="ml-2 font-bold text-xl text-blue-600 hidden sm:block">HopIn</span>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex gap-8 text-gray-700 font-medium ">
        <li className="hover:text-[#0088FF] cursor-pointer" onClick={() => navigate('/find')}>Find Stays</li>
        <li className="hover:text-[#0088FF] cursor-pointer">Destinations</li>
        <li className="hover:text-[#0088FF] cursor-pointer">About</li>
      </ul>
      

      {/* Button */}
      <div className="flex gap-4 items-center">
        <NotificationBell />
        
        {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {user?.name?.charAt(0) || <User className="w-5 h-5" />}
                </div>
                <span className="hidden sm:block font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link 
                    to="/profile" 
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
        ) : (
            <Link to="/login">
                <Button variant="primary">Sign In</Button>
            </Link>
        )}
      </div>

    </nav>
  );
};
