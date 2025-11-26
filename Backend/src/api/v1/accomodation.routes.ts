import { Router } from 'express';
import * as accommodationController from '../../controllers/accomodation.cotroller';
import { searchAccommodations, getRoomTypes } from '../../controllers/accommodations.controller';

const accomRouter = Router();

accomRouter.get('/', accommodationController.getAllAccommodations);
accomRouter.get('/search', searchAccommodations);
accomRouter.post('/', accommodationController.createAccommodation);
accomRouter.put('/:id', accommodationController.updateAccommodation);
accomRouter.get('/city/:city', accommodationController.getAccommodationByCity);
accomRouter.get('/:id', accommodationController.getAccommodationById);
accomRouter.get('/:id/room-types', getRoomTypes);
accomRouter.delete('/:id', accommodationController.deleteAccommodation);


export default accomRouter;