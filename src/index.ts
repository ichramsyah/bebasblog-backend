// src/index.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Konfigurasi dotenv untuk memuat environment variables
dotenv.config();

// Koneksi ke Database
connectDB();

const app = express();

// Middleware untuk parsing JSON body
app.use(express.json());

// Route test sederhana
app.get('/', (req: Request, res: Response) => {
  res.send('API is running for Bebas Blog...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
