import { Button } from "./Button"
import logo from '../assets/logo.jpg'
import { FaXTwitter } from "react-icons/fa6";
import { FiFacebook } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";




export const Footer = () => {
  return (
    <footer >
      <div className="bg-blue-400">
        <h1>Ready To Start Your Journey</h1>
        <p>Jon thousands of satisfied travelers whop trust hopIn for their accomodation needs</p>
        <div>
          <Button variant="primary">Sign Up</Button>
          <Button variant="primary">Sign In</Button>

        </div>
      </div>
      <div className="bg-blue-200">
        <div>
          <img src={logo} alt="" />
          <p>Your trusted partner for exceptional hotel experiences worldwide.</p>
          <div>
            <FaXTwitter />
            <FiFacebook/>
            <FaInstagram />



          </div>
        </div>
        <div>
          <h1>Quick Links</h1>
          {/* Will Change list to links soon */}
          <ul>
            <li>About Us</li>
            <li>Destinations</li>
            <li>Special Offers</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h1>Support</h1>
          <ul>
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
        <div>
          <h1>Contact</h1>
          <ul>
            <li>Email: support@hopin.com</li>
            <li>Phone: +27 7373 365</li>
            
          </ul>

        </div>
      </div>
      <div>@2025 HopIn. All rights reserved</div>
    </footer>
  )
}
