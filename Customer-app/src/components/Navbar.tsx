import logo from "../assets/logo.jpg";
import { Button } from "./Button";
import { Bell, Heart } from "lucide-react";
import { Link } from "react-router-dom";


export const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-19 w-19 rounded-full object-cover" />
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex gap-8 text-gray-700 font-medium ">
        <li className="hover:text-[#0088FF] cursor-pointer">Hotels</li>
        <li className="hover:text-[#0088FF] cursor-pointer">Destinations</li>
        <li className="hover:text-[#0088FF] cursor-pointer">Deals</li>
        <li className="hover:text-[#0088FF] cursor-pointer">About</li>
      </ul>
      

      

      {/* Button */}
      <div className="flex gap-1  ">
        <div className="flex gap-2 mt-2 mr-4">
            <Bell className="w-6 h-6 text-gray-700 hover:text-[#0088FF] cursor-pointer" />
            <Heart className="w-6 h-6 text-gray-700 hover:text-[#0088FF] cursor-pointer" />

        </div>
        
        <Link to="/login">
          <Button variant="primary">Sign In</Button>
        </Link>
      </div>

    </nav>
  );
};
