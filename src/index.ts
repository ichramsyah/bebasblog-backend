// src/index.ts
import 'dotenv/config';
import express, { Request, Response } from 'express';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';

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
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
