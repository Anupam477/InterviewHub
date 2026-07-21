import { GoogleGenerativeAI } from '@google/generative-ai';
import InterviewSession from '../models/InterviewSession.js';
import QAHistory from '../models/QAHistory.js';

// Initialize Gemini API client if API key is present
const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    console.warn('WARNING: GEMINI_API_KEY is not configured. Running in MOCK Mode.');
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

// Helper: Count filler words in user answers
const countFillerWords = (text) => {
  const fillers = ['um', 'uh', 'like', 'ah', 'er', 'you know', 'actually', 'basically'];
  const counts = {};
  if (!text) return counts;

  const words = text.toLowerCase().split(/\s+/);
  fillers.forEach(filler => {
    let count = 0;
    if (filler.includes(' ')) {
      // Match phrase
      let idx = text.toLowerCase().indexOf(filler);
      while (idx !== -1) {
        count++;
        idx = text.toLowerCase().indexOf(filler, idx + 1);
      }
    } else {
      // Match single word
      words.forEach(w => {
        const cleanW = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        if (cleanW === filler) {
          count++;
        }
      });
    }
    if (count > 0) {
      counts[filler] = count;
    }
  });
  return counts;
};

// Rich database of Mock Questions categorized by focus areas
const MOCK_QUESTION_BANK = {
  frontend: [
    "What is the Virtual DOM in React, and how does it optimize rendering performance?",
    "Explain the difference between useEffect, useMemo, and useCallback. When should you use each?",
    "How does the CSS box model work, and what is the difference between border-box and content-box?",
    "What are modern ways to manage global state in a React application (e.g. Redux Toolkit, Context API, Zustand)? What are their trade-offs?",
    "Explain event delegation and event bubbling in JavaScript.",
    "What are Web Workers, and how do they help run heavy computations in the browser without freezing the UI?",
    "How do you optimize a React web page's performance (lazy loading, code splitting, image optimization, minimizing bundle size)?",
    "What is the difference between server-side rendering (SSR) and client-side rendering (CSR)?",
    "Explain closures in JavaScript with a practical example.",
    "What is the difference between local storage, session storage, and cookies?",
    "Explain the difference between Shadow DOM and Virtual DOM.",
    "How do you achieve SEO optimization in React apps using dynamic meta tags or packages like React Helmet?",
    "Explain the performance trade-offs of using CSS-in-JS libraries (e.g., Styled Components) versus traditional Utility CSS (e.g., Tailwind CSS).",
    "What are HTTP/2 and HTTP/3, and how do they improve asset loading speeds in modern web clients?",
    "Explain the concept of code-splitting in React. How does it work with dynamic imports and React.lazy?"
  ],
  backend: [
    "What are the differences between SQL and NoSQL databases? When would you choose one over the other?",
    "Explain the concept of database indexing. How does it speed up queries, and what are its trade-offs?",
    "What is the event loop in Node.js, and how does Node handle asynchronous operations despite being single-threaded?",
    "How do you handle authentication and authorization in Express.js? Explain the workflow of JWT (JSON Web Tokens).",
    "What are REST API design best practices, and how do you handle API versioning, pagination, and error responses?",
    "Explain CORS (Cross-Origin Resource Sharing). How do you configure it securely in a Node/Express backend?",
    "What is a cache, and when should you use solutions like Redis? Explain cache invalidation strategies.",
    "Explain the differences between Monolithic and Microservices architectures.",
    "What are Express middlewares? Write a simple middleware that logs the HTTP method, URL, and response time.",
    "How do you secure a backend application against common vulnerabilities like SQL injection, XSS, and CSRF?",
    "What are the key differences between monolithic database architectures and database sharding/partitioning?",
    "How do you handle background jobs, worker queues, and scheduled tasks in a Node.js ecosystem using Redis and BullMQ?",
    "What is rate limiting, and how do you implement a token bucket algorithm to protect Express routes from DDoS attacks?",
    "Explain the difference between symmetric and asymmetric encryption. Where are they used in securing backend communication?",
    "What is horizontal versus vertical scaling, and how does load balancing route request traffic across server instances?"
  ],
  general: [
    "Explain the main pillars of Object-Oriented Programming (OOP) with real-world examples.",
    "What is Git, and what is the difference between `git merge` and `git rebase`?",
    "Explain the difference between process and thread in operating systems.",
    "How does HTTPS work, and what role do SSL/TLS certificates play in securing network communications?",
    "Explain the difference between synchronous and asynchronous execution. Give examples of each.",
    "What is the difference between compiler and interpreter? How does JS handle execution?",
    "How do you approach debugging a memory leak in a large-scale application?",
    "What are the benefits of writing unit tests, and how do you achieve good test coverage without writing redundant tests?",
    "Explain the difference between REST, GraphQL, and gRPC.",
    "What is CI/CD (Continuous Integration and Continuous Deployment), and why is it important in modern software development?",
    "What are the differences between Docker containerization and virtual machines? Explain their isolation layers.",
    "Explain what a memory leak is in garbage-collected environments and how to find them using Heap snapshots.",
    "What is the difference between TCP and UDP protocols? In what scenarios is UDP preferred?",
    "Explain the concept of ACID properties in database transactions and how they guarantee reliability.",
    "What are the common Git workflows (e.g., Git Flow, Trunk-Based Development)? When would you use each?"
  ],
  behavioral: [
    "Tell me about a time when you faced a difficult technical challenge. How did you identify the issue and resolve it?",
    "How do you handle disagreements or conflicts within a development team, especially regarding architectural choices?",
    "Describe a situation where you had to work under a tight deadline. How did you prioritize tasks to deliver on time?",
    "What is your approach to learning new technologies or frameworks quickly when assigned to a new project?",
    "Tell me about a time you made a mistake in production. How did you handle it, and what did you learn?",
    "How do you handle feedback on your code, especially when you strongly disagree with the suggestions in a code review?",
    "Explain a time when you had to explain a complex technical concept to a non-technical stakeholder or client.",
    "Why do you want to join our company, and what unique value do you bring to the engineering team?",
    "How do you balance technical debt with delivering new features in a fast-paced environment?",
    "Where do you see yourself in the next 3 to 5 years in terms of technical growth and leadership?",
    "Tell me about a time you had to adapt quickly to a major pivot in project requirements. How did you realign your tasks?",
    "How do you estimate timelines for your software deliverables, and what do you do if you realize you won't meet a deadline?",
    "Describe a time when you went above and beyond to improve a project's codebase or developer experience without being asked.",
    "How do you keep yourself updated with the fast-evolving tech landscape, and how do you decide which new tools are worth adopting?",
    "Tell me about a time when you received vague or ambiguous requirements for a task. How did you proceed to clarify them?"
  ]
};

// Mock Fallbacks for Question Generation with dynamic selection and deduplication
const getMockQuestions = (jobProfile, skills, personality, pastQuestions = []) => {
  const profileLower = (jobProfile || '').toLowerCase();
  const personalityLower = (personality || '').toLowerCase();
  
  let pool = [];
  
  // Decide pool priorities
  if (personalityLower === 'hr expert') {
    pool = [...MOCK_QUESTION_BANK.behavioral, ...MOCK_QUESTION_BANK.general];
  } else if (profileLower.includes('front') || profileLower.includes('react') || profileLower.includes('ui') || profileLower.includes('web')) {
    pool = [...MOCK_QUESTION_BANK.frontend, ...MOCK_QUESTION_BANK.general, ...MOCK_QUESTION_BANK.behavioral];
  } else if (profileLower.includes('back') || profileLower.includes('node') || profileLower.includes('api') || profileLower.includes('database') || profileLower.includes('system')) {
    pool = [...MOCK_QUESTION_BANK.backend, ...MOCK_QUESTION_BANK.general, ...MOCK_QUESTION_BANK.behavioral];
  } else {
    // Default: General fullstack mix
    pool = [
      ...MOCK_QUESTION_BANK.general,
      ...MOCK_QUESTION_BANK.frontend,
      ...MOCK_QUESTION_BANK.backend,
      ...MOCK_QUESTION_BANK.behavioral
    ];
  }

  // Normalize past questions for matching
  const pastSet = new Set(pastQuestions.map(q => q.trim().toLowerCase()));

  // Filter out questions that have already been asked
  let availablePool = pool.filter(q => {
    const qLower = q.trim().toLowerCase();
    if (pastSet.has(qLower)) return false;
    for (const past of pastSet) {
      if (qLower.includes(past) || past.includes(qLower)) {
        return false;
      }
    }
    return true;
  });

  // If we ran out of new questions, fall back to the full pool (reset filter)
  if (availablePool.length === 0) {
    availablePool = pool;
  }

  // Shuffle the pool (Fisher-Yates)
  for (let i = availablePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availablePool[i], availablePool[j]] = [availablePool[j], availablePool[i]];
  }

  return availablePool;
};

// @desc    Start interview session and generate questions
// @route   POST /api/interview/start
// @access  Private
export const startInterview = async (req, res) => {
  const { jobProfile, experienceLevel, difficulty, personality, skills, questionsCount, targetCompany } = req.body;

  try {
    // Fetch all previously asked questions for this user to avoid repetitions
    const previousSessions = await InterviewSession.find({ userId: req.user._id }).select('_id');
    const previousSessionIds = previousSessions.map(s => s._id);
    const pastQAHistory = await QAHistory.find({ sessionId: { $in: previousSessionIds } }).select('questionText');
    const pastQuestions = pastQAHistory.map(q => q.questionText);

    // Create new interview session
    const session = await InterviewSession.create({
      userId: req.user._id,
      jobProfile,
      experienceLevel,
      difficulty: difficulty || 'Medium',
      personality: personality || 'Friendly',
      skills: skills || [],
      questionsCount: questionsCount || 5,
      targetCompany: targetCompany || 'General'
    });

    const model = getGeminiModel();
    let questions = [];

    if (model) {
      let companyContext = '';
      if (targetCompany && targetCompany !== 'General') {
        if (targetCompany === 'Google') {
          companyContext = `Design the questions matching Google's interview standards: focus on complex Algorithms and Data Structures (DSA), strict space/time complexity optimization, and deep technical problem solving. Ensure at least some questions require writing complete programming solutions.`;
        } else if (targetCompany === 'Amazon') {
          companyContext = `Design the questions matching Amazon's interview standards: incorporate Amazon Leadership Principles (such as customer obsession, ownership, deep dive, deliver results) directly into engineering challenges, scalable system design, and coding scenarios.`;
        } else if (targetCompany === 'TCS') {
          companyContext = `Design the questions matching TCS's interview standards: focus on core software engineering fundamentals, database management concepts, OOP principles, and basic coding practices.`;
        } else if (targetCompany === 'Meta') {
          companyContext = `Design the questions matching Meta's interview standards: focus on clean fast-paced coding execution, system architecture tradeoffs, and end-to-end fullstack data flow efficiency.`;
        }
      }

      let pastQuestionsContext = '';
      if (pastQuestions.length > 0) {
        pastQuestionsContext = `CRITICAL: Do NOT repeat or generate questions similar to these previously asked questions:\n${pastQuestions.slice(-30).map((q, idx) => `${idx + 1}. ${q}`).join('\n')}\nGenerate completely new, unique, and different questions.`;
      }

      const prompt = `Act as an expert technical interviewer. Create exactly ${session.questionsCount} technical interview questions for a candidate with the following details:
Job Profile: ${jobProfile}
Years of Experience: ${experienceLevel}
Key Skills: ${session.skills.join(', ')}
Interviewer Personality: ${session.personality} (Friendly: polite and encourages. Strict: rigorous, asks tough follow-ups. Stressed: quick, direct, challenging. HR Expert: focus on behavioral/HR aspect combined with tech).
Difficulty Level: ${session.difficulty}
Target Company Focus: ${session.targetCompany}
${companyContext}

${pastQuestionsContext}

Return the questions strictly as a JSON array of strings, like this:
[
  "Question 1...",
  "Question 2...",
  "..."
]
Do not include any markdown block formatting (e.g. no \`\`\`json or \`\`\`), just return raw JSON text.`;

      try {
        const result = await model.generateContent({
          contents: prompt,
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });
        const responseText = result.response.text();
        questions = JSON.parse(responseText);
      } catch (geminiError) {
        console.error('Gemini question generation failed, using mock questions:', geminiError);
        questions = getMockQuestions(jobProfile, session.skills, session.personality, pastQuestions).slice(0, session.questionsCount);
      }
    } else {
      questions = getMockQuestions(jobProfile, session.skills, session.personality, pastQuestions).slice(0, session.questionsCount);
    }

    // Save generated questions to QAHistory as templates
    const qaPromises = questions.map((q, index) => {
      return QAHistory.create({
        sessionId: session._id,
        questionNumber: index + 1,
        questionText: q
      });
    });

    await Promise.all(qaPromises);

    res.status(201).json({
      sessionId: session._id,
      jobProfile: session.jobProfile,
      experienceLevel: session.experienceLevel,
      difficulty: session.difficulty,
      personality: session.personality,
      totalQuestions: questions.length,
      firstQuestion: questions[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error starting interview session.' });
  }
};

// @desc    Get a question by number in a session
// @route   GET /api/interview/session/:sessionId/question/:qNum
// @access  Private
export const getQuestion = async (req, res) => {
  const { sessionId, qNum } = req.params;

  try {
    const question = await QAHistory.findOne({
      sessionId,
      questionNumber: parseInt(qNum)
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({
      questionNumber: question.questionNumber,
      questionText: question.questionText
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit answer to a question and evaluate it
// @route   POST /api/interview/evaluate
// @access  Private
export const submitAnswer = async (req, res) => {
  const { sessionId, questionNumber, userAnswer } = req.body;

  try {
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    const qaRecord = await QAHistory.findOne({ sessionId, questionNumber });
    if (!qaRecord) {
      return res.status(404).json({ message: 'Question history record not found' });
    }

    // Calculate fillers locally
    const fillerWords = countFillerWords(userAnswer);

    const model = getGeminiModel();
    let evaluation = {
      score: 5,
      feedback: 'Good try! Work on structure and depth.',
      idealAnswer: 'The ideal answer should include core concepts and real-world applications.',
      complexityAnalysis: { time: 'N/A', space: 'N/A', optimization: 'N/A' }
    };

    if (model) {
      const evaluationPrompt = `You are a technical interviewer. Evaluate the candidate's response to the following question.
Question: "${qaRecord.questionText}"
Candidate's Answer: "${userAnswer}"
Job Profile: ${session.jobProfile}
Difficulty: ${session.difficulty}
Interviewer Personality: ${session.personality}

Provide:
1. A score from 0 to 10 (where 10 is flawless and 0 is incorrect/empty).
2. The feedback explaining the strengths and weaknesses of the answer, matching your personality (${session.personality}).
3. The ideal, comprehensive, and correct answer to this question.
4. If the question involves code (or the answer contains code), analyze the code's Time Complexity, Space Complexity, and suggest optimizations. Otherwise, return "N/A" for those.

Return the response strictly as a JSON object with this format:
{
  "score": 8,
  "feedback": "Your explanation is good, but...",
  "idealAnswer": "The ideal answer includes...",
  "complexityAnalysis": {
    "time": "O(N) or N/A",
    "space": "O(1) or N/A",
    "optimization": "Use a hashmap to reduce complexity or N/A"
  }
}
Do not include any markdown styling.`;

      try {
        const result = await model.generateContent({
          contents: evaluationPrompt,
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });
        evaluation = JSON.parse(result.response.text());
      } catch (geminiError) {
        console.error('Gemini evaluation failed, using fallback evaluation:', geminiError);
      }
    } else {
      // Mock score based on length of response
      const wordCount = userAnswer ? userAnswer.trim().split(/\s+/).length : 0;
      if (wordCount > 40) {
        evaluation.score = 8;
        evaluation.feedback = `[MOCK MODE] Detailed response provided. Good articulation of concepts. Keep the pace steady.`;
      } else if (wordCount > 15) {
        evaluation.score = 6;
        evaluation.feedback = `[MOCK MODE] Average response. You should expand more on the implementation details.`;
      } else {
        evaluation.score = 3;
        evaluation.feedback = `[MOCK MODE] Answer too brief. Elaborate on the core concepts and mention real-world scenarios.`;
      }
    }

    // Update QA History
    qaRecord.userAnswer = userAnswer || 'No answer provided.';
    qaRecord.score = evaluation.score;
    qaRecord.feedback = evaluation.feedback;
    qaRecord.idealAnswer = evaluation.idealAnswer;
    qaRecord.fillerWords = fillerWords;
    qaRecord.complexityAnalysis = evaluation.complexityAnalysis || { time: 'N/A', space: 'N/A', optimization: 'N/A' };
    await qaRecord.save();

    res.json({
      questionNumber: qaRecord.questionNumber,
      score: qaRecord.score,
      feedback: qaRecord.feedback,
      idealAnswer: qaRecord.idealAnswer,
      fillerWords: qaRecord.fillerWords,
      complexityAnalysis: qaRecord.complexityAnalysis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error evaluating answer.' });
  }
};

// @desc    End interview and compile final performance report
// @route   POST /api/interview/end
// @access  Private
export const endInterview = async (req, res) => {
  const { sessionId, tabSwitches } = req.body;

  try {
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const qaHistory = await QAHistory.find({ sessionId });
    if (qaHistory.length === 0) {
      return res.status(400).json({ message: 'No questions registered for this session.' });
    }

    // Calculate overall average score
    const answeredQuestions = qaHistory.filter(q => q.userAnswer);
    const sumScore = answeredQuestions.reduce((sum, q) => sum + q.score, 0);
    const avgScore = answeredQuestions.length > 0 ? (sumScore / answeredQuestions.length).toFixed(1) : 0;

    const model = getGeminiModel();
    let overallSummary = {
      overallFeedback: 'Interview finished. Review the Q&A breakdown below for insights.',
      roadmap: 'Day 1-2: Strengthen basic structures.\nDay 3-5: Practice mock coding rounds.'
    };

    if (model && answeredQuestions.length > 0) {
      // Compile history text for prompt
      const historyText = qaHistory.map(q => 
        `Q: ${q.questionText}\nCandidate Answer: ${q.userAnswer}\nAI Score: ${q.score}/10\nAI Feedback: ${q.feedback}\n`
      ).join('\n');

      const summaryPrompt = `You are an expert career placement coach. Based on the candidate's interview session for the position of ${session.jobProfile} (Experience: ${session.experienceLevel}), review their performance and provide a comprehensive evaluation report.
Here is the Q&A history:
${historyText}

Provide:
1. An overall summary of their performance.
2. A customized learning roadmap (e.g. 3-day or 5-day action plan with specific topics) to bridge their skill gaps.

Return the response strictly as a JSON object with this format:
{
  "overallFeedback": "Overall, you performed well in X but need practice in Y...",
  "roadmap": "Day 1: Study X. Day 2: Build Y..."
}
Do not include any markdown format.`;

      try {
        const result = await model.generateContent({
          contents: summaryPrompt,
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });
        overallSummary = JSON.parse(result.response.text());
      } catch (geminiError) {
        console.error('Gemini summary generation failed:', geminiError);
      }
    } else {
      overallSummary.overallFeedback = `[MOCK MODE] Completed mock interview for ${session.jobProfile}. Your average score is ${avgScore}/10. Keep practicing on technical core concepts!`;
    }

    // Save final scores to session
    session.status = 'completed';
    session.totalScore = parseFloat(avgScore);
    session.tabSwitches = tabSwitches || 0;
    session.overallFeedback = overallSummary.overallFeedback + '\n\n' + overallSummary.roadmap;
    await session.save();

    res.json({
      sessionId: session._id,
      totalScore: session.totalScore,
      overallFeedback: session.overallFeedback,
      status: session.status,
      tabSwitches: session.tabSwitches
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error ending interview session.' });
  }
};

// @desc    Get all user sessions
// @route   GET /api/interview/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const history = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed report for a session
// @route   GET /api/interview/session/:sessionId/report
// @access  Private
export const getSessionReport = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const qaHistory = await QAHistory.find({ sessionId }).sort({ questionNumber: 1 });

    res.json({
      session,
      qaHistory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
