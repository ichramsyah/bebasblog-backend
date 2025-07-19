// src/controllers/postController.ts
import { Response, Request } from 'express';
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

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req: Request, res: Response) => {
  try {
    // Ambil semua post, urutkan berdasarkan yang terbaru (-1)
    // .populate() akan mengambil data dari model 'User' berdasarkan 'user' field
    const posts = await Post.find({}).populate('user', 'username profile_picture_url').sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
