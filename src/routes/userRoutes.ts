// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

// Definisikan route untuk GET /api/users/me
router.get('/me', protect, getUserProfile);

export default router;
