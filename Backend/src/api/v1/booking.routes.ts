import { Router } from 'express';
import { 
  createBooking, 
  cancelMyBooking,
  paymentWebhook
} from '../../controllers/booking.controller';

const bookingRouter = Router();

/**
 * @route   POST /api/v1/bookings
 * @desc    Create a pending booking & initiate payment intent
 * @access  Private (Customer)
 */
bookingRouter.post('/', createBooking);

/**
 * @route   POST /api/v1/bookings/:id/cancel
 * @desc    Cancel an existing booking
 * @access  Private (Customer)
 */
bookingRouter.post('/:id/cancel', cancelMyBooking);

/**
 * @route   POST /api/v1/bookings/webhook/payment-success
 * @desc    Webhook for Payment Gateway (e.g. Stripe) to confirm payment
 * @access  Public (Secured by Signature)
 */
bookingRouter.post('/webhook/payment-success', paymentWebhook);

export default bookingRouter;