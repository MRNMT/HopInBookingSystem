import { Router } from 'express';
import { 
  getMyPayments, 
  getPaymentById, 
  getAllPaymentsAdmin 
} from '../../controllers/payment.controller';
import { isAuthenticated, isAdminOrSuperAdmin } from '../../middleware/auth.middleware';

const paymentRoutes = Router();

paymentRoutes.use(isAuthenticated);

paymentRoutes.get('/my-history',getMyPayments)  //user
paymentRoutes.get('/:id',getPaymentById) //get user payment by id
paymentRoutes.get('/admin/all',isAdminOrSuperAdmin,getAllPaymentsAdmin); //addmin gets all user payments

export default paymentRoutes;