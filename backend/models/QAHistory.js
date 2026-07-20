import mongoose from 'mongoose';

const qaHistorySchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    default: ''
  },
  idealAnswer: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  fillerWords: {
    type: Map,
    of: Number,
    default: {}
  },
  complexityAnalysis: {
    time: { type: String, default: 'N/A' },
    space: { type: String, default: 'N/A' },
    optimization: { type: String, default: 'N/A' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QAHistory = mongoose.model('QAHistory', qaHistorySchema);
export default QAHistory;
