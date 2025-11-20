import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { AppError } from '../middleware/error.handler';
import { CreateReviewDto } from '../../common/types/types';

const reviewService = new ReviewService();

/**
 * Handles the submission of a new review and rating for an accommodation.
 * * Delegates validation (user must have completed booking) and insertion to the Service layer.
 * All submitted reviews start as 'pending' for Admin approval.
 */
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Authentication check (relies on isAuthenticated middleware running before this)
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required to submit a review.'));
    }
    const userId = req.user.id;
    const reviewData: CreateReviewDto = req.body;

    // 2. Call Service to handle business logic (DB lookup, insertion)
    await reviewService.create(userId, reviewData);
    
    // 3. Send successful response
    res.status(201).json({ 
      message: 'Review submitted successfully. It is now pending moderation.' 
    });
  } catch (error) {
    // Pass any AppError (e.g., 400 Bad Request if booking not found) to the global handler
    next(error);
  }
};