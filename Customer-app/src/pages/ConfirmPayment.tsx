import { TiTick } from "react-icons/ti";
import { MdFileDownload, MdEmail } from "react-icons/md";

export const ConfirmPayment = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <TiTick className="text-green-600 text-4xl" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
        <p className="text-gray-600 mt-1">Your booking has been confirmed</p>

        {/* Confirmation Number */}
        <p className="mt-3 text-gray-700">Confirmation Number</p>
        <p className="text-blue-500 font-semibold text-lg">12HOP56789</p>

        <hr className="my-6" />

        {/* Booking Details */}
        <div className="space-y-3 text-left">

          <div className="flex justify-between">
            <h3 className="font-medium">Hotel</h3>
            <span>HopIn Hotel</span>
          </div>

          <div className="flex justify-between">
            <h3 className="font-medium">Location</h3>
            <span>Polokwane</span>
          </div>

          <div className="flex justify-between">
            <h3 className="font-medium">Check-in</h3>
            <span>Nov 27, 2025</span>
          </div>

          <div className="flex justify-between">
            <h3 className="font-medium">Check-out</h3>
            <span>Nov 29, 2025</span>
          </div>

          <div className="flex justify-between">
            <h3 className="font-medium">Guests</h3>
            <span>2 Adults</span>
          </div>

          <div className="flex justify-between">
            <h3 className="font-medium">Rooms</h3>
            <span>2</span>
          </div>
        </div>

        <hr className="my-6" />

        {/* Total Paid */}
        <div className="flex justify-between text-lg font-semibold">
          <h3>Total Paid:</h3>
          <span>R2400</span>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">

          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            <MdFileDownload className="text-xl" />
            Download Receipt
          </button>

          <button className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition">
            <MdEmail className="text-xl" />
            Email Receipt
          </button>

        </div>
      </div>
    </div>
  );
};
