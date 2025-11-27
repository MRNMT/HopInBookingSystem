import { Router } from 'express';
import { createReview, getReviewsByAccommodation } from '../../controllers/review.controller';

const reviewRouter = Router();

reviewRouter.post('/', createReview);
reviewRouter.get('/:accommodationId', getReviewsByAccommodation);

export default reviewRouter;