// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

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
