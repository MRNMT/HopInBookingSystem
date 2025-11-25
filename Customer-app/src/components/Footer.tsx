import React, { useState } from "react"
import { Button } from "./Button"
import logo from "../assets/logo2.png"
import { FaXTwitter } from "react-icons/fa6"
import { FiFacebook } from "react-icons/fi"
import { FaInstagram } from "react-icons/fa6"
import { Link } from "react-router-dom"

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()
  const [status] = useState<null | "idle" | "error" | "success">(null)


  return (
    <footer className="w-full text-gray-100">
      <div className="bg-[#0088FF]">
        <div className="max-w-7xl mx-auto text-center py-12 px-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Ready to start your journey?</h2>
          <p className="mt-2 text-sm md:text-base text-blue-100/90 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who trust HopIn for their accommodation needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link to="/register">
              <Button variant="secondary">Sign Up</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
          </div>

          <div className="mt-4">
            {status === "success" && (
              <p role="status" className="text-sm text-green-700">
                Subscription successful!
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="text-sm text-red-700">
                Please enter a valid email address.
              </p>
            )}
          </div>
         
        </div>
      </div>

      <div className="bg-gray-200 px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <img
              src={logo}
              alt="HopIn logo"
              className="w-36 h-auto rounded-md shadow-sm object-cover"
            />
            <p className="text-sm text-gray-900">
              Your trusted partner for exceptional hotel experiences worldwide.
            </p>

            <nav aria-label="HopIn social links" className="flex items-center gap-3 mt-2">
              <a
                href="https://twitter.com/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HopIn on X (Twitter)"
                className="p-2 rounded-full bg-gray-700 hover:bg-blue-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaXTwitter size={16} color="white" />
              </a>
              <a
                href="https://facebook.com/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HopIn on Facebook"
                className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              >
                <FiFacebook size={16} color="white" />
              </a>
              <a
                href="https://instagram.com/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HopIn on Instagram"
                className="p-2 rounded-full bg-gray-700 hover:bg-pink-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <FaInstagram size={16} color="white" />
              </a>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-gray-950">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-900">
              <li>
                <Link to="/about" className="hover:text-gray-700 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-gray-700 transition">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-gray-700 transition">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-700 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-gray-950">Support</h3>
            <ul className="space-y-2 text-sm text-gray-900">
              <li>
                <Link to="/help" className="hover:text-gray-700 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gray-700 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gray-700 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-gray-950">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-900">
              <li>
                Email:{" "}
                <a href="mailto:support@hopin.com" className="hover:text-gray-700">
                  support@hopin.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+277373365" className="hover:text-gray-700">
                  +27 7373 365
                </a>
              </li>
              <li className="text-xs text-gray-400 mt-2">Mon–Fri: 9am – 5pm (SAST)</li>
            </ul>
          </div>
        </div>

        <hr className="text-gray-900 mt-10 mb-5" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-900 py-4 text-sm">
          <div className="flex items-center gap-4">
            <span>© {year} HopIn. All rights reserved.</span>
            <Link to="/cookie" className="text-sm hover:underline">
              Cookie Settings
            </Link>
          </div>

          <div className="text-sm text-gray-600">
            Built with care • <a href="/status" className="hover:underline">System status</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
