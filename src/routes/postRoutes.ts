// src/routes/postRoutes.ts
import { Router } from 'express';
import { createPost } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.route('/').post(protect, createPost);

export default router;
