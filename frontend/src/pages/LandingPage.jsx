import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Sparkles, Terminal, Award, FileText, ArrowRight, X, Cpu } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle.jsx';

const LandingPage = ({ onEnterDashboard }) => {
  const { user, login, register, getSecurityQuestion, resetPassword } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    securityQuestion: "What is your favorite pet's name?", 
    securityAnswer: '' 
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [isForgot, setIsForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [securityQuestionText, setSecurityQuestionText] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    let res;
    if (isLogin) {
      res = await login(authData.email, authData.password);
    } else {
      res = await register(authData.name, authData.email, authData.password, authData.securityQuestion, authData.securityAnswer);
    }

    setLoading(false);
    if (res.success) {
      setShowAuthModal(false);
      onEnterDashboard();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const res = await getSecurityQuestion(recoveryEmail);
    setLoading(false);
    if (res.success) {
      setSecurityQuestionText(res.securityQuestion);
      setForgotStep(2);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const res = await resetPassword(recoveryEmail, recoveryAnswer, newPassword);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setIsForgot(false);
        setIsLogin(true);
        setForgotStep(1);
        setRecoveryEmail('');
        setRecoveryAnswer('');
        setNewPassword('');
        setSuccessMsg('');
      }, 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const openAuth = (loginMode) => {
    setIsLogin(loginMode);
    setIsForgot(false);
    setErrorMsg('');
    setSuccessMsg('');
    setAuthData({ 
      name: '', 
      email: '', 
      password: '', 
      securityQuestion: "What is your favorite pet's name?", 
      securityAnswer: '' 
    });
    setShowAuthModal(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-900/10 blur-[120px] ambient-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-900/10 blur-[120px] ambient-glow" />

      {/* Navigation */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-900 bg-white/20 dark:bg-slate-950/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg shadow-md shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5">
            Interview<span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-black">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={onEnterDashboard}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 hover:shadow-lg hover:shadow-indigo-500/20 transition-all rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 text-white"
            >
              Go to Dashboard <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => openAuth(true)}
                className="px-3 sm:px-4 py-2 text-slate-600 hover:text-slate-950 dark:text-slate-350 dark:hover:text-white transition-all text-xs sm:text-sm font-semibold"
              >
                Log In
              </button>
              <button
                onClick={() => openAuth(false)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 hover:shadow-lg hover:shadow-indigo-500/20 transition-all rounded-xl font-semibold text-xs sm:text-sm text-white"
              >
                Get Started
              </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center text-center flex-grow">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 sm:mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Empowering Placement Preparation
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight sm:leading-none">
          Master Your Technical Interviews with{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-500 bg-clip-text text-transparent">
            AI Precision
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Simulate realistic, company-specific mock interviews. Receive real-time scoring, code complexity profiling, behavioral analysis, and a personalized 5-day roadmap to crack top placements.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4">
          {user ? (
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-all rounded-xl font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 text-white"
            >
              Enter Dashboard <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => openAuth(false)}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-all rounded-xl font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/25 text-white"
              >
                Create Free Account
              </button>
              <button
                onClick={() => openAuth(true)}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 active:scale-95 transition-all rounded-xl font-bold text-sm sm:text-base border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                Try Live Mock
              </button>
            </>
          )}
        </div>

        {/* Features grid */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          <div className="p-6 glass-panel glass-panel-hover rounded-2xl text-left">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 text-indigo-500 dark:text-indigo-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Coding Sandbox</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Write actual code to solve DSA or MERN problems. Get detailed Time and Space Complexity profiles computed directly by Gemini AI.
            </p>
          </div>

          <div className="p-6 glass-panel glass-panel-hover rounded-2xl text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Cross-Questioning Rounds</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              The AI interviewer dynamically builds the next questions from your previous answer, mimicking hard round simulations.
            </p>
          </div>

          <div className="p-6 glass-panel glass-panel-hover rounded-2xl text-left">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-5 text-pink-500 dark:text-pink-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Real-time Soft Skills</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Analyze speaking pace and track filler word counts ('um', 'like', 'you know') in speech to polish vocal communication.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} InterviewHub - Designed for Placement Excellence. Built with MERN + Google Gemini.
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isForgot ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Forgot Password
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {forgotStep === 1 
                    ? 'Enter your registered email address to verify your account.' 
                    : 'Verify your answer and set a new password.'}
                </p>

                {successMsg && (
                  <div className="p-3 bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50 rounded-xl text-xs text-emerald-600 dark:text-emerald-400">
                    {successMsg}
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 bg-red-100 border border-red-200 dark:bg-red-950/30 dark:border-red-800/50 rounded-xl text-xs text-red-600 dark:text-red-400">
                    {errorMsg}
                  </div>
                )}

                {forgotStep === 1 ? (
                  <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                        placeholder="name@university.edu"
                        className="w-full px-4 py-3 custom-input"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-98 transition-all rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 text-white mt-6 disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Next'}
                    </button>

                    <div className="mt-6 text-center text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgot(false);
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Security Question</label>
                      <div className="p-3.5 bg-slate-55 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300">
                        {securityQuestionText}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Security Answer</label>
                      <input
                        type="text"
                        value={recoveryAnswer}
                        onChange={(e) => setRecoveryAnswer(e.target.value)}
                        required
                        placeholder="Your answer"
                        className="w-full px-4 py-3 custom-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 custom-input"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-98 transition-all rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 text-white mt-6 disabled:opacity-50"
                    >
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>

                    <div className="mt-6 text-center text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotStep(1);
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        Change Email Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {isLogin ? 'Log in to continue your mock sessions.' : 'Sign up to start setting up customized mock interviews.'}
                </p>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 dark:bg-red-950/30 dark:border-red-800/50 rounded-xl text-xs text-red-600 dark:text-red-400">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={authData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 custom-input"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={authData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="name@university.edu"
                      className="w-full px-4 py-3 custom-input"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgot(true);
                            setForgotStep(1);
                            setErrorMsg('');
                            setSuccessMsg('');
                          }}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={authData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 custom-input"
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Security Question (for recovery)</label>
                        <select
                          name="securityQuestion"
                          value={authData.securityQuestion}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 custom-select"
                        >
                          <option value="What is your favorite pet's name?">What is your favorite pet's name?</option>
                          <option value="What city were you born in?">What city were you born in?</option>
                          <option value="What was the name of your first school?">What was the name of your first school?</option>
                          <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                          <option value="What is your favorite book/movie?">What is your favorite book/movie?</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Security Answer</label>
                        <input
                          type="text"
                          name="securityAnswer"
                          value={authData.securityAnswer}
                          onChange={handleInputChange}
                          required
                          placeholder="Your answer"
                          className="w-full px-4 py-3 custom-input"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-98 transition-all rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 text-white mt-6 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  {isLogin ? (
                    <span>
                      Don't have an account?{' '}
                      <button onClick={() => { setIsLogin(false); setErrorMsg(''); }} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Sign Up</button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button onClick={() => { setIsLogin(true); setErrorMsg(''); }} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Log In</button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
