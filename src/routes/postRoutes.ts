// src/routes/postRoutes.ts
import { Router } from 'express';
import { createPost, getPostById, getPosts, updatePost, deletePost, likePost, unlikePost, addComment } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.route('/').post(protect, createPost).get(getPosts);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);
router.route('/:id/like').post(protect, likePost).delete(protect, unlikePost);
router.route('/:id/comments').post(protect, addComment);

export default router;
