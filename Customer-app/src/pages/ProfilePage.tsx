import React, { useState, useEffect } from 'react';
import { FaUser, FaHistory, FaHeart, FaCalendarAlt, FaSignOutAlt, FaStar, FaMapMarkerAlt, FaArrowLeft, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { users } from '../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store/store';
import { logout } from '../store/authSlice';
import hotel from '../assets/hotel1.jpg';
import { LogoutConfirmationDialog } from '../components/LogoutConfirmationDialog';
import { ReviewModal } from '../components/ReviewModal';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'favorites'>('profile');
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await users.getMyBookings();
      console.log('📦 Bookings response:', response);
      if (response.success && response.data) {
        setBookings(response.data);
      } else if (response.data) {
        setBookings(response.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching favorites...');
      const response = await users.getMyFavorites();
      console.log('📦 Favorites API Response:', response);
      console.log('✅ Response has data:', !!response.data);
      console.log('📊 Data type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
      console.log('📏 Data length:', response.data?.length);
      
      // Handle the response based on backend structure
      if (response.data && Array.isArray(response.data)) {
        console.log('✅ Setting favorites:', response.data);
        setFavorites(response.data);
      } else if (response.success === false) {
        console.log('⚠️ API returned success=false');
        setFavorites([]);
      } else {
        console.log('⚠️ Unexpected response structure');
        setFavorites([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching favorites:', error);
      console.error('Error details:', error.message);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await users.updateProfile(formData);
      if (response.success) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile');
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    window.location.href = '/';
    setShowLogoutDialog(false);
  };

  const renderProfile = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full p-2 border rounded-lg focus:outline-none bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
            <label className="block text-gray-700 mb-2">New Password (leave blank to keep current)</label>
            <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="********"
            />
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Update Profile
        </button>
      </form>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      
      {loading ? (
        <div className="text-center py-8">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No bookings found.</div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Current & Upcoming
            </h3>
            {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length > 0 ? (
                bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').map(booking => (
                <div key={booking.id} className="border-b last:border-0 py-4">
                    <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-lg">{booking.accommodation_name || 'Accommodation Name'}</h4>
                        <p className="text-gray-600">{booking.room_type_name || 'Room Type'}</p>
                        <p className="text-sm text-gray-500">
                        {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Guests: {booking.num_guests} | Rooms: {booking.num_rooms}</p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {booking.status.toUpperCase()}
                        </span>
                        <p className="font-bold text-blue-600">R {booking.total_price}</p>
                    </div>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-500 italic">No upcoming bookings.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaHistory className="text-gray-500" /> Past Bookings
            </h3>
            {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length > 0 ? (
                bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map(booking => (
                <div key={booking.id} className="border-b last:border-0 py-4 opacity-75">
                    <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h4 className="font-bold text-lg">{booking.accommodation_name || 'Accommodation Name'}</h4>
                        <p className="text-gray-600">{booking.room_type_name || 'Room Type'}</p>
                        <p className="text-sm text-gray-500">
                        {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {booking.status.toUpperCase()}
                        </span>
                        <p className="font-bold text-gray-600">R {booking.total_price}</p>
                        {booking.status === 'completed' && (
                          <button
                            onClick={() => setSelectedBookingForReview(booking)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FaEdit className="text-xs" />
                            Write Review
                          </button>
                        )}
                    </div>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-500 italic">No past bookings.</p>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Favorites</h2>
      
      {loading ? (
        <div className="text-center py-8">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
            <FaHeart className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg">You haven't added any favorites yet.</p>
            <Link to="/find" className="text-blue-600 hover:underline mt-2 inline-block">
                Browse Accommodations
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((fav: any) => (
                <div key={fav.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 relative">
                        <img 
                            src={fav.images?.[0] || hotel} 
                            alt={fav.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = hotel;
                            }}
                        />
                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1">
                            <FaStar className="text-yellow-400" /> {fav.star_rating || 'N/A'}
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{fav.name}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                            <FaMapMarkerAlt /> {fav.city}, {fav.country}
                        </div>
                        <div className="flex justify-between items-center">
                             <Link to={`/booking?accommodation=${fav.id}`} className="text-blue-600 font-medium hover:underline">
                                View Details
                             </Link>
                             <button 
                                onClick={async () => {
                                    if(confirm('Remove from favorites?')) {
                                        await users.removeFavorite(fav.id);
                                        fetchFavorites();
                                    }
                                }}
                                className="text-red-500 hover:text-red-700 text-sm"
                             >
                                Remove
                             </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );

  if (!user) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
                  <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
                  <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                      Go to Login
                  </Link>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    <FaArrowLeft /> Back to Home
                </button>
            </Link>
            <Link to="/" className="text-xl font-bold text-blue-600">
                HopIn
            </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-blue-600 text-white text-center">
                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-blue-600 text-3xl">
                  <FaUser />
                </div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-blue-100 text-sm">{user.email}</p>
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
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
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

      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
      />

      {selectedBookingForReview && (
        <ReviewModal
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onSuccess={() => {
            fetchBookings();
            setSelectedBookingForReview(null);
          }}
          booking={{
            id: selectedBookingForReview.id,
            accommodation_id: selectedBookingForReview.accommodation_id,
            accommodation_name: selectedBookingForReview.accommodation_name || 'Accommodation',
            check_in_date: selectedBookingForReview.check_in_date,
            check_out_date: selectedBookingForReview.check_out_date,
          }}
        />
      )}
    </div>
  );
};

export { ProfilePage };
