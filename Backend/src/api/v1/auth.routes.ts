import {Router} from 'express'
import { 
  registerController, 
  loginController, 
  getMeController 
} from '../../controllers/auth.controller';

const authRouter = Router();
postgresql://postgres:[HopInHotel@111]@db.oaigsalnihaycaenspwx.supabase.co:5432/postgres
postgresql://postgres:HopInHotel@111@db.oaigsalnihaycaenspwx.supabase.co:5432/postgres

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new customer
 * @access  Public
 */
authRouter.post('/register', registerController);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
authRouter.post('/login', loginController);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current logged-in user's profile
 * @access  Private (Requires Auth Token)
 */
authRouter.get('/me', getMeController);

export default authRouter;