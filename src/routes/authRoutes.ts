// src/routes/authRoutes.ts
import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser, googleAuthCallback } from '../controllers/authController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Route untuk Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  googleAuthCallback // Controller kita untuk membuat token & redirect
);

export default router;
