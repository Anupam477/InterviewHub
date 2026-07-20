import express from 'express';
import {
  startInterview,
  getQuestion,
  submitAnswer,
  endInterview,
  getHistory,
  getSessionReport
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all interview routes

router.post('/start', startInterview);
router.get('/session/:sessionId/question/:qNum', getQuestion);
router.post('/evaluate', submitAnswer);
router.post('/end', endInterview);
router.get('/history', getHistory);
router.get('/session/:sessionId/report', getSessionReport);

export default router;
