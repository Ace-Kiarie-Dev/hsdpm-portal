import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { validateRegister } from '../middleware/validate.js';
import { register } from '../controllers/authController.js';

const router = Router();

// POST /api/auth/register
router.post('/register', verifyFirebaseToken, ...validateRegister, register);

export default router;
