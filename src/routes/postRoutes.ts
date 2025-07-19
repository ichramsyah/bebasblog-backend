// src/routes/postRoutes.ts
import { Router } from 'express';
import { createPost, getPostById, getPosts, updatePost, deletePost, likePost, unlikePost, addComment, getCommentsForPost } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware.ts';
import upload from '../middleware/uploadMiddleware';

const router = Router();

router.route('/').get(getPosts).post(protect, upload.array('images', 5), createPost);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);
router.route('/:id/like').post(protect, likePost).delete(protect, unlikePost);
router.route('/:id/comments').post(protect, addComment).get(getCommentsForPost);

export default router;
