import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../middleware/error.handler'
import { UpdateProfileDto } from '../../../common/types/types';

const userService = new UserService();


export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    
    const profile = await userService.getProfile(req.user.id);
    
    // 3. Send response
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
    console.error("Error in fetching all Users", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params.id)
        const user = await userService.getById(id);
        res.status(200).json(user)
    }catch(error){
        console.log("Getting user error:", error)
        res.status(404).json({message: "User not Found"})
    }
    const updateData: UpdateProfileDto = req.body;

const updated = await userService.updateProfile(req.user.id, updateData);
export const updateUser = async (req: Request, res: Response) => {

    const id = parseInt(req.params.id)
    const data: Partial<User> = req.body

    try{
        
        const updatedUser  = await userService.update(id, data);

        if(!updateUser){
            res.status(404).json({message: "User not found"})
        }

        return res.status(200).json({updatedUser})
    }catch(error){
        console.log("Error in updating", error)
    }
}

export const createUser = async (req: Request, res: Response) => {
    
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      data: updated 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all bookings (past and upcoming) for the authenticated user.
 * GET /api/v1/user/bookings
 */
export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    try{
        const createdUser  = userService.create(data)
        res.status(201).json(data)
    }catch(error){
        console.log("Error in adding a user", error)
        return res.status(400).json({message: "Bad Request"})
    }
    
    // 1. Delegate to Service (SELECT statement with joins to get hotel info)
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
 * GET /api/v1/user/favorites
 */
export const getMyFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    
    // 1. Delegate to Service (SELECT statement joining users, favorites, and accommodations)
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
 * POST /api/v1/user/favorites
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
    
    // 1. Delegate to Service (INSERT statement into user_favorites)
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
 * DELETE /api/v1/user/favorites/:id
 */
export const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    const accommodationId = req.params.id; // Corresponds to ':id' in the route definition
    
    // 1. Delegate to Service (DELETE statement from user_favorites)
    await userService.removeFavorite(req.user.id, accommodationId);
    
    // 2. 204 No Content is the standard response for a successful DELETE
    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};