import {Router} from 'express';
import { isAuthenticated,isAdminOrSuperAdmin } from '../../middleware/auth.middleware';
import {
  getDashboardStats,
  getAllUsers,
  createAccomodation,
  updateAccomodation,
  deleteAccomodation,
  getAccomodations,
  getBookings,
  updateBookings,
  getAllPendingReviews,
  approveReview,
  deleteReview
} from '../../controllers/admin.controller';


const adminRouter = Router();

adminRouter.use(isAuthenticated, isAdminOrSuperAdmin);
adminRouter.use(isAuthenticated, isAdminOrSuperAdmin);

adminRouter.get('/dashboard/stats', getDashboardStats);
adminRouter.get('/users', getAllUsers);

adminRouter.get('/accommodations', getAccomodations);
adminRouter.post('/accommodations', createAccomodation);
adminRouter.put('/accommodations/:id', updateAccomodation);
adminRouter.delete('/accommodations/:id', deleteAccomodation);

adminRouter.get('/bookings', getBookings);
adminRouter.put('/bookings/:id', updateBookings);

adminRouter.get('/reviews/pending', getAllPendingReviews);
adminRouter.post('/reviews/:id/approve', approveReview);
adminRouter.delete('/reviews/:id', deleteReview);

export default adminRouter;