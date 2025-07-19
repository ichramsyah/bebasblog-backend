// src/models/User.ts
import { Schema, model, Document, Model, Types } from 'mongoose'; // <-- Import Model and Types
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: Types.ObjectId; // <-- TAMBAHKAN BARIS INI
  username: string;
  email: string;
  password?: string;
  profile_picture_url: string;
  bio: string;
  createdAt?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Interface untuk Methods (fungsi custom)
export interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Gabungkan keduanya menjadi tipe Model
type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel>( // <-- Gunakan tipe Model di sini
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false }, // `select: false` menyembunyikan password
    profile_picture_url: { type: String, default: 'default_profile_pic_url' },
    bio: { type: String, default: '' },
    // HAPUS matchPassword DARI SINI
  },
  {
    timestamps: true,
  }
);

// Hash password sebelum menyimpan user baru
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Definisikan method di sini, di luar objek Schema
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  // `this.password` akan tersedia karena kita akan .select('+password') saat query
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser, UserModel>('User', UserSchema); // <-- Gunakan kedua tipe di sini
export default User;
