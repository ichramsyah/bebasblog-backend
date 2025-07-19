// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware.ts';

// Fungsi untuk menghasilkan token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d', // Token akan berlaku selama 30 hari
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // 1. Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Harap isi semua field' });
    }

    // 2. Cek apakah user sudah terdaftar (berdasarkan email atau username)
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Email atau Username sudah terdaftar' });
    }

    // 3. Buat user baru (password akan di-hash oleh pre-save hook di model)
    const user = new User({
      username,
      email,
      password,
    });
    await user.save();

    const createdUser = (await User.findById(user._id)) as typeof User.prototype & { _id: any };

    if (createdUser) {
      // 5. Kirim response berhasil beserta token
      res.status(201).json({
        _id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        token: generateToken(createdUser._id.toString()),
      });
    } else {
      throw new Error('Gagal membuat user.');
    }
  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Harap isi email dan password' });
    }

    // 2. Cari user berdasarkan email
    // Gunakan .select('+password') karena secara default password tidak disertakan
    const user = await User.findOne({ email }).select('+password');

    // 3. Cek apakah user ada DAN password cocok
    if (user && (await user.matchPassword(password))) {
      // 4. Kirim response berhasil beserta token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
};

export const googleAuthCallback = (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.redirect('http://localhost:3000/login/failed');
  }

  const token = generateToken(user._id.toString());

  res.redirect(`http://localhost:3000?token=${token}`);
};
