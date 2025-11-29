import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import accommodationRoutes from './accomodation.routes';
import bookingRoutes from './booking.routes';
import reviewRoutes from './review.routes';
import notificationRoutes from './notification.routes';
import paymentRoutes from './payment.routes';
import superAdminRoute from './superadmin.routes';
import favoritesRoutes from './favorites.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/accommodations', accommodationRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/superadmin', superAdminRoute);
router.use('/favorites', favoritesRoutes);

export default router;
