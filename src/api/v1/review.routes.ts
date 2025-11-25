import { Router } from 'express';
import { createReview } from '../../controllers/review.controller';

const reviewRouter = Router();

reviewRouter.post('/', createReview);

export default reviewRouter;