import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Button } from "../components/Button";
import { FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import hotel1 from "../assets/hotel1.jpg";
import hotel2 from "../assets/hotel2.jpg";
import hotel3 from "../assets/hotel3.jpg";

const hotels = [
  { photo: hotel1, name: "Deluxe Room", location: "Standard Accommodation", reviews: "5 678" },
  { photo: hotel2, name: "Premium Suite", location: "Luxury Accomodation", reviews: "5 678" },
  { photo: hotel3, name: "Metropolitian Suites", location: "Luxury Accomodation", reviews: "5 678" }
];

export const FeaturedHotels = () => {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Hotels</h1>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
            View All <FaArrowRight />
          </button>
        </div>

        <p className="text-gray-600 mb-12">Hand-picked luxury accommodations for you</p>

        {/* HOTEL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {hotels.map((item) => (
            <div key={item.name} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">

              {/* IMAGE + BADGE + HEART */}
              <div className="relative">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />

                {/* featured badge */}
                <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-sm px-3 py-1 rounded-md font-medium">
                  featured
                </span>

                {/* Favorite Heart */}
                <button aria-label="Favorite" className="absolute top-3 right-3 bg-white rounded-full p-2 shadow font-bold">
                  <FaRegHeart className="text-gray-700 text-lg" />
                </button>
              </div>

              {/* CARD CONTENT */}
              <div className="p-6">

                {/* NAME */}
                <h2 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h2>

                {/* LOCATION */}
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaLocationDot className="text-blue-500" />
                  <span>{item.location}</span>
                </div>

                {/* REVIEWS */}
                <p className="text-gray-500 text-sm mb-4">{item.reviews} reviews</p>

                {/* PRICE SECTION */}
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">starting from</p>
                  <p className="text-lg font-semibold">
                    <span className="text-blue-600">R 580</span> / night
                  </p>
                </div>

                {/* BUTTON */}
                <Link to='/booking'>
                  <Button variant="primary">Book Now</Button>
                </Link>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
