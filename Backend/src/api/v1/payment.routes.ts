import { Router } from 'express';
import {
    getMyPayments,
    getPaymentById,
    createRefund,
    getAllPaymentsAdmin,
    createPaymentIntent,
    confirmPayment
} from '../../controllers/payment.controller';
import { isAuthenticated, isAdminOrSuperAdmin } from '../../middleware/auth.middleware';

const paymentRouter = Router();
paymentRouter.use(isAuthenticated);
paymentRouter.post('/create-intent', createPaymentIntent);
paymentRouter.post('/confirm', confirmPayment);
paymentRouter.get('/my-history', getMyPayments);
paymentRouter.get('/:id', getPaymentById);
paymentRouter.post('/refund', isAdminOrSuperAdmin, createRefund);
paymentRouter.get('/admin/all', isAdminOrSuperAdmin, getAllPaymentsAdmin);

export default paymentRouter;