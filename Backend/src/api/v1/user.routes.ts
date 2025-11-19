import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getMyBookings,
  getMyFavorites,
  addFavorite,
  removeFavorite
} from '../../controllers/user.controller';

const userRouter = Router();

// --- Profile Management ---
/**
 * @route   GET /api/v1/user/profile
 * @desc    Get full details of the logged-in user
 * @access  Private
 */
userRouter.get('/profile', getUserProfile);

/**
 * @route   PUT /api/v1/user/profile
 * @desc    Update user profile details
 * @access  Private
 */
userRouter.put('/profile', updateUserProfile);

// --- My Data ---
/**
 * @route   GET /api/v1/user/bookings
 * @desc    Get a list of the user's own bookings
 * @access  Private
 */
userRouter.get('/bookings', getMyBookings);

// --- Favorites ---
/**
 * @route   GET /api/v1/user/favorites
 * @desc    Get user's favorite accommodations
 * @access  Private
 */
userRouter.get('/favorites', getMyFavorites);

/**
 * @route   POST /api/v1/user/favorites
 * @desc    Add an accommodation to favorites
 * @access  Private
 */
userRouter.post('/favorites', addFavorite);

/**
 * @route   DELETE /api/v1/user/favorites/:id
 * @desc    Remove an accommodation from favorites
 * @access  Private
 */
userRouter.delete('/favorites/:id', removeFavorite);

export default userRouter;