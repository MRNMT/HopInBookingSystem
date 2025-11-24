import { Button } from "../components/Button";
import { CiLocationOn } from "react-icons/ci";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import hotel from '../assets/hotel3.jpg';
import { useState } from "react";

export const FindPage = () => {
    const [filters, setFilters] = useState({
        city: "",
        hotel: "",
        checkIn: "",
        checkOut: "",
        guests: "2",
        rooms: "1",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        console.log("Searching with filters:", filters);
        // Add search logic
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Button variant="primary" className="flex gap-2 m-5">
                <FaArrowLeft className="mt-1" />Back
            </Button>

            {/* SEARCH BAR */}
            <div className="w-full flex justify-center -mt-10 px-4 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-6xl">
                    {/* Location */}
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-semibold text-sm mb-2">City</label>
                        <div className="flex items-center gap-2 border-b pb-2">
                            <CiLocationOn className="text-xl text-gray-500" />
                            <select name="city" value={filters.city} onChange={handleFilterChange} className="outline-none flex-1 bg-transparent" aria-label="Location">
                                <option value="">Select city</option>
                                <option value="polokwane">Polokwane</option>
                                <option value="capetown">Cape Town</option>
                                <option value="pretoria">Pretoria</option>
                                <option value="johannesburg">Johannesburg</option>
                                <option value="mbombela">Mbombela</option>
                            </select>
                        </div>
                    </div>

                    {/* Check-in */}
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-semibold text-sm mb-2">Check-in</label>
                        <input type="date" name="checkIn" value={filters.checkIn} onChange={handleFilterChange} className="outline-none border-b pb-2" />
                    </div>

                    {/* Check-out */}
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-semibold text-sm mb-2">Check-out</label>
                        <input type="date" name="checkOut" value={filters.checkOut} onChange={handleFilterChange} className="outline-none border-b pb-2" />
                    </div>

                    {/* Guests */}
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-semibold text-sm mb-2">Guests</label>
                        <select name="guests" value={filters.guests} onChange={handleFilterChange} className="outline-none bg-transparent border-b pb-2" aria-label="Guests">
                            <option value="1">1 guest</option>
                            <option value="2">2 guests</option>
                            <option value="3">3 guests</option>
                            <option value="4">4 guests</option>
                            <option value="5">5 guests</option>
                            <option value="6">6+ guests</option>
                        </select>
                    </div>

                    {/* Rooms */}
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-semibold text-sm mb-2">Rooms</label>
                        <select name="rooms" value={filters.rooms} onChange={handleFilterChange} className="outline-none bg-transparent border-b pb-2" aria-label="Rooms">
                            <option value="1">1 room</option>
                            <option value="2">2 rooms</option>
                            <option value="3">3 rooms</option>
                            <option value="4">4 rooms</option>
                        </select>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                        <Button variant="primary" onClick={handleSearch} className="w-full">Search</Button>
                    </div>
                </div>
            </div>

            {/* RESULTS */}
            <div className="w-full flex justify-center px-4">
                <div className="w-full max-w-6xl">
                    <h2 className="text-2xl font-bold mb-6">1-1 of 1 Results</h2>

                    {/* HOTEL CARD */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                        <img src={hotel} alt="HopIn Hotel Clarens" className="w-full md:w-1/3 h-48 object-cover" />
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">HopIn Hotel Clarens</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <FaStar className="text-yellow-400" />
                                    <span className="font-semibold">4.5</span>
                                    <span className="text-gray-600">(5,678 reviews)</span>
                                </div>
                                <p className="text-gray-600 mb-4">Home is where the art is</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-green-600 font-semibold">Available</span>
                                <Button variant="primary">Book Now</Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button variant="secondary">View on Map</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
