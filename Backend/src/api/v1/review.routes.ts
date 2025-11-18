import { Router } from 'express';
import { createReview } from '../../controllers/review.controller';

const reviewRouter = Router();

/**
 * @route   POST /api/v1/reviews
 * @desc    Submit a review for a completed stay
 * @access  Private (Customer)
 * @note    Requires a completed booking for the specific accommodation
 */
reviewRouter.post('/', createReview);

export default reviewRouter;