import logo from '../assets/logo.jpg';
import room from '../assets/hotel1.jpg';
import { FaRegUser, FaStar } from "react-icons/fa";
import { Button } from '../components/Button';
import { FaArrowLeft } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";

import { MdLocationOn } from "react-icons/md";
import { FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaDumbbell, FaSpa } from "react-icons/fa";
import { FaPlateWheat } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getAccommodationById } from '../services/accommodation.service';
import { getRoomTypes, type RoomType } from '../services/roomTypes.service';
import { PaymentModal } from '../components/PaymentModal';
import { reviews as reviewsApi } from '../utils/api';
import { getHotelImages } from '../services/unsplash.service';

export const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const accommodationId = searchParams.get('accommodation');

    const [accommodation, setAccommodation] = useState<any>(null);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [selectedRoomType, setSelectedRoomType] = useState<string>('');
    const [reviews, setReviews] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [numberOfRooms, setNumberOfRooms] = useState(1);
    
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!accommodationId) return;
            try {
                const accData = await getAccommodationById(accommodationId);
                setAccommodation(accData);
                
                // Fetch images if not present
                if (accData.images && accData.images.length > 0) {
                    setImages(accData.images);
                } else {
                    const unsplashImages = await getHotelImages(accData.city, accData.country);
                    setImages(unsplashImages.length > 0 ? unsplashImages : [room]);
                }

                const roomsData = await getRoomTypes(accommodationId);
                setRoomTypes(roomsData);
                if (roomsData.length > 0) {
                    setSelectedRoomType(roomsData[0].id);
                }

                const reviewsData = await reviewsApi.getForAccommodation(accommodationId);
                if (reviewsData.success) {
                    setReviews(reviewsData.data);
                }
            } catch (error) {
                console.error('Error fetching booking data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [accommodationId]);

    const selectedRoom = roomTypes.find(r => r.id === selectedRoomType);

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays > 0 ? diffDays : 0;
    };

    const nights = calculateNights();
    const total = selectedRoom ? selectedRoom.price_per_night * nights * numberOfRooms : 0;

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!checkIn) newErrors.checkIn = 'Check-in date is required';
        if (!checkOut) newErrors.checkOut = 'Check-out date is required';
        if (nights === 0) newErrors.dates = 'Check-out must be after check-in';
        if (!guestName.trim()) newErrors.guestName = 'Full name is required';
        if (!guestEmail.trim()) newErrors.guestEmail = 'Email is required';
        if (!guestPhone.trim()) newErrors.guestPhone = 'Phone number is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (guestEmail && !emailRegex.test(guestEmail)) {
            newErrors.guestEmail = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = (paymentIntent: any) => {
        setIsPaymentModalOpen(false);
        alert(`Booking confirmed! Payment ID: ${paymentIntent.id}`);
        window.location.href = '/profile';
    };

    const isFormValid = () => {
        return checkIn && checkOut && nights > 0 &&
               guestName.trim() && guestEmail.trim() && guestPhone.trim();
    };

    const getFacilityIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('wifi')) return <FaWifi />;
        if (lower.includes('parking')) return <FaParking />;
        if (lower.includes('pool')) return <FaSwimmingPool />;
        if (lower.includes('restaurant') || lower.includes('food')) return <FaUtensils />;
        if (lower.includes('gym') || lower.includes('fitness')) return <FaDumbbell />;
        if (lower.includes('spa')) return <FaSpa />;
        return <FaPlateWheat />;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!accommodation) {
        return <div className="min-h-screen flex items-center justify-center">Accommodation not found</div>;
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='flex justify-between items-center p-4 bg-white shadow-sm'>
                <img src={logo} alt="logo" className='h-10' />
                <span className='flex'>
                    <FaRegUser className='text-2xl text-[#0088FF]' />
                </span>
            </div>

            <Link to='/find' className='p-4 flex items-center gap-4'> 
                <FaArrowLeft className='text-blue-600 cursor-pointer' />
                <Button variant='primary'>Back to Search</Button>
            </Link>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto'>
                <div className='lg:col-span-2 space-y-8'>
                    {/* Header & Images */}
                    <div>
                        <h1 className='text-3xl font-bold mb-2'>{accommodation.name}</h1>
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <MdLocationOn className="text-blue-500" />
                            <span>{accommodation.address}, {accommodation.city}, {accommodation.country}</span>
                            <div className="flex items-center ml-4">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span>{accommodation.average_rating} ({accommodation.total_reviews} reviews)</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 h-96 rounded-xl overflow-hidden">
                            <img src={images[0]} alt="Main" className="w-full h-full object-cover col-span-2 md:col-span-1" />
                            <div className="hidden md:grid grid-cols-2 gap-2">
                                {images.slice(1, 5).map((img, idx) => (
                                    <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">About this place</h2>
                        <p className="text-gray-700 leading-relaxed">{accommodation.description}</p>
                    </div>

                    {/* Facilities */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Facilities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {accommodation.facilities && accommodation.facilities.length > 0 ? (
                                accommodation.facilities.map((fac: any) => (
                                    <div key={fac.id} className="flex items-center gap-3 text-gray-700">
                                        <span className="text-blue-500 text-xl">{getFacilityIcon(fac.name)}</span>
                                        <span>{fac.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No facilities listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Policies */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Policies</h2>
                        <div className="space-y-2 text-gray-700">
                            {accommodation.policies ? (
                                Object.entries(accommodation.policies).map(([key, value]: [string, any]) => (
                                    <div key={key} className="flex justify-between border-b py-2 last:border-0">
                                        <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                        <span>{String(value)}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No specific policies listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Guest Reviews</h2>
                        {reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review: any) => (
                                    <div key={review.id} className="border-b pb-4 last:border-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="font-semibold">{review.user_name || 'Guest'}</div>
                                            <div className="flex items-center gap-1">
                                                <FaStar className="text-yellow-400" />
                                                <span>{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No reviews yet.</p>
                        )}
                    </div>

                    {/* Booking Form (Mobile/Tablet moved here or kept in sidebar) */}
                </div>

                {/* Sidebar Booking Form */}
                <div className='lg:col-span-1'>
                    <div className='bg-white rounded-lg shadow-lg p-6 sticky top-4 border border-gray-100'>
                        <h2 className='text-xl font-bold mb-4'>Book your stay</h2>
                        <p className='text-gray-600 mb-6'>Fill in your details to reserve your stay.</p>
                        
                        <form className='space-y-6' onSubmit={handleSubmit}>
                            <div>
                                <label className='block font-medium mb-2'>Select Room Type</label>
                                <select
                                    value={selectedRoomType}
                                    onChange={(e) => setSelectedRoomType(e.target.value)}
                                    className='w-full border rounded px-3 py-2'
                                >
                                    {roomTypes.map((roomType) => (
                                        <option key={roomType.id} value={roomType.id}>
                                            {roomType.type_name} - R{roomType.price_per_night}/night
                                        </option>
                                    ))}
                                </select>
                                {selectedRoom && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p>Capacity: {selectedRoom.capacity} guests</p>
                                        <p>{selectedRoom.description}</p>
                                    </div>
                                )}
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium mb-1'>Check-in</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className='w-full border rounded px-3 py-2 text-sm'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium mb-1'>Check-out</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || new Date().toISOString().split('T')[0]}
                                        className='w-full border rounded px-3 py-2 text-sm'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium mb-1'>Guests</label>
                                    <input
                                        type="number"
                                        value={numberOfGuests}
                                        onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                                        min={1}
                                        max={selectedRoom ? selectedRoom.capacity * numberOfRooms : 10}
                                        className='w-full border rounded px-3 py-2'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium mb-1'>Rooms</label>
                                    <select
                                        value={numberOfRooms}
                                        onChange={(e) => setNumberOfRooms(parseInt(e.target.value))}
                                        className='w-full border rounded px-3 py-2'
                                    >
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='space-y-4 pt-4 border-t'>
                                <h3 className='font-semibold'>Guest Details</h3>
                                <input 
                                    type="text" 
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    placeholder='Full Name' 
                                    className={`w-full border rounded px-3 py-2 ${errors.guestName ? 'border-red-500' : ''}`}
                                />
                                <input 
                                    type="email" 
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    placeholder='Email' 
                                    className={`w-full border rounded px-3 py-2 ${errors.guestEmail ? 'border-red-500' : ''}`}
                                />
                                <input 
                                    type="tel" 
                                    value={guestPhone}
                                    onChange={(e) => setGuestPhone(e.target.value)}
                                    placeholder='Phone' 
                                    className={`w-full border rounded px-3 py-2 ${errors.guestPhone ? 'border-red-500' : ''}`}
                                />
                            </div>

                            <div className='border-t pt-4 space-y-2'>
                                <div className='flex justify-between font-bold text-lg'>
                                    <span>Total:</span>
                                    <span className='text-[#0088FF]'>R{total.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 text-right">Includes taxes and fees</p>
                            </div>

                            <Button 
                                variant='primary' 
                                className='w-full'
                                type='submit'
                                disabled={!isFormValid()}
                            >
                                {isFormValid() ? 'Proceed to Payment' : 'Fill all details'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={total}
                bookingData={{
                    accommodationId: accommodationId!,
                    roomTypeId: selectedRoomType,
                    checkIn,
                    checkOut,
                    numberOfRooms,
                    numberOfGuests,
                    guestName,
                    guestEmail,
                    guestPhone
                }}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};
