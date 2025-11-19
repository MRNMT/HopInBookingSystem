import { Router } from 'express';
import { 
  getAllAccommodations, 
  getAccommodationById 
} from '../../controllers/accomodation.cotroller';

const accomRouter = Router();

/**
 * @route   GET /api/v1/accommodations
 * @desc    Search accommodations with filters (city, price, star_rating, etc.)
 * @access  Public
 */
accomRouter.get('/', getAllAccommodations);

/**
 * @route   GET /api/v1/accommodations/:id
 * @desc    Get full details of a specific accommodation (including rooms & reviews)
 * @access  Public
 */
accomRouter.get('/:id', getAccommodationById);

export default accomRouter;