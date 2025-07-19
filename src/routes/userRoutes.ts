// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

// Definisikan route untuk GET /api/users/me
router
  .route('/me')
  .get(protect, getUserProfile) // <-- Endpoint GET yang sudah ada
  .put(protect, updateUserProfile); // <-- Endpoint PUT yang baru

export default router;
