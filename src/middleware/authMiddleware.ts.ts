// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Kita perlu memperluas tipe Request dari Express untuk menyertakan properti 'user'
export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Cek apakah header Authorization ada dan dimulai dengan 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Ambil token dari header (Bentuknya: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      // 3. Ambil data user dari database berdasarkan id di token, tanpa password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Tidak diizinkan, user tidak ditemukan' });
      }

      // Lanjutkan ke controller berikutnya
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Tidak diizinkan, token gagal' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Tidak diizinkan, tidak ada token' });
  }
};
