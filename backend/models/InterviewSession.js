import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobProfile: {
    type: String,
    required: true
  },
  experienceLevel: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    default: 'Medium'
  },
  personality: {
    type: String,
    enum: ['Friendly', 'Strict', 'Stressed', 'HR Expert'],
    default: 'Friendly'
  },
  skills: {
    type: [String],
    default: []
  },
  questionsCount: {
    type: Number,
    default: 5
  },
  totalScore: {
    type: Number,
    default: 0
  },
  overallFeedback: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'interrupted'],
    default: 'ongoing'
  },
  tabSwitches: {
    type: Number,
    default: 0
  },
  targetCompany: {
    type: String,
    default: 'General'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
