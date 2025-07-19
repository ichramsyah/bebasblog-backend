// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUserProfile, updateUserProfile, updateUserPassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);

router.put('/me/password', protect, updateUserPassword);

export default router;
