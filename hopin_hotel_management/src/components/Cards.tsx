import { IoIosPricetag } from "react-icons/io";
import { FiShield } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";


export const Cards = () => {
  return (
    <div>
    <div>
      <IoIosPricetag />
      <h1>Best Price Guarantee</h1>
      <p>Find the best rates or we'll match the price and give you an extra discount.</p>
    </div>
    <div>
      <FiShield />
      <h1>Secure Booking</h1>
      <p>Your data is protected with industrry leading security standards.</p>
    </div>
    <div>
      <FaRegClock />
      <h1>24/7 Support</h1>
      <p>Our dedicated team is always ready to assist you with any qustions.</p>
    </div>
   </div>
  )
}
