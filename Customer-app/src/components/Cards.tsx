import { IoIosPricetag } from "react-icons/io";
import { FiShield } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";

export const Cards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <IoIosPricetag className="text-4xl text-blue-600 mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Best Price Guarantee</h1>
        <p className="text-gray-600">Find the best rates or we'll match the price and give you an extra discount.</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <FiShield className="text-4xl text-blue-600 mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Secure Booking</h1>
        <p className="text-gray-600">Your data is protected with industry leading security standards.</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <FaRegClock className="text-4xl text-blue-600 mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h1>
        <p className="text-gray-600">Our dedicated team is always ready to assist you with any questions.</p>
      </div>
    </div>
  );
};
