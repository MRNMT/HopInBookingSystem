import { Router } from 'express';
import {
  getMyPayments,
  getPaymentById,
  getAllPaymentsAdmin,
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  createRefund,
  handleWebhook
} from '../../controllers/payment.controller';
import { isAuthenticated, isAdminOrSuperAdmin } from '../../middleware/auth.middleware';

const paymentRoutes = Router();

// Webhook route (must be before other middleware)
paymentRoutes.post('/webhook', handleWebhook);

// Authenticated routes
paymentRoutes.use(isAuthenticated);

// User payment routes
paymentRoutes.post('/create-intent', createPaymentIntent); // Create payment intent
paymentRoutes.post('/confirm', confirmPayment); // Confirm payment
paymentRoutes.get('/status/:paymentIntentId', getPaymentStatus); // Get payment status
paymentRoutes.get('/my-history', getMyPayments); // User payment history
paymentRoutes.get('/:id', getPaymentById); // Get payment by ID

// Admin routes
paymentRoutes.get('/admin/all', isAdminOrSuperAdmin, getAllPaymentsAdmin); // All payments
paymentRoutes.post('/refund', isAdminOrSuperAdmin, createRefund); // Create refund

export default paymentRoutes;