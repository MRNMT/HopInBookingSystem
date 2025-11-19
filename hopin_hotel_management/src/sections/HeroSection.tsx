import hotelBackground from "../assets/hotel_bg.jpg";
import { Button } from "../components/Button";
import { CiLocationOn, CiCalendar } from "react-icons/ci";
import { FiUser } from "react-icons/fi";

export const HeroSection = () => {
  return (
    <>
      {/* HERO SECTION */}
      <div
        className="h-screen w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${hotelBackground})` }}
      >
        <div className="max-w-xl px-10 md:px-20">
          <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
            Find Your Perfect Stay
          </h1>

          <p className="text-white text-lg md:text-xl mt-4 opacity-90">
            Discover luxury hotels and resorts at the best prices
          </p>

          <div className="flex gap-4 mt-8">
            <Button variant="primary">Explore Hotels</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="w-full flex justify-center -mt-10 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center w-full max-w-4xl">

          {/* Location */}
          <div className="flex flex-col w-full">
            <h3 className="text-gray-600 font-semibold">Location</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-2">
              <CiLocationOn className="text-xl" />
              <span>Where are you going?</span>
            </div>
          </div>

          {/* Check-in */}
          <div className="flex flex-col w-full">
            <h3 className="text-gray-600 font-semibold">Check-in</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-2">
              <CiCalendar className="text-xl" />
              <span>mm/dd/yyyy</span>
            </div>
          </div>

          {/* Check-out */}
          <div className="flex flex-col w-full">
            <h3 className="text-gray-600 font-semibold">Check-out</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-2">
              <CiCalendar className="text-xl" />
              <span>mm/dd/yyyy</span>
            </div>
          </div>

          {/* Guests */}
          <div className="flex flex-col w-full">
            <h3 className="text-gray-600 font-semibold">Guests</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-2">
              <FiUser className="text-xl" />
              <span>2 guests, 1 room</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BUTTON BELOW BOX */}
      <div className="w-full flex justify-center mt-4 px-4">
        <button className="bg-[#0088FF] hover:bg-[#006FCC] text-white py-3 px-8 rounded-lg w-full max-w-4xl font-medium">
          Search Now
        </button>
      </div>
    </>
  );
};
