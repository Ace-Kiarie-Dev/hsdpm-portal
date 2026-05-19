import { Router } from 'express';
import { verifyFirebaseToken, attachUserProfile } from '../middleware/auth.js';
import { validateRegister } from '../middleware/validate.js';
import { register, getMe, updateProfile } from '../controllers/authController.js';

const router = Router();

// POST /api/auth/register  or  POST /api/users/register
// Firebase token required to prevent anonymous spam registrations
router.post('/register', verifyFirebaseToken, validateRegister, register);

// GET /api/users/me
router.get('/me', verifyFirebaseToken, attachUserProfile, getMe);

// PUT /api/users/me
router.put('/me', verifyFirebaseToken, attachUserProfile, updateProfile);

export default router;
