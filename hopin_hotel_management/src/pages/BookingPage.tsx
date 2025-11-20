import logo from '../assets/logo.jpg';
import room from '../assets/hotel1.jpg';
import { FaRegUser } from "react-icons/fa";
import { Button } from '../components/Button';
import { FaArrowLeft } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import { MdPayment } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import { FaWifi } from "react-icons/fa6";
import { FaPlateWheat } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const BookingPage = () => {
    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <div className='flex justify-between items-center p-4 bg-white shadow-sm'>
                <img src={logo} alt="logo" className='h-10' />
                <span className='flex'>
                    <FaRegUser className='text-2xl text-[#0088FF]' />MM

                </span>
                
            </div>

            {/* Navigation */}
            <Link to='/' className='p-4 flex items-center gap-4'> 
                
                <FaArrowLeft className='text-blue-600 cursor-pointer' />
                <Button variant='primary'>Home</Button>
               
            </Link>

            {/* Main Content */}
            <div className='grid grid-cols-3 gap-6 p-6 max-w-7xl mx-auto'>
                {/* Booking Form */}
                <div className='col-span-2'>
                    <h1 className='text-3xl font-bold mb-2'>Complete Your Booking</h1>
                    <p className='text-gray-600 mb-6'>Fill in your details to reserve your stay</p>
                    
                    <form className='space-y-6'>
                        {/* Dates */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='flex items-center gap-2 font-medium mb-2'><CiCalendar /> Check-in Date</label>
                                <input type="text" placeholder='Select a date' className='w-full border rounded px-3 py-2' />
                            </div>
                            <div>
                                <label className='flex items-center gap-2 font-medium mb-2'><CiCalendar /> Check-out Date</label>
                                <input type="text" placeholder='Select a date' className='w-full border rounded px-3 py-2' />
                            </div>
                        </div>

                        {/* Guests & Rooms */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block font-medium mb-2'>Number of Guests</label>
                                <input
                                    type="number"
                                    defaultValue={1}
                                    placeholder="Enter number of guests"
                                    title="Number of Guests"
                                    className='w-full border rounded px-3 py-2'
                                />
                            </div>
                            <div>
                                <label htmlFor="number-of-rooms" className='block font-medium mb-2'>Number of Rooms</label>
                                <select
                                    id="number-of-rooms"
                                    className='w-full border rounded px-3 py-2'
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                        </div>

                        {/* Guest Info */}
                        <div className='space-y-4'>
                            <h2 className='text-xl font-bold'>Guest Information</h2>
                            <div>
                                <label className='block font-medium mb-2'>Full Name</label>
                                <input type="text" placeholder='John Ndaba' className='w-full border rounded px-3 py-2' />
                            </div>
                            <div>
                                <label className='block font-medium mb-2'>Email</label>
                                <input type="email" placeholder='john.ndaba@example.com' className='w-full border rounded px-3 py-2' />
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className='space-y-4'>
                            <h2 className='flex items-center gap-2 text-xl font-bold'><MdPayment /> Payment Information</h2>
                            <div>
                                <label className='block font-medium mb-2'>Cardholder Name</label>
                                <input type="text" placeholder='John Ndaba' className='w-full border rounded px-3 py-2' />
                            </div>
                            <div>
                                <label className='block font-medium mb-2'>Card Number</label>
                                <input type="text" placeholder='1234 5678 9012 3456' className='w-full border rounded px-3 py-2' />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block font-medium mb-2'>Expiry Date</label>
                                    <input type="text" placeholder='MM/YY' className='w-full border rounded px-3 py-2' />
                                </div>
                                <div>
                                    <label className='block font-medium mb-2'>CVV</label>
                                    <input type="text" placeholder='123' className='w-full border rounded px-3 py-2' />
                                </div>
                            </div>
                        </div>

                        <div className='bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800'>
                            <span className='font-semibold'>Secure Payment: </span>Your payment information is encrypted and secure
                        </div>

                        <Button variant='primary' className='w-full'>Pay Now</Button>
                    </form>
                </div>

                {/* Booking Summary */}
                <div className='bg-white rounded-lg shadow p-6 h-fit'>
                    <h2 className='text-xl font-bold mb-4'>Booking Summary</h2>
                    <img src={room} alt="Room" className='w-full rounded mb-4' />
                    <h3 className='text-lg font-semibold mb-2'>Deluxe Room</h3>
                    <p className='flex items-center gap-2 text-gray-600 mb-2'><MdLocationOn /> Standard Accommodation</p>
                    <p className='text-sm text-gray-500 mb-4'>5,678 reviews</p>
                    <div className='flex gap-4 mb-4 text-xl text-gray-600'>
                        <FaWifi />
                        <FaPlateWheat />
                    </div>
                    <p className='text-2xl font-bold'><span className='text-[#0088FF]'>R580</span>/night</p>
                </div>
            </div>
        </div>
    )
}
