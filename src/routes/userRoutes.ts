// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUserProfile, updateUserProfile, updateUserPassword, getPostsByUsername, getUserPublicProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware.ts';
import upload from '../middleware/uploadMiddleware';

const router = Router();

router.route('/me').get(protect, getUserProfile).put(protect, upload.single('profile_picture'), updateUserProfile);

router.put('/me/password', protect, updateUserPassword);
router.get('/:username/posts', getPostsByUsername);
router.get('/:username', getUserPublicProfile);

export default router;
