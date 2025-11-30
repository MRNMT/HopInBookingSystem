import { FaBed, FaBars } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { VscGraph } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import { CgLogOut } from "react-icons/cg";
import { type FC, useState } from 'react';
import { type IconType } from 'react-icons';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import logo from '../assets/logo2.png';

interface SidebarItemProps {
  icon: IconType;
  label: string;
  to: string;
  onClick?: () => void;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon: Icon, label, to, onClick }) => {
  const location = useLocation();
  // Check if the current path starts with the link path (for nested routes)
  // or exact match for root "/"
  const active = to === "/" 
    ? location.pathname === "/" 
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 mb-1
        ${active 
          ? "bg-blue-600 text-white shadow-md" 
          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"}
      `}
    >
      <Icon className={`text-xl ${active ? "text-white" : "text-gray-500"}`} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export const SideBar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Close sidebar when an item is clicked (useful on mobile)
  const handleItemClick = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        type="button" 
        aria-label="Toggle Menu"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white text-blue-600 rounded-md shadow-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FaBars className="text-xl" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:shadow-none lg:border-r border-gray-200
        `}
      >
        {/* Header / Logo */}
        <div className="p-6 flex flex-col items-center border-b border-gray-100">
          <img src={logo} alt="HopIn Logo" className="w-24 mb-3 object-contain" />
          <h1 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Admin Panel</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <SidebarItem 
            icon={MdOutlineDateRange} 
            label="Dashboard" 
            to="/" 
            onClick={handleItemClick} 
          />
          <SidebarItem 
            icon={MdOutlineDateRange} 
            label="Bookings" 
            to="/bookings" 
            onClick={handleItemClick} 
          />
          <SidebarItem 
            icon={FaBed} 
            label="Accommodations" 
            to="/rooms" 
            onClick={handleItemClick} 
          />
          <SidebarItem 
            icon={GoPeople} 
            label="Customers" 
            to="/customer-metrics" 
            onClick={handleItemClick} 
          />
          <SidebarItem 
            icon={VscGraph} 
            label="Analytics" 
            to="/analytics" 
            onClick={handleItemClick} 
          />
        </nav>

        {/* Footer Actions (Settings & Logout) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <SidebarItem 
            icon={CiSettings} 
            label="Settings" 
            to="/settings" 
            onClick={handleItemClick} 
          />
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 mt-2"
          >
            <CgLogOut className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};