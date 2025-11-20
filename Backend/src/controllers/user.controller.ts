import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AppError } from '../middleware/error.handler';
import { UpdateProfileDto } from '../../common/types/types';

// Instantiate the service to handle business logic
const userService = new UserService();

/**
 * Retrieves the profile data for the currently authenticated user.
 * Route: GET /api/v1/users/profile
 * Access: Private (Logged in user)
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check if user is authenticated
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    
    // 2. fetch user data from database using the ID from the token
    const profile = await userService.getProfile(req.user.id);
    
    // 3. Send Success Response
    res.status(200).json({ 
      message: 'User profile retrieved successfully', 
      data: profile 
    });
  } catch (error) {
    next(error); //to the errorHandler
  }
};

/**
 * Updates the profile data for the currently authenticated user.
 * Route: PUT /api/v1/users/profile
 * Access: Private (Logged in user)
 */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    // 1. Extract validated data from request body (typed with DTO)
    const updateData: UpdateProfileDto = req.body;

    // 2. Call Service: Perform the update in the database
    const updated = await userService.updateProfile(req.user.id, updateData);
    
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      data: updated 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific user by ID (Typically an Admin function).
 * Route: GET /api/v1/users/:id
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // FIX: Your database uses UUIDs (strings), NOT integers. 
        // Do not use parseInt() here.
        const id = req.params.id; 
        
        const user = await userService.getById(id); // Assumes you added getById to UserService

        if (!user) {
            return next(new AppError(404, 'User not found'));
        }

        res.status(200).json({
            message: 'User details retrieved',
            data: user
        });
    } catch(error) {
        next(error);
    }
};

/**
 * Retrieves all bookings (past and upcoming) for the authenticated user.
 * Route: GET /api/v1/users/bookings
 * Access: Private
 */
export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    
    // 1. Call Service: Get bookings linked to this user ID
    const bookings = await userService.getMyBookings(req.user.id);
    
    res.status(200).json({ 
      message: 'User bookings retrieved', 
      data: bookings 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all favorited accommodations for the authenticated user.
 * Route: GET /api/v1/users/favorites
 * Access: Private
 */
export const getMyFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    
    // 1. Call Service: Get accommodations from the user_favorites join table
    const favorites = await userService.getMyFavorites(req.user.id);
    
    res.status(200).json({ 
      message: 'Favorite accommodations retrieved', 
      data: favorites 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Adds an accommodation to the user's favorites list.
 * Route: POST /api/v1/users/favorites
 * Access: Private
 */
export const addFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    
    const { accommodationId } = req.body;

    if (!accommodationId) {
        return next(new AppError(400, 'Accommodation ID is required.'));
    }
    
    // 1. Call Service: Insert into user_favorites table
    await userService.addFavorite(req.user.id, accommodationId);
    
    res.status(201).json({ 
      message: 'Accommodation added to favorites successfully' 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Removes an accommodation from the user's favorites list.
 * Route: DELETE /api/v1/users/favorites/:id
 * Access: Private
 */
export const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    
    // The ID in the URL is the accommodation ID to remove
    const accommodationId = req.params.id; 
    
    // 1. Call Service: Delete from user_favorites table
    await userService.removeFavorite(req.user.id, accommodationId);
    
    // 204 No Content is standard for successful deletions
    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};