import { Request, Response, NextFunction } from 'express';
import { CreateBookingDto } from '../../../common/types/types';
import { BookingService } from '../services/booking.service';
import { AppError } from '../middleware/error.handler';

const bookingService = new BookingService();

/**
 * Handles the creation of a new booking.
 * - Requires authentication (isAuthenticated middleware sets req.user)
 * - Delegates validation, price calculation, and payment intent creation to the Service.
 */
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get user ID from the authentication token
    if (!req.user?.id) {
      return next(new AppError(401, 'User must be authenticated to create a booking.'));
    }
    const userId = req.user.id;
    const bookingData: CreateBookingDto = req.body;

    // 2. Call the Service layer to handle logic (availability, price, Stripe/payment gateway)
    const result = await bookingService.createBooking(userId, bookingData);
    
    // 3. Send successful response with the payment secret
    res.status(201).json({ 
      message: 'Booking initiated successfully. Proceed to payment.', 
      data: result
    });
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
};

/**
 * Handles the cancellation of an existing booking by the customer.
 */
export const cancelMyBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'User must be authenticated.'));
    }
    const userId = req.user.id;
    const bookingId = req.params.id;

    // Call the Service layer to handle cancellation logic and refund processing
    await bookingService.cancelBooking(userId, bookingId);
    
    res.status(200).json({ 
      message: `Booking ${bookingId} has been successfully cancelled.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the incoming webhook from the payment gateway (e.g., Stripe).
 * This confirms the payment succeeded and updates the booking status.
 * Note: This must handle raw request body for signature verification (advanced topic).
 */
export const paymentWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real application, you would verify the webhook signature here.
    // For now, we mock success validation based on the request body.
    const paymentIntentId = req.body.data?.object?.id || 'mock-payment-id';

    // Call the Service layer to update the booking status
    await bookingService.handlePaymentSuccess(paymentIntentId);
    
    // Webhooks must return a 200 status code immediately to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    // Webhook errors are generally logged server-side, but we send a 500
    // so the payment gateway may retry the webhook later.
    console.error("Webhook processing failed:", error);
    res.status(500).json({ received: false, error: "Processing failed" });
  }
};