// src/controllers/userController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.ts'; // Impor tipe AuthRequest kita
import User from '../models/User';

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
  // Dapatkan user dari database untuk memastikan kita punya data terbaru
  const user = await User.findById(req.user?._id);

  if (user) {
    // Cek apakah username baru sudah digunakan oleh orang lain
    if (req.body.username) {
      const userExists = await User.findOne({ username: req.body.username });
      // Jika user ada DAN id-nya BEDA dengan user yang sedang login
      if (userExists && userExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }
      user.username = req.body.username;
    }

    // Update field lain jika ada di request body
    user.bio = req.body.bio || user.bio;

    // Simpan perubahan ke database
    const updatedUser = await user.save();

    // Kirim kembali data user yang sudah diupdate
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email, // email tidak diubah di sini
      bio: updatedUser.bio,
      profile_picture_url: updatedUser.profile_picture_url,
    });
  } else {
    res.status(404).json({ message: 'User tidak ditemukan' });
  }
};
