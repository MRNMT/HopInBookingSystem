import { Request, Response, NextFunction } from 'express';
import { CreateBookingDto } from '../../common/types/types';
import { BookingService } from '../services/booking.service';
import { AppError } from '../middleware/error.handler';

const bookingService = new BookingService();

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'User must be authenticated to create a booking.'));
    }
    const userId = req.user.id;
    const bookingData: CreateBookingDto = req.body;

    const result = await bookingService.createBooking(userId, bookingData);

    res.status(201).json({ 
      message: 'Booking initiated successfully. Proceed to payment.', 
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const cancelMyBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'User must be authenticated.'));
    }
    const userId = req.user.id;
    const bookingId = req.params.id;

    await bookingService.cancelBooking(userId, bookingId);

    res.status(200).json({ 
      message: `Booking ${bookingId} has been successfully cancelled.`
    });
  } catch (error) {
    next(error);
  }
};

export const paymentWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentIntentId = req.body.data?.object?.id || 'mock-payment-id';

    await bookingService.handlePaymentSuccess(paymentIntentId);
    
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({ received: false, error: "Processing failed" });
  }
};
