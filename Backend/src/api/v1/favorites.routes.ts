import { Router } from 'express';
import { addFavorite, removeFavorite, getFavorites, checkFavorite } from '../../controllers/favorites.controller';
import { isAuthenticated } from '../../middleware/auth.middleware';

const favoritesRouter = Router();

// All routes require authentication
favoritesRouter.use(isAuthenticated);

favoritesRouter.post('/', addFavorite);
favoritesRouter.delete('/:accommodationId', removeFavorite);
favoritesRouter.get('/', getFavorites);
favoritesRouter.get('/check/:accommodationId', checkFavorite);

export default favoritesRouter;
