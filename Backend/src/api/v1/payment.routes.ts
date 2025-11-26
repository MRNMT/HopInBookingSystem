import { Router } from 'express';
import * as paymentController from '../../controllers/payment.controller';
// import { authenticate, authorize } from '../../middleware/auth.middleware';

const paymentRouter = Router();

// Webhook (must be before body parser if using raw body, but here we use standard json)
paymentRouter.post('/webhook', paymentController.handleWebhook);

// Protected routes (Commented out auth for now as user auth is not fully set up in context)
// paymentRouter.use(authenticate);

paymentRouter.post('/create-intent', paymentController.createPaymentIntent);
paymentRouter.post('/confirm', paymentController.confirmPayment);
paymentRouter.get('/status/:paymentIntentId', paymentController.getPaymentStatus);
paymentRouter.post('/refund', paymentController.createRefund);
paymentRouter.get('/my-payments', paymentController.getMyPayments);
paymentRouter.get('/:id', paymentController.getPaymentById);

// Admin routes
// paymentRouter.get('/admin/all', authorize(['admin', 'superadmin']), paymentController.getAllPaymentsAdmin);

export default paymentRouter;
