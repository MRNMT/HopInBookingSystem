import React from 'react';
import { FaCheckCircle, FaCalendar, FaUser, FaMapMarkerAlt, FaDoorOpen } from 'react-icons/fa';
import { Button } from './Button';

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    accommodationName: string;
    roomTypeName: string;
    checkIn: string;
    checkOut: string;
    numberOfGuests: number;
    numberOfRooms: number;
    totalPrice: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    paymentId: string;
  };
}

export const BookingConfirmationDialog: React.FC<BookingConfirmationDialogProps> = ({
  isOpen,
  onClose,
  bookingDetails,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateNights = () => {
    const start = new Date(bookingDetails.checkIn);
    const end = new Date(bookingDetails.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-center mb-4">
            <FaCheckCircle className="text-6xl" />
          </div>
          <h2 className="text-3xl font-bold text-center">Booking Confirmed!</h2>
          <p className="text-center text-green-100 mt-2">Your reservation has been successfully processed</p>
        </div>

        {/* Booking Details */}
        <div className="p-6 space-y-6">
          {/* Accommodation Info */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Accommodation Details</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-500 mt-1" />
                <div>
                  <p className="font-semibold text-lg">{bookingDetails.accommodationName}</p>
                  <p className="text-gray-600">{bookingDetails.roomTypeName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Stay Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FaCalendar className="text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-semibold">{formatDate(bookingDetails.checkIn)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCalendar className="text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-semibold">{formatDate(bookingDetails.checkOut)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaUser className="text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-semibold">{bookingDetails.numberOfGuests} Guest{bookingDetails.numberOfGuests > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaDoorOpen className="text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Rooms</p>
                  <p className="font-semibold">{bookingDetails.numberOfRooms} Room{bookingDetails.numberOfRooms > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total nights: <span className="font-semibold">{calculateNights()}</span></p>
            </div>
          </div>

          {/* Guest Information */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Guest Information</h3>
            <div className="space-y-2">
              <p><span className="text-gray-600">Name:</span> <span className="font-semibold">{bookingDetails.guestName}</span></p>
              <p><span className="text-gray-600">Email:</span> <span className="font-semibold">{bookingDetails.guestEmail}</span></p>
              <p><span className="text-gray-600">Phone:</span> <span className="font-semibold">{bookingDetails.guestPhone}</span></p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Amount Paid</span>
              <span className="text-2xl font-bold text-green-600">R {bookingDetails.totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500">Payment ID: {bookingDetails.paymentId}</p>
          </div>

          {/* Confirmation Message */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Confirmation email sent!</strong> A confirmation email has been sent to <strong>{bookingDetails.guestEmail}</strong> with all the booking details.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => window.location.href = '/find'}>
            Book Another Stay
          </Button>
          <Button variant="primary" onClick={onClose}>
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
};
