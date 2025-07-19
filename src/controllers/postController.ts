// src/controllers/postController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import Post from '../models/Post';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: AuthRequest, res: Response) => {
  const { description, images } = req.body;

  if (!description || !images || images.length === 0) {
    return res.status(400).json({ message: 'Deskripsi dan gambar tidak boleh kosong' });
  }

  try {
    const post = new Post({
      description,
      images,
      user: req.user?._id,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
