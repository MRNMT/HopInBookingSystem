import {Router} from 'express';
import { isAuthenticated,isAdminOrSuperAdmin } from '../../middleware/auth.middleware';



const adminRouter = Router();

adminRouter.use(isAuthenticated, isAdminOrSuperAdmin);
