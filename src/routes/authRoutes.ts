// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// Definisikan route untuk POST /api/auth/register
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
