import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { AppError } from '../middleware/error.handler';
import { CreateReviewDto } from '../common/types/types';

const reviewService = new ReviewService();

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required to submit a review.'));
    }
    const userId = req.user.id;
    const reviewData: CreateReviewDto = req.body;
    await reviewService.create(userId, reviewData);

    res.status(201).json({
      message: 'Review submitted successfully. It is now pending moderation.'
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByAccommodation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accommodationId } = req.params;
    const reviews = await reviewService.getByAccommodation(accommodationId);
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
