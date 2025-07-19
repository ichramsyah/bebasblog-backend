![image](/src/public/postman-bebasblog.JPG)

## 🚀BebasBlog RESTful APIs

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Passport.js](https://img.shields.io/badge/Passport.js-336699?style=for-the-badge&logo=passport&logoColor=white)](http://www.passportjs.org/)
[![Bcrypt.js](https://img.shields.io/badge/Bcrypt.js-000000?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/bcryptjs)
[![Multer](https://img.shields.io/badge/Multer-000000?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/multer)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Dotenv](https://img.shields.io/badge/Dotenv-000000?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/dotenv)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)

Ini adalah layanan backend untuk proyek Bebasblog, sebuah API RESTful yang dibangun untuk mendukung platform blogging atau media sosial. Layanan ini menyediakan autentikasi pengguna, manajemen profil, dan penanganan postingan dengan fitur seperti unggahan gambar (via Cloudinary), like, dan komentar. Proyek ini dikembangkan menggunakan TypeScript, Express, dan Mongoose, dengan dukungan untuk autentikasi Google OAuth.

## Daftar Isi

- [Fitur Utama Backend](#fitur-utama-backend)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Konsep yang Diterapkan](#konsep-yang-diterapkan)
- [Struktur Proyek](#struktur-proyek)
- [Daftar Endpoint API](#daftar-endpoint-api)
- [Setup Variabel Environment](#setup-variabel-environment-env)
- [Instalasi & Menjalankan](#instalasi--menjalankan)

## Fitur Utama Backend

- **Manajemen Pengguna & Autentikasi:**
  - Registrasi pengguna baru dengan validasi dasar.
  - login manual dengan perbandingan password yang di-hash menggunakan bcryptjs.
  - Autentikasi pihak ketiga menggunakan **Google OAuth 2.0** via Passport.js.
  - Pembuatan dan verifikasi **JSON Web Token (JWT)** untuk mengamankan endpoint.
  - Memperbarui profil pengguna (foto profil, username, email, password, bio).
- **Manajemen Postingan:**
  - Membuat postingan dengan gambar yang dapat diunggah via Cloudinary.
  - Mengelola postingan pengguna (CRUD: Create, Read, Update, Delete).
  - Fitur interaksi seperti like dan komentar pada postingan.
- **Penanganan File:**
  - Endpoint untuk menerima unggahan gambar postingan.
  - Middleware (`multer`) untuk memvalidasi dan memproses file.
  - Integrasi dengan **Cloudinary** untuk menyimpan gambar di cloud.

## Teknologi yang Digunakan

- **Runtime:** Node.js
- **Language**: TypeScript
- **Framework:** Express.js
- **Database:** MongoDB dengan **Mongoose** sebagai ODM (Object Data Modeling).
- **Autentikasi:**
  - `jsonwebtoken` untuk JWT.
  - `bcryptjs` untuk hashing password.
  - `passport` & `passport-google-oauth20` untuk Google OAuth.
- **Penanganan File:**
  - `multer` untuk menangani `multipart/form-data`.
  - `multer-storage-cloudinary` untuk integrasi Cloudinary.
- **Environment Variables:** `dotenv`

## Konsep yang Diterapkan

Proyek ini dibangun di atas beberapa konsep dan pola arsitektur perangkat lunak yang penting:

- **RESTful API Design:** Mendesain endpoint berdasarkan sumber daya seperti `users` dan `posts`.
- **Pola MVC (Model-View-Controller):** Diterapkan dengan memisahkan:
  - **Model:** Skema Mongoose di dalam folder `/models`.
  - **View:** (Dalam konteks API) Didefinisikan oleh Rute di dalam folder `/routes`.
  - **Controller:** Logika bisnis yang menjembatani model dan rute, di dalam folder `/controllers`.
- **Middleware:** Penggunaan middleware untuk autentikasi, validasi file, dan fungsi lainnya.
- **Keamanan:**
  - **Password Hashing:** Menyimpan password pengguna dengan aman.
  - **Stateless Authentication:** Menggunakan JWT untuk otorisasi permintaan.

## Struktur Proyek

```
/bebasblog-backend
└── src/        # File utama server Express
     ├── /config             # File konfigurasi (database, passport, cloudinary)
     │      ├── env.js
     │      ├── db.js
     │      └── passport.js
     ├── /controllers        # Logika bisnis untuk setiap rute API
     │      ├── authController.js
     │      ├── userController.js
     │      ├── postController.js
     ├── /middleware         # Middleware kustom (auth, upload)
     │      ├── authMiddleware.js
     │      └── uploadMiddleware.js
     ├── /models             # Skema database Mongoose
     │      ├── UserModel.js
     │      ├── PostModel.js
     │      ├── CommentModel.js
     ├── /routes             # Definisi rute-rute API
     │      ├── authRoutes.js
     │      ├── userRoutes.js
     │      └── postRoutes.js
     └── index.ts
└── .env                # (Contoh) File variabel environment (tidak di-commit)

```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Mendaftarkan pengguna baru.
- `POST /api/auth/login` - Login pengguna.

### User

- `GET /api/users/me` - Mendapatkan profil pengguna saat ini (Terproteksi).
- `PUT /api/users/me` - Memperbarui profil pengguna saat ini (Terproteksi).
- `PUT /api/users/me` - Memperbarui gambar profil pengguna (Terproteksi).
- `PUT /api/users/me/password` - Memperbarui kata sandi pengguna saat ini (Terproteksi).

### Posts

- `POST /api/posts` - Membuat postingan baru (Terproteksi).
- `GET /api/posts` - Mendapatkan semua postingan.
- `GET /api/posts/:id` - Mendapatkan postingan spesifik berdasarkan ID.
- `PUT /api/posts/:id` - Memperbarui postingan spesifik (Terproteksi).
- `DEL /api/posts/:id` - Menghapus postingan spesifik (Terproteksi).
- `POST /api/posts/:id/like` - Menyukai postingan spesifik (Terproteksi).
- `DEL /api/posts/:id/like` - Membatalkan like pada postingan spesifik (Terproteksi).
- `POST /api/posts/:id/comments` - Menambahkan komentar pada postingan spesifik (Terproteksi).
- `GET /api/posts/:id/comments` - Mendapatkan semua komentar untuk postingan spesifik.

## Setup Variabel Environment (`.env`)

Buat file `.env` di direktori root backend dan isi dengan variabel berikut:

```
MONGO_URI=
JWT_SECRET=
PORT=5000
FRONTEND_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Instalasi & Menjalankan

1. Dari direktori root proyek, masuk ke folder backend: `cd bebasblog-backend`
2. Install semua dependensi: `npm install`
3. Pastikan file `.env` sudah diisi dengan benar.
4. Jalankan server development: `npm run dev`
5. Server akan berjalan di `http://localhost:5000` (atau port yang didefinisikan di `.env`).
