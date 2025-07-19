// src/controllers/userController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.ts';
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
      email: updatedUser.email,
      bio: updatedUser.bio,
      profile_picture_url: updatedUser.profile_picture_url,
    });
  } else {
    res.status(404).json({ message: 'User tidak ditemukan' });
  }
};

// @desc    Update user password
// @route   PUT /api/users/me/password
// @access  Private
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
