import { Router } from 'express';
import { verifyFirebaseToken, attachUserProfile } from '../middleware/auth.js';
import { getMe, updateProfile } from '../controllers/authController.js';

const router = Router();

// GET /api/users/me
router.get('/me', verifyFirebaseToken, attachUserProfile, getMe);

// PUT /api/users/me
router.put('/me', verifyFirebaseToken, attachUserProfile, updateProfile);

export default router;
