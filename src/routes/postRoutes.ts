// src/routes/postRoutes.ts
import { Router } from 'express';
import { createPost, getPostById, getPosts, updatePost, deletePost } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.route('/').post(protect, createPost).get(getPosts);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);

export default router;
