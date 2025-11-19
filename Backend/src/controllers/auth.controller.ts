import { Request, Response } from 'express';
import passport from 'passport';
import { ApiResponse, User } from '../../../common/types/types';
import { AuthService } from '../services/auth.service'; // <-- Must import the Chef!
import { AppError } from '../middleware/error.handler'; // <-- Used for clean error handling

const authService = new AuthService(); // Instantiate the Service

/**
 * Handles user registration. Delegates all logic to AuthService.
 */
export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;
    
    // 1. Call the Service (This is the only line that matters)
    const { user, token } = await authService.register({ email, password, fullName });

    const response: ApiResponse<any> = {
      message: 'User registered successfully',
      data: { user, token }
    };
    res.status(201).json(response);
  } catch (error: any) {
    // The Global Error Handler handles AppError codes
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
// ... (other functions like loginController follow the same pattern)