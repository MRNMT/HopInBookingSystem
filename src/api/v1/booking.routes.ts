import { Router } from 'express';
import { 
  createBooking, 
  cancelMyBooking,
  paymentWebhook
} from '../../controllers/booking.controller';

const bookingRouter = Router();

bookingRouter.post('/', createBooking);  //route to create a booking
bookingRouter.post('/:id/cancel', cancelMyBooking); //route to cancel a booking
bookingRouter.post('/webhook/payment-success', paymentWebhook);

export default bookingRouter;