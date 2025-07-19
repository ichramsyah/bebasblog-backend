// src/controllers/postController.ts
import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import Post from '../models/Post';
import mongoose from 'mongoose';
import Comment from '../models/Comment';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: AuthRequest, res: Response) => {
  const { description } = req.body;
  const files = req.files as Express.Multer.File[];

  if (!description || !files || files.length === 0) {
    return res.status(400).json({ message: 'Deskripsi dan gambar tidak boleh kosong' });
  }

  try {
    const imagesUrls = files.map((file) => file.path);

    const post = new Post({
      description,
      images: imagesUrls,
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

// @desc    Fetch a single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req: Request, res: Response) => {
  // Cek apakah ID yang diberikan valid formatnya
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Postingan tidak ditemukan (ID tidak valid)' });
  }

  try {
    const post = await Post.findById(req.params.id).populate('user', 'username profile_picture_url'); // Sertakan data user

    if (post) {
      res.json(post);
    } else {
      // Jika ID valid tapi post tidak ada
      res.status(404).json({ message: 'Postingan tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req: AuthRequest, res: Response) => {
  const { description } = req.body;
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ message: 'Postingan tidak ditemukan' });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Postingan tidak ditemukan' });
    }

    // Cek kepemilikan: pastikan ID user di token sama dengan ID user di post
    if (post.user.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: 'Aksi tidak diizinkan' });
    }

    // Update deskripsi
    post.description = description || post.description;
    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req: AuthRequest, res: Response) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ message: 'Postingan tidak ditemukan' });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Postingan tidak ditemukan' });
    }

    // Cek kepemilikan
    if (post.user.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: 'Aksi tidak diizinkan' });
    }

    await post.deleteOne(); // Gunakan deleteOne() untuk menghapus dokumen

    res.json({ message: 'Postingan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req: AuthRequest, res: Response) => {
  const postId = req.params.id;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Aksi tidak diizinkan' });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ message: 'Postingan tidak ditemukan' });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Postingan tidak ditemukan' });
    }

    const isLiked = post.likes.some((likeId) => likeId.equals(userId));

    if (isLiked) {
      return res.status(400).json({ message: 'Postingan sudah di-like' });
    }

    // Sekarang aman, karena userId sudah pasti bukan undefined
    post.likes.push(userId);
    await post.save();

    res.json({ message: 'Postingan berhasil di-like', likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// @desc    Unlike a post
// @route   DELETE /api/posts/:id/like
// @access  Private
export const unlikePost = async (req: AuthRequest, res: Response) => {
  const postId = req.params.id;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ message: 'Postingan tidak ditemukan' });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Postingan tidak ditemukan' });
    }

    // Cek apakah user memang sudah me-like postingan ini
    const isLiked = post.likes.some((likeId) => likeId.equals(userId));

    if (!isLiked) {
      return res.status(400).json({ message: 'Postingan belum di-like' });
    }

    // Hapus ID user dari array 'likes'
    post.likes = post.likes.filter((likeId) => !likeId.equals(userId));
    await post.save();

    res.json({ message: 'Like berhasil dihapus', likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  const postId = req.params.id;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Aksi tidak diizinkan' });
  }

  if (!content) {
    return res.status(400).json({ message: 'Komentar tidak boleh kosong' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Postingan tidak ditemukan' });
    }

    // 1. Buat dokumen comment baru
    const newComment = new Comment({
      content,
      post: postId,
      user: userId,
    });
    await newComment.save();

    // 2. Tambahkan ID comment ke array 'comments' di dokumen Post
    post.comments.push(newComment._id);
    await post.save();

    // Ambil kembali comment untuk di-populate sebelum dikirim sebagai response
    const populatedComment = await Comment.findById(newComment._id).populate('user', 'username profile_picture_url');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// @desc    Get all comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
export const getCommentsForPost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ message: 'Postingan tidak ditemukan' });
  }

  try {
    // Cari semua comment yang memiliki post ID yang sesuai
    const comments = await Comment.find({ post: postId })
      .populate('user', 'username profile_picture_url') // Sertakan data user yang berkomentar
      .sort({ createdAt: 'asc' }); // Urutkan dari yang paling lama

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
