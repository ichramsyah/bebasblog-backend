// src/config/env.ts
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in environment variables.');
  process.exit(1); // Keluar dari aplikasi jika variabel penting tidak ada
}
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in environment variables.');
  process.exit(1);
}
// Tambahkan validasi untuk GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, dll. jika sudah ada.
