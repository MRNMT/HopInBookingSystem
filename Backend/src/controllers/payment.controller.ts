import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { BookingService } from '../services/booking.service';
import { AppError } from '../middleware/error.handler';

const paymentService = new PaymentService();
const bookingService = new BookingService();

export const getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const payments = await paymentService.getMyPayments(req.user.id);

    res.status(200).json({
      message: 'Payment history retrieved',
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const paymentId = req.params.id;
    const isAdmin = ['admin', 'superadmin'].includes(req.user?.role || '');

    const payment = await paymentService.getById(paymentId, req.user.id, isAdmin);

    res.status(200).json({
      message: 'Payment details retrieved',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

export const createRefund = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const isAdmin = ['admin', 'superadmin'].includes(req.user?.role || '');
    const { paymentId } = req.body;

    if (!paymentId) {
      return next(new AppError(400, 'Payment ID is required.'));
    }

    await paymentService.refundPayment(paymentId, req.user.id, isAdmin);

    res.status(200).json({ message: 'Refund processed successfully' });
  } catch (error) {
    next(error);
  }
};

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const { bookingData } = req.body;

    if (!bookingData) {
      return next(new AppError(400, 'Booking data is required.'));
    }

    // Map frontend camelCase to backend snake_case
    const createBookingDto = {
      room_type_id: bookingData.roomTypeId,
      check_in_date: bookingData.checkIn,
      check_out_date: bookingData.checkOut,
      num_rooms: bookingData.numberOfRooms,
      num_guests: bookingData.numberOfGuests,
      guest_name: bookingData.guestName,
      guest_email: bookingData.guestEmail,
      guest_phone: bookingData.guestPhone,
      special_requests: bookingData.specialRequests
    };

    // Create booking first (which generates the payment intent)
    const result = await bookingService.createBooking(req.user.id, createBookingDto);

    res.status(200).json({
      success: true,
      data: {
        clientSecret: result.clientSecret,
        bookingId: result.bookingId,
        paymentIntentId: result.clientSecret.split('_secret_')[0] // Extract PI ID if needed
      }
    });
  } catch (error) {
    console.error('❌ Payment Intent Creation Error:', error);
    next(error);
  }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return next(new AppError(400, 'Payment Intent ID is required.'));
    }

    await paymentService.confirmPayment(paymentIntentId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPaymentsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string; // Optional filter (e.g. ?status=succeeded)
    const payments = await paymentService.getAllAdmin(status);

    res.status(200).json({
      message: 'All system payments retrieved',
      data: payments
    });
  } catch (error) {
    next(error);
  }
};