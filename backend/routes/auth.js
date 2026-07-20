import express from 'express';
import { registerUser, authUser, getSecurityQuestion, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', getSecurityQuestion);
router.post('/reset-password', resetPassword);

export default router;
