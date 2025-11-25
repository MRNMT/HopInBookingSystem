import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.services';
import { AppError } from '../middleware/error.handler';
import { UpdateProfileDto } from '../common/types/types';

const userService = new UserService();

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const profile = await userService.getProfile(req.user.id);

    res.status(200).json({ 
      message: 'User profile retrieved successfully', 
      data: profile 
    });
  } catch (error) {
    next(error); 
  }
};


export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const updateData: UpdateProfileDto = req.body;

    const updated = await userService.updateProfile(req.user.id, updateData);
    
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      data: updated 
    });
  } catch (error) {
    next(error);
  }
};


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