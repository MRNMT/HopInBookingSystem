import { SideBar } from "../components/SideBar";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { adminService, type Booking, type UpdateBookingDto } from "../services/admin.service";

export const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getBookings();
      console.log('Fetched bookings:', data);
      setBookings(data);
    } catch (error: any) {
      console.error("Failed to fetch bookings", error);
      setError(error.response?.data?.message || "Failed to fetch bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBooking = async (bookingId: string, updates: UpdateBookingDto) => {
    try {
      await adminService.updateBooking(bookingId, updates);
      // Refresh bookings list
      await fetchBookings();
      alert('Booking updated successfully!');
    } catch (error: any) {
      console.error("Failed to update booking", error);
      alert(error.response?.data?.message || "Failed to update booking. Please try again.");
    }
  };

  const handleApproveBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to approve this booking?')) {
      handleUpdateBooking(bookingId, { status: 'confirmed' });
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      handleUpdateBooking(bookingId, { status: 'cancelled' });
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.accommodation?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600 text-sm">Manage all hotel bookings.</p>
          </div>

          {/* Refresh Button */}
          <Button variant="primary" onClick={fetchBookings}>Refresh</Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search bookings by guest name, booking ID, or accommodation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-6 py-3">Booking ID</th>
                <th className="px-6 py-3">Guest Name</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Accommodation</th>
                <th className="px-6 py-3">Check-in</th>
                <th className="px-6 py-3">Check-out</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-3">Loading bookings...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    {searchTerm ? 'No bookings match your search.' : 'No bookings found.'}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{booking.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4">{booking.user?.full_name || 'Guest'}</td>
                    <td className="px-6 py-4">{booking.accommodation?.city || 'N/A'}</td>
                    <td className="px-6 py-4">{booking.accommodation?.name || 'Room'}</td>
                    <td className="px-6 py-4">{new Date(booking.check_in_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(booking.check_out_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">R{booking.total_price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveBooking(booking.id)}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
