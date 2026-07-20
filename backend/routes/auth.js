import express from 'express';
import { registerUser, authUser, getSecurityQuestion, resetPassword, getAllUsers } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', getSecurityQuestion);
router.post('/reset-password', resetPassword);
router.get('/users', protect, admin, getAllUsers);

export default router;
