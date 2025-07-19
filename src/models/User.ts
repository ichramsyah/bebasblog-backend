// src/models/User.ts
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface untuk mendefinisikan properti User
export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  profile_picture_url: string;
  bio: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    profile_picture_url: { type: String, default: 'default_profile_pic_url' },
    bio: { type: String, default: '' },
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

const User = model<IUser>('User', UserSchema);
export default User;
