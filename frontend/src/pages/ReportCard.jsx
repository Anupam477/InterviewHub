import React, { useState, useEffect, useContext } from 'react';
import API from '../api/api.js';
import { ArrowLeft, ChevronDown, ChevronUp, Cpu, Award, MessageSquare, Terminal, HelpCircle, Code } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const ReportCard = ({ sessionId, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(0); // expand first item by default

  useEffect(() => {
    fetchReport();
  }, [sessionId]);

  const fetchReport = async () => {
    try {
      const { data } = await API.get(`/interview/session/${sessionId}/report`);
      setReport(data);
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-550 dark:text-slate-400">Fetching performance metrics...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm shadow-xl">
          <p className="text-sm text-slate-550 dark:text-slate-400 mb-4">Failed to load report data.</p>
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold text-white">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { session, qaHistory } = report;

  // Calculate filler words metrics
  let totalFillers = 0;
  const combinedFillers = {};

  qaHistory.forEach(q => {
    if (q.fillerWords) {
      // Map structures can sometimes be parsed as standard objects or sub-maps
      const fillersObj = q.fillerWords instanceof Map ? Object.fromEntries(q.fillerWords) : q.fillerWords;
      if (fillersObj) {
        Object.entries(fillersObj).forEach(([word, count]) => {
          totalFillers += count;
          combinedFillers[word] = (combinedFillers[word] || 0) + count;
        });
      }
    }
  });

  // Circle SVG metrics
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((session.totalScore || 0) / 10) * circumference;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all active:scale-95 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">Performance Analytics</h1>
              <p className="text-[10px] sm:text-xs text-slate-550 dark:text-slate-400 truncate">Mock Interview Summary for {session.jobProfile}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column: Overall Metrics & Roadmap */}
        <section className="space-y-6 lg:col-span-1">
          {/* Score Circle Card */}
          <div className="p-5 sm:p-6 glass-panel rounded-3xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">Overall Score</h3>
            
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-indigo-600 dark:stroke-indigo-500"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{session.totalScore}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">/10</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-slate-400">
              {session.totalScore >= 8 ? (
                <span className="text-emerald-400 font-bold">Excellent placement readiness!</span>
              ) : session.totalScore >= 6 ? (
                <span className="text-indigo-400 font-bold">Good core knowledge. Needs polish.</span>
              ) : (
                <span className="text-amber-400 font-bold">Needs preparation to reach thresholds.</span>
              )}
            </div>
          </div>

          {/* Soft Skills Communication Card */}
          <div className="p-5 sm:p-6 glass-panel rounded-3xl shadow-xl space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Vocal Soft Skills</h3>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Filler Words Logged</span>
                <span className={`font-bold ${totalFillers > 5 ? 'text-amber-550 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {totalFillers} Count
                </span>
              </div>

              {totalFillers > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.entries(combinedFillers).map(([word, count]) => (
                    <span key={word} className="px-2.5 py-1 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-lg text-[10px] font-mono text-indigo-600 dark:text-indigo-300">
                      "{word}": {count}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">Perfect articulation! No filler words detected.</p>
              )}
            </div>

            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
              {totalFillers > 5 
                ? 'Tip: You used speech fillers frequently. Try speaking slowly and taking short intentional pauses instead.' 
                : 'Excellent presentation cadence. Keep speaking at this clean and professional pace.'}
            </p>
          </div>

          {/* Proctoring Integrity Audit Card */}
          <div className="p-5 sm:p-6 glass-panel rounded-3xl shadow-xl space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Proctoring Integrity</h3>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Tab Switches Flagged</span>
                <span className={`font-bold ${session.tabSwitches > 0 ? 'text-red-650 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {session.tabSwitches || 0} Warnings
                </span>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${session.tabSwitches > 0 ? 'bg-red-500 w-full' : 'bg-emerald-500 w-0'}`}
                />
              </div>
            </div>
            
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
              {session.tabSwitches > 0 
                ? 'Warning: Candidates switching tabs during technical interviews are flagged by recruitment proctors. Try to focus entirely on the exam window.'
                : 'Integrity Check: Passed. Excellent discipline. No suspicious tab activities detected.'}
            </p>
          </div>

          {/* Skill Gaps & Roadmap */}
          <div className="p-5 sm:p-6 glass-panel rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">AI Action Roadmap</h3>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl">
              <pre className="text-xs text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                {session.overallFeedback}
              </pre>
            </div>
          </div>
        </section>

        {/* Right Column: Q&A Accordion */}
        <section className="space-y-6 lg:col-span-2">
          <div className="p-4 sm:p-6 md:p-8 glass-panel rounded-3xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Question-by-Question Breakdown</h2>

            <div className="space-y-4">
              {qaHistory.map((qa, index) => {
                const isExpanded = expandedIndex === index;
                return (
                  <div key={qa._id} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950/60 shadow-sm">
                    {/* Header bar */}
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                          {qa.questionNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200 line-clamp-1 pr-4">
                          {qa.questionText}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-500/20">
                          {qa.score}/10
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
                      </div>
                    </button>

                    {/* Content Section */}
                    {isExpanded && (
                      <div className="p-5 border-t border-slate-200 dark:border-slate-900 bg-slate-50/70 dark:bg-slate-950/90 space-y-4 text-sm leading-relaxed">
                        
                        {/* Question */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <HelpCircle className="w-3.5 h-3.5" /> Full Question
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 text-sm pl-5">{qa.questionText}</p>
                        </div>

                        {/* Answer Comparison */}
                        {(() => {
                          const isCodeSubmission = qa.userAnswer.includes('function') || 
                                                   qa.userAnswer.includes('def ') || 
                                                   qa.userAnswer.includes('{') || 
                                                   qa.userAnswer.includes('return') ||
                                                   qa.userAnswer.includes('const ') ||
                                                   qa.userAnswer.includes('let ') ||
                                                   qa.userAnswer.includes(';') ||
                                                   qa.userAnswer.includes('(') ||
                                                   qa.userAnswer.includes(')') ||
                                                   (qa.complexityAnalysis && qa.complexityAnalysis.time && qa.complexityAnalysis.time !== 'N/A');
                          if (isCodeSubmission) {
                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                    <Code className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Your Code Submission
                                  </div>
                                  <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-700 dark:text-emerald-400 max-h-[300px] overflow-y-auto whitespace-pre-wrap select-text selection:bg-indigo-100 dark:selection:bg-indigo-950 shadow-inner">
                                    {qa.userAnswer}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                    <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> AI Recommended Solution
                                  </div>
                                  <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-4 font-mono text-xs text-indigo-750 dark:text-indigo-300 max-h-[300px] overflow-y-auto whitespace-pre-wrap select-text selection:bg-indigo-100 dark:selection:bg-indigo-950 shadow-inner">
                                    {qa.idealAnswer}
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                    <MessageSquare className="w-3.5 h-3.5" /> Your Submission
                                  </div>
                                  <blockquote className="border-l-2 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm pl-3 bg-slate-100/50 dark:bg-slate-900/20 py-1.5 whitespace-pre-wrap rounded-r">
                                    {qa.userAnswer}
                                  </blockquote>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                    <Award className="w-3.5 h-3.5" /> Ideal Recommended Answer
                                  </div>
                                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30 rounded-xl text-slate-700 dark:text-slate-300 text-xs pl-4 leading-relaxed">
                                    {qa.idealAnswer}
                                  </div>
                                </div>
                              </>
                            );
                          }
                        })()}

                        {/* Code Complexity Analysis if present */}
                        {qa.complexityAnalysis && qa.complexityAnalysis.time !== 'N/A' && (
                          <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] text-amber-500 dark:text-amber-400 font-bold uppercase tracking-wider">
                              <Code className="w-4 h-4" /> Complexity Profile
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-slate-500">Time Complexity:</span>{' '}
                                <span className="font-mono text-slate-800 dark:text-white font-bold">{qa.complexityAnalysis.time}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Space Complexity:</span>{' '}
                                <span className="font-mono text-slate-800 dark:text-white font-bold">{qa.complexityAnalysis.space}</span>
                              </div>
                            </div>
                            {qa.complexityAnalysis.optimization && qa.complexityAnalysis.optimization !== 'N/A' && (
                              <div className="text-xs pt-1 border-t border-slate-200 dark:border-slate-900">
                                <span className="text-slate-500 dark:text-slate-400 font-semibold">Optimization Tip:</span>{' '}
                                <span className="text-slate-700 dark:text-slate-300">{qa.complexityAnalysis.optimization}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* AI Feedback */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <Cpu className="w-3.5 h-3.5" /> Interviewer Feedback
                          </div>
                          <p className="text-indigo-650 dark:text-indigo-300 text-sm pl-5 font-semibold">{qa.feedback}</p>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ReportCard;
