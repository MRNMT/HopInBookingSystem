import hotelBackground from "../assets/hotel_bg.jpg";
import { Button } from "../components/Button";
import { CiLocationOn} from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import {MdHotel}  from "react-icons/md";
// import styles from '../App.css'
import { Link } from "react-router-dom";

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
            <Button variant="primary">View Rooms</Button>
            <Button variant="secondary">Learn More</Button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="w-full flex justify-center -mt-10 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center w-full max-w-4xl">

          {/* Location */}
          <div className="flex flex-col w-full">
            <h3 className="text-gray-600 font-semibold">City</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-2">
              <CiLocationOn className="text-xl" />
              <select aria-label="Location">
                <option value="">Polokwane</option>
                <option value="">Cape Town</option>
                <option value="">Pretoria</option>
                <option value="">Johannesburg</option>
                <option value="">Mbombela</option>
              </select>
              
            </div>
          </div>
           {/* Hotels */}
          <div className="flex flex-col w-full">
            <h3 className="text-gray-600 font-semibold">Hotels</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-2">
              <MdHotel className="text-xl" />
              <select  aria-label="Hotel" name="" id="">
              <option value="">Deluxe Room</option>
              <option value="">Premium Suite</option>
              <option value="">Standard Room</option>
              <option value="">Executive Suite</option>
              
              </select>
              
            </div>
          </div>
          
            {/* Check-in */}
            <div className="flex flex-col w-full">
              
            <h3 className="text-gray-600 font-semibold">Check-in</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-2" >
              <input type="date" className="outline-none w-full" placeholder="mm/dd/yyyy" />
             
              
            </div>
            </div>

            {/* Check-out */}
            <div className="flex flex-col w-full">
            <h3 className="text-gray-600 font-semibold">Check-out</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-2">  
            <input type="date" className="outline-none w-full" placeholder="mm/dd/yyyy"/>
            </div>
            </div>

          {/* Guests */}
          <div className="flex flex-col w-full">
            <h3 className="text-gray-600 font-semibold">Guests</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-1 border-b pb-2">
              <FiUser className="text-xl" />
              <div className="flex gap-3 w-full">
                <select
                  name="guests"
                  id="guests"
                  defaultValue="2"
                  className="outline-none w-1/2 bg-transparent"
                  aria-label="Guests"
                >
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5 guests</option>
                  <option value="6">6+ guests</option>
                </select>

                <select
                  name="rooms"
                  id="rooms"
                  defaultValue="1"
                  className="outline-none w-1/2 bg-transparent"
                  aria-label="Rooms"
                >
                  <option value="1">1 room</option>
                  <option value="2">2 rooms</option>
                  <option value="3">3 rooms</option>
                  <option value="4">4 rooms</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BUTTON BELOW BOX */}
      <Link to='/find'>
      <div className="w-full flex justify-center mt-4 px-4">
        <button className="bg-[#0088FF] hover:bg-[#006FCC] text-white py-3 px-8 rounded-lg w-full max-w-4xl font-medium">
          Find
        </button>
      </div>
      </Link>
    </>
  );
};
