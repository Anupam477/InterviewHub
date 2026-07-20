import express from 'express';
import multer from 'multer';
import { parseResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer Memory Storage Configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resume files are supported!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Protected route to parse PDF resumes
router.post('/parse', protect, upload.single('resume'), parseResume);

export default router;
