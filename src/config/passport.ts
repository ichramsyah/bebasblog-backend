// src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/api/auth/google/callback', // Harus sama dengan di Google Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Data profil yang kita dapat dari Google
        const email = profile.emails?.[0].value;
        const googleId = profile.id;
        const name = profile.displayName;
        const profilePicture = profile.photos?.[0].value;

        if (!email) {
          return done(new Error('Email tidak ditemukan dari profil Google'), false);
        }

        // 1. Cek apakah user dengan email ini sudah ada
        let user = await User.findOne({ email: email });

        if (user) {
          // Jika user ada, kita langsung teruskan
          return done(null, user);
        } else {
          // 2. Jika tidak ada, buat user baru
          // Username dibuat unik dari nama + angka acak
          const newUsername = `${name.split(' ').join('').toLowerCase()}${Math.floor(1000 + Math.random() * 9000)}`;

          const newUser = new User({
            username: newUsername,
            email: email,
            // Kita set password acak karena user ini tidak akan login dengan password
            password: uuidv4(),
            profile_picture_url: profilePicture,
            bio: 'Pengguna Bebas Blog',
          });

          await newUser.save();
          return done(null, newUser);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
