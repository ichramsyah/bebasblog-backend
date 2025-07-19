// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser } from '../controllers/authController';

const router = Router();

// Definisikan route untuk POST /api/auth/register
router.post('/register', registerUser);

export default router;
