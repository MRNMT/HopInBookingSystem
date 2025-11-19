import React from "react"
import { Button } from "./Button"
import logo from "../assets/logo2.png"
import { FaXTwitter } from "react-icons/fa6"
import { FiFacebook } from "react-icons/fi"
import { FaInstagram } from "react-icons/fa6"
import { Link } from "react-router-dom";


export const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full text-gray-100">
      {/* <div className="bg-blue-400 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-3">
             
              </Link>
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-[#0088FF]">
      <div className="text-center h-80  ">
        <h2 className="text-2xl md:text-3xl font-semibold mt-50">Ready to start your journey?</h2>
            <p className="mt-1 text-sm md:text-base text-blue-100/90">
              Join thousands of satisfied travelers who trust HopIn for their accommodation needs.
            </p>

      </div>
      <div className="flex justify-center gap-4 mb-10">
         <Link to="/register">
                <Button variant="secondary">Sign Up</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary">Sign In</Button>
                </Link>

      </div>
      </div>

      <div className="bg-gray-200 px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <img src={logo} alt="HopIn logo" className="w-36 h-auto rounded-md shadow-sm object-cover" />
            <p className="text-sm text-gray-900">
              Your trusted partner for exceptional hotel experiences worldwide.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <a
                href="#twitter"
                aria-label="HopIn on X (Twitter)"
                className="p-2 rounded-full bg-gray-700 hover:bg-blue-500 transition-transform transform hover:scale-105"
              >
                <FaXTwitter size={16} color="white" />
              </a>
              <a
                href="#facebook"
                aria-label="HopIn on Facebook"
                className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition-transform transform hover:scale-105"
              >
                <FiFacebook size={16} color="white" />
              </a>
              <a
                href="#instagram"
                aria-label="HopIn on Instagram"
                className="p-2 rounded-full bg-gray-700 hover:bg-pink-500 transition-transform transform hover:scale-105"
              >
                <FaInstagram size={16} color="white" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-gray-950">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-900">
              <li>
                <a href="#about" className="hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-white transition">Destinations</a>
              </li>
              <li>
                <a href="#offers" className="hover:text-white transition">Special Offers</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">Contact</a>
              </li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold mb-3 text-gray-950">Support</h3>
            <ul className="space-y-2 text-sm text-gray-900">
              <li>
                <a href="#help" className="hover:text-white transition">Help Center</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition">Terms of Service</a>
              </li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold mb-3 text-gray-950">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-900">
              <li>Email: <a href="mailto:support@hopin.com" className="hover:text-white">support@hopin.com</a></li>
              <li>Phone: <a href="tel:+277373365" className="hover:text-white">+27 7373 365</a></li>
              <li className="text-xs text-gray-400 mt-2">Mon–Fri: 9am – 5pm (SAST)</li>
            </ul>
          </div>
        </div>
        <hr className="text-gray-900 mt-10 mb-5" />
        <div className="text-center text-gray-900 py-4 text-sm"> © {year} HopIn. All rights reserved.</div>
      </div>

      
      
    </footer>
  )
}
