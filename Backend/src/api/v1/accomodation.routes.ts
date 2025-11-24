import { Router } from 'express';
import * as accommodationController from '../../controllers/accomodation.cotroller'

const accomRouter = Router();

/**
 * @route   GET /api/v1/accommodations
 * @desc    Search accommodations with filters (city, price, star_rating, etc.)
 * @access  Public
 */
accomRouter.get('/', accommodationController.getAllAccommodations);
accomRouter.post('/', accommodationController.createAccommodation);
accomRouter .put('/:id', accommodationController.updateAccommodation);
accomRouter.get('/city/:city', accommodationController.getAccommodationByCity);
accomRouter.get('/:id', accommodationController.getAccommodationById);
accomRouter.delete('/:id', accommodationController.deleteAccommodation);



/**
 * @route   GET /api/v1/accommodations/:id
 * @desc    Get full details of a specific accommodation (including rooms & reviews)
 * @access  Public
 */


export default accomRouter;