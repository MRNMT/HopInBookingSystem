import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getMyBookings,
  getMyFavorites,
  addFavorite,
  removeFavorite
} from '../../controllers/user.controller';
import { isAuthenticated } from '../../middleware/auth.middleware';

const userRouter = Router();

// All user routes require authentication
userRouter.use(isAuthenticated);

userRouter.get('/profile', getUserProfile); //get logged in user details
userRouter.put('/profile', updateUserProfile); //update user profilr details
userRouter.get('/bookings', getMyBookings); //view user booking history
userRouter.get('/favorites', getMyFavorites); //view my favorite accomodations
userRouter.post('/favorites', addFavorite); // add a favorite accomodation
userRouter.delete('/favorites/:id', removeFavorite); //remove an accomodation from favorites

export default userRouter;