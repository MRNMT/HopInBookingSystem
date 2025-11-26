import React, { useState, useEffect } from 'react';
import { FaUser, FaHistory, FaHeart, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

// import { Link } from 'react-router-dom';
import { getUserBookings, type Booking } from '../services/booking.service';
// import { getFavorites } from '../services/favorites.service'; // Assuming this exists

import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'favorites'>('profile');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useSelector((state: RootState) => state.auth);

  // Fallback if user is not loaded yet (though auth check should handle this)
  const displayUser = user || {
    name: 'Guest User',
    email: 'guest@example.com',
    phone: ''
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const renderProfile = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={displayUser.name || ''}
            readOnly
            className="w-full p-2 border rounded-lg focus:outline-none bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={displayUser.email || ''}
            readOnly
            className="w-full p-2 border rounded-lg focus:outline-none bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={displayUser.phone || ''}
            readOnly
            className="w-full p-2 border rounded-lg focus:outline-none bg-gray-100"
          />
        </div>
        {/* <Button type="submit" className="mt-4">Update Profile</Button> */}
        <p className="text-sm text-gray-500 mt-2">Profile updates are currently disabled.</p>
      </form>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Current & Upcoming
            </h3>
            {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').map(booking => (
              <div key={booking.id} className="border-b last:border-0 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{booking.accommodation_name}</h4>
                    <p className="text-gray-600">{booking.room_type_name}</p>
                    <p className="text-sm text-gray-500">
                      {booking.check_in_date} - {booking.check_out_date}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 mb-2">
                      {booking.status.toUpperCase()}
                    </span>
                    <p className="font-bold text-blue-600">R {booking.total_price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaHistory className="text-gray-500" /> Past Bookings
            </h3>
            {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map(booking => (
              <div key={booking.id} className="border-b last:border-0 py-4 opacity-75">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{booking.accommodation_name}</h4>
                    <p className="text-gray-600">{booking.room_type_name}</p>
                    <p className="text-sm text-gray-500">
                      {booking.check_in_date} - {booking.check_out_date}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                      booking.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                    <p className="font-bold text-gray-600">R {booking.total_price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Favorites</h2>
      <p className="text-gray-500">Your favorite accommodations will appear here.</p>
      {/* Map through favorites here */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-blue-600 text-white text-center">
                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-blue-600 text-3xl">
                  <FaUser />
                </div>
                <h3 className="font-bold text-lg">{displayUser.name}</h3>
                <p className="text-blue-100 text-sm">{displayUser.email}</p>
              </div>
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaUser /> Profile Details
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaCalendarAlt /> My Bookings
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'favorites' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaHeart /> Favorites
                </button>
                <hr className="my-2" />
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                  <FaSignOutAlt /> Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'favorites' && renderFavorites()}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfilePage };
