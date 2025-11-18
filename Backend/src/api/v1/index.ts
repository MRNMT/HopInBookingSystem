import { Router } from 'express';

import authRouter from './auth.routes';
import userRouter from './user.routes';
import accomRouter from './accom.routes';
import bookingRouter from './booking.routes';
import reviewRouter from './review.routes';
import notificationRouter from './notification.routes';
import adminRouter from './admin.routes';

const v1Router = Router();

// --- Mount Feature Routers ---

// Public Routes
v1Router.use('/auth', authRouter);            // /api/v1/auth
v1Router.use('/accommodations', accomRouter); // /api/v1/accommodations

// Authenticated Routes
// (Middleware checks will be inside the controllers or added here later)
v1Router.use('/user', userRouter);            // /api/v1/user
v1Router.use('/bookings', bookingRouter);     // /api/v1/bookings
v1Router.use('/reviews', reviewRouter);       // /api/v1/reviews
v1Router.use('/notifications', notificationRouter); // /api/v1/notifications

// Admin Routes
v1Router.use('/admin', adminRouter);          // /api/v1/admin

export default v1Router;