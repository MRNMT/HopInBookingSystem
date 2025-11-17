import { FaArrowRight } from "react-icons/fa";
import hotel from '../assets/hotel_bg.jpeg'
import { FaLocationDot } from "react-icons/fa6";
import { FaWifi } from "react-icons/fa";
import { FaPlateWheat } from "react-icons/fa6";
import { Button } from "../components/Button";

const hotels = [
    { name: "Grand Luxury Hotel", location: "New York, USA", reviews: "5 678" },
    { name: "Ocean View Resort", location: "Miami, USA", reviews: "5 678" },
    { name: "Metropolitian Suites", location: "Los Angeles, USA", reviews: "5 678" }
];

export const FeaturedHotels = () => {
    return (
        <section className="py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl font-bold text-gray-900">Featured Hotels</h1>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
                        View All <FaArrowRight />
                    </button>
                </div>
                
                <p className="text-gray-600 text-lg mb-12">Hand-picked luxury accommodations for you</p>

                {/* Hotel Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {hotels.map((hotel_item) => (
                        <div key={hotel_item.name} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src={hotel} alt={hotel_item.name} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{hotel_item.name}</h2>
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <FaLocationDot color="#ef4444" />
                                    <span>{hotel_item.location}</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4">⭐ {hotel_item.reviews} reviews</p>
                                <div className="flex gap-3 mb-4 text-xl text-gray-700">
                                    <div className="hover:text-blue-600 cursor-pointer"><FaWifi /></div>
                                    <div className="hover:text-amber-600 cursor-pointer"><FaPlateWheat /></div>
                                </div>
                                <hr className="mb-4" />
                                <Button variant="primary" className="w-full">Book Now</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
