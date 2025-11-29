import {  FaBed, FaBars } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { VscGraph } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import logo from '../assets/logo2.png';
import {type FC, useState } from 'react';
import {type IconType } from 'react-icons';
import { Link, useLocation } from "react-router-dom";
import { CgLogOut } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';



interface SidebarItemProps {
  icon: IconType;
  label: string;
  to: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon: Icon, label, to }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded transition 
        ${active ? "bg-blue-500 text-white" : "hover:bg-blue-50"}
      `}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </Link>
  );
};

// ... (imports remain)

export const SideBar: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Toggle Button */} 
      <button type="button" aria-label="submit"
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 fixed top-4 left-4 z-50 bg-blue-500 text-white rounded-md shadow-md"
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg p-6 w-64 transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-72"}
        `}
      >
        {/* Logo */}
        
          {/* <FaHotel className="text-blue-500 text-2xl" /> */}
          <img src={logo} alt="Logo" className="w-20 mt-0 ml-10" />
        

        <h1 className="text-lg font-bold mb-6">Admin Panel</h1>

        {/* Navigation */}
        <nav className="space-y-1">
          <SidebarItem icon={MdOutlineDateRange} label="Dashboard" to="/" />
          <SidebarItem icon={MdOutlineDateRange} label="Bookings" to="/bookings" />
          <SidebarItem icon={FaBed} label="Accommodations" to="/rooms" />
          <SidebarItem icon={GoPeople} label="Customers" to="/customer-metrics" />
          <SidebarItem icon={VscGraph} label="Analytics" to="/analytics" />
          <SidebarItem icon={CiSettings} label="Settings" to="/settings" />
          <SidebarItem icon={FaUsers} label="Users" to="/users" />
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 p-3 rounded transition hover:bg-red-50 text-red-600"
          >
            <CgLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};
