import { Router } from 'express';
import { registerController, loginController, logoutController, googleAuth } from '../../controllers/auth.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../../../common/validation/schemas';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validateRequest(registerSchema), register);

// POST /api/v1/auth/login
router.post('/login', validateRequest(loginSchema), login);

// POST /api/v1/auth/logout
router.post('/logout', logout);

// GET /api/v1/auth/google
router.get('/google', googleAuth);

export default router;
