// src/controllers/userController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import User from '../models/User';
import Post from '../models/Post';
import mongoose from 'mongoose';

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  // Data user sudah dilampirkan ke req.user oleh middleware 'protect'
  const user = req.user;

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profile_picture_url: user.profile_picture_url,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404).json({ message: 'User tidak ditemukan' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Cek dan update username jika ada di body
    if (req.body.username && req.body.username !== user.username) {
      const userExists = await User.findOne({ username: req.body.username });
      if (userExists && userExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }
      user.username = req.body.username;
    }

    // Update bio jika ada di body, jika tidak, gunakan bio yang lama
    user.bio = req.body.bio || user.bio;

    // Update foto profil jika ada file yang diupload
    if (req.file) {
      user.profile_picture_url = req.file.path;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profile_picture_url: updatedUser.profile_picture_url,
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// @desc    Update user password
// @route   PUT /api/users/me/password
// @access  Private
export const updateUserPassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  // 1. Validasi input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Harap sediakan password saat ini dan password baru' });
  }

  // 2. Dapatkan user dari DB, pastikan untuk menyertakan field password
  const user = await User.findById(req.user?._id).select('+password');

  if (!user) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  // 3. Verifikasi password saat ini
  if (await user.matchPassword(currentPassword)) {
    // 4. Jika cocok, set password baru
    user.password = newPassword;
    // pre-save hook di model akan otomatis men-hash password baru ini
    await user.save();

    res.json({ message: 'Password berhasil diperbarui' });
  } else {
    // 5. Jika password saat ini tidak cocok
    res.status(401).json({ message: 'Password saat ini salah' });
  }
};

// @desc    Get all posts by a specific user
// @route   GET /api/users/:username/posts
// @access  Public
export const getPostsByUsername = async (req: Request, res: Response) => {
  try {
    // 1. Cari user berdasarkan username dari parameter URL
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // 2. Cari semua postingan dengan user ID yang cocok
    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// @desc    Get a user's public profile
// @route   GET /api/users/:username
// @access  Public
export const getUserPublicProfile = async (req: Request, res: Response) => {
  try {
    // 1. Cari user berdasarkan username
    const user = await User.findOne({ username: req.params.username }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // 2. Hitung jumlah postingan
    const postCount = await Post.countDocuments({ user: user._id });

    // 3. Hitung total like dari semua postingan pengguna menggunakan aggregation
    const likesAggregation = await Post.aggregate([
      // Tahap 1: Cocokkan semua post milik user
      { $match: { user: user._id } },
      // Tahap 2: Hitung jumlah elemen di array 'likes'
      { $project: { likeCount: { $size: '$likes' } } },
      // Tahap 3: Jumlahkan semua likeCount menjadi satu
      { $group: { _id: null, totalLikes: { $sum: '$likeCount' } } },
    ]);

    // Ambil hasil total like, jika tidak ada post maka hasilnya 0
    const totalLikes = likesAggregation.length > 0 ? likesAggregation[0].totalLikes : 0;

    // 4. Kirim response
    res.json({
      _id: user._id,
      username: user.username,
      bio: user.bio,
      profile_picture_url: user.profile_picture_url,
      createdAt: user.createdAt,
      postCount,
      totalLikes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
