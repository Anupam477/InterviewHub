import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    console.warn('WARNING: GEMINI_API_KEY is not configured in Resume Controller. Running in MOCK Mode.');
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

// @desc    Parse uploaded resume PDF and extract profile details
// @route   POST /api/resume/parse
// @access  Private
export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF resume.' });
    }

    // Parse PDF text from memory buffer
    const pdfData = await pdf(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from the PDF. Ensure it is not scanned/an image.' });
    }

    const model = getGeminiModel();
    let resultJSON = {
      jobProfile: 'Software Engineer',
      experienceLevel: 'Fresher (0 Years)',
      skills: 'JavaScript, React, Node.js'
    };

    if (model) {
      const prompt = `Act as an expert recruiter. Analyze the following resume text and extract the candidate's core profile, experience, and skills.
Resume Text:
"${resumeText}"

Based on the resume content, extract:
1. "jobProfile": The best suited job profile title (e.g. "MERN Stack Developer", "Data Analyst", "Machine Learning Engineer", "Frontend Developer").
2. "experienceLevel": The candidate's experience category. You MUST choose exactly one of these: "Fresher (0 Years)", "1-2 Years", "3-5 Years", "5+ Years".
3. "skills": A comma-separated string of the core technical skills identified (e.g. "React, Node.js, Python, MongoDB, SQL"). Limit to the top 10 relevant skills.

Return the response strictly as a JSON object with this format (no markdown blocks like \`\`\`json or \`\`\`, just raw JSON text):
{
  "jobProfile": "MERN Stack Developer",
  "experienceLevel": "Fresher (0 Years)",
  "skills": "React, Node.js, MongoDB, JavaScript"
}
Do not include any markdown format or additional text.`;

      try {
        const geminiResponse = await model.generateContent({
          contents: prompt,
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });
        const text = geminiResponse.response.text();
        resultJSON = JSON.parse(text);
      } catch (geminiError) {
        console.error('Gemini Resume parsing failed, falling back to regex heuristic:', geminiError);
        // Heuristic fallback
        resultJSON = parseResumeHeuristic(resumeText);
      }
    } else {
      // Mock / Heuristic fallback
      resultJSON = parseResumeHeuristic(resumeText);
    }

    res.json(resultJSON);
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ message: 'Failed to process resume parsing.' });
  }
};

// Regex Helper for Mock/Fallback parsing
const parseResumeHeuristic = (text) => {
  const lowerText = text.toLowerCase();
  const result = {
    jobProfile: 'Software Engineer',
    experienceLevel: 'Fresher (0 Years)',
    skills: 'JavaScript'
  };

  // Job Profile Heuristics
  if (lowerText.includes('mern') || (lowerText.includes('react') && lowerText.includes('node'))) {
    result.jobProfile = 'MERN Stack Developer';
  } else if (lowerText.includes('frontend') || lowerText.includes('react') || lowerText.includes('vue')) {
    result.jobProfile = 'Frontend Developer';
  } else if (lowerText.includes('backend') || lowerText.includes('express') || lowerText.includes('django')) {
    result.jobProfile = 'Backend Developer';
  } else if (lowerText.includes('data scientist') || lowerText.includes('machine learning') || lowerText.includes('python')) {
    result.jobProfile = 'Data Scientist';
  }

  // Experience level detection (very basic)
  if (lowerText.includes('years of experience') || lowerText.includes('yoe')) {
    if (lowerText.includes('3 years') || lowerText.includes('4 years')) {
      result.experienceLevel = '3-5 Years';
    } else if (lowerText.includes('1 year') || lowerText.includes('2 years')) {
      result.experienceLevel = '1-2 Years';
    } else if (lowerText.includes('5 years') || lowerText.includes('6 years') || lowerText.includes('7 years')) {
      result.experienceLevel = '5+ Years';
    }
  }

  // Skills Extraction
  const knownSkills = [
    'react', 'angular', 'vue', 'node.js', 'node', 'express', 'mongodb', 'mysql',
    'postgres', 'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'php',
    'django', 'flask', 'git', 'aws', 'docker', 'kubernetes', 'html', 'css', 'tailwind'
  ];
  const detected = [];
  knownSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      // Capitalize nicely
      if (skill === 'mongodb') detected.push('MongoDB');
      else if (skill === 'node.js' || skill === 'node') detected.push('Node.js');
      else if (skill === 'react') detected.push('React');
      else if (skill === 'express') detected.push('Express');
      else if (skill === 'javascript') detected.push('JavaScript');
      else if (skill === 'typescript') detected.push('TypeScript');
      else if (skill === 'git') detected.push('Git');
      else detected.push(skill.toUpperCase());
    }
  });

  // Remove duplicates and join
  const uniqueSkills = [...new Set(detected)];
  if (uniqueSkills.length > 0) {
    result.skills = uniqueSkills.slice(0, 10).join(', ');
  }

  return result;
};
