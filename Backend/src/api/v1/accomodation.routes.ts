import { Router } from 'express';
import * as accommodationController from '../../controllers/accomodation.cotroller'

const accomRouter = Router();

accomRouter.get('/', accommodationController.getAllAccommodations);
accomRouter.post('/', accommodationController.createAccommodation);
accomRouter .put('/:id', accommodationController.updateAccommodation);
accomRouter.get('/city/:city', accommodationController.getAccommodationByCity);
accomRouter.get('/:id', accommodationController.getAccommodationById);
accomRouter.delete('/:id', accommodationController.deleteAccommodation);


export default accomRouter;