// src/controllers/userController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.ts'; // Impor tipe AuthRequest kita

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
