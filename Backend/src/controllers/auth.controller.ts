import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ApiResponse } from '../../common/types/types';
import { AuthService } from '../services/auth.service';
import { AppError } from '../middleware/error.handler';

const authService = new AuthService();

/**
 * Register a new user
 */
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName } = req.body;
    const { user, token } = await authService.register({ email, password, fullName });

    const response: ApiResponse<any> = {
      message: 'User registered successfully',
      data: { user, token }
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Login existing user
 */
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });

    const response: ApiResponse<any> = {
      message: 'Login successful',
      data: { user, token }
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new AppError(401, 'Authentication failed');
    }
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ message: 'User profile retrieved', data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * (Mainly client-side for JWT, but endpoints can be used for cookies/logging)
 */
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a stateless JWT setup, the client simply discards the token.
    // You can add server-side blacklist logic here if needed.
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Initiate Google OAuth
 */
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

/**
 * Google OAuth Callback
 */
export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    // This redirects the browser back to the frontend application with the token
    // const token = ... (generate token from req.user)
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=mock-token`); 
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};