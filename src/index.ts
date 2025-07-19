// src/index.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';

// Konfigurasi dotenv
dotenv.config();

// Koneksi
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running for Bebas Blog...');
});
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
