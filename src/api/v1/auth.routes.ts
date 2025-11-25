import { Router } from 'express';
import { 
  registerController, 
  loginController, 
  logoutController, 
  googleAuth,
  getMeController
} from '../../controllers/auth.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { isAuthenticated } from '../../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../../common/validation/schemas'

const authRouter = Router();


authRouter.post('/register', validateRequest(registerSchema), registerController);
authRouter.post('/login', validateRequest(loginSchema), loginController);
authRouter.post('/logout', logoutController);
authRouter.get('/google', googleAuth);
authRouter.get('/me', isAuthenticated, getMeController);

export default authRouter;