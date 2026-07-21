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
    <div className="relative min-h-screen bg-slate-50 dark:bg-black overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      {/* Background Ambient Glows & Spotlight */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-500/10 via-transparent to-transparent pointer-events-none dark:from-white/10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-slate-500/5 dark:bg-neutral-900/20 blur-[120px] ambient-glow" />

      {/* Navigation */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex justify-between items-center border-b border-slate-200 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg shadow-sm border border-slate-200 dark:border-white/10">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5">
            Interview<span className="text-slate-900 dark:text-white font-black underline decoration-slate-400 dark:decoration-slate-600 underline-offset-4">Hub</span>
          </span>
        </div>

        {/* Mock Navigation Menu Links from Image */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#platform" className="hover:text-slate-900 dark:hover:text-white transition-colors">Platform</a>
          <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
          <a href="#enterprise" className="hover:text-slate-900 dark:hover:text-white transition-colors">Enterprise</a>
          <a href="#resources" className="hover:text-slate-900 dark:hover:text-white transition-colors">Resources</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={onEnterDashboard}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 transition-all rounded-full font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 border border-slate-800 dark:border-white shadow-sm"
            >
              Go to Dashboard <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => openAuth(true)}
                className="px-3 sm:px-4 py-2 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-all text-xs sm:text-sm font-semibold"
              >
                Log In
              </button>
              <button
                onClick={() => openAuth(false)}
                className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 transition-all rounded-full font-semibold text-xs sm:text-sm border border-slate-800 dark:border-white shadow-sm"
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-neutral-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider mb-6 sm:mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Empowering Placement Preparation
        </div>

        {/* Headline exact Match to Mockup */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7.5xl font-extrabold tracking-tight max-w-4xl leading-none text-slate-900 dark:text-white">
          Streamline Your Interview<br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900 dark:from-white dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
            Process. Efficiently.
          </span>
        </h1>

        {/* Subtitle Match to Mockup */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          The ultimate platform for modern hiring candidates to manage, conduct, and analyze technical and behavioral interviews with Gemini AI.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4 z-20">
          {user ? (
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 transition-all rounded-full font-bold text-sm sm:text-base border border-slate-800 dark:border-white shadow-sm flex items-center justify-center gap-2"
            >
              Enter Dashboard <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => openAuth(false)}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 transition-all rounded-full font-bold text-sm sm:text-base border border-slate-800 dark:border-white shadow-md"
              >
                Create Free Account
              </button>
              <button
                onClick={() => openAuth(true)}
                className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-black hover:bg-slate-100 dark:hover:bg-neutral-900 active:scale-95 transition-all rounded-full font-bold text-sm sm:text-base border border-slate-300 dark:border-white/25 text-slate-900 dark:text-white"
              >
                Try Live Mock
              </button>
            </>
          )}
        </div>

        {/* Central Dashboard Mockup Card from Image */}
        <div className="relative mt-16 w-full max-w-3xl aspect-[16/9.5] rounded-2xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-black/60 backdrop-blur-md p-6 overflow-hidden shadow-2xl dark:shadow-black/90 flex flex-col justify-between group">
          {/* Glossy top reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none transition-transform duration-1000 group-hover:translate-x-12" />
          
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-[11px] text-slate-400 dark:text-white/40 tracking-wider">dashboard.interviewhub.com</div>
            <div className="w-12" />
          </div>

          {/* Mock Dashboard Grid layout */}
          <div className="grid grid-cols-3 gap-4 flex-grow text-left">
            <div className="col-span-2 space-y-4">
              <div className="h-24 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-3.5 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 dark:text-white/50 uppercase tracking-wider font-bold">Mock Score Trend</span>
                <div className="h-8 flex items-end gap-1.5">
                  <div className="w-full bg-slate-300 dark:bg-white/20 rounded-sm h-[30%]" />
                  <div className="w-full bg-slate-400 dark:bg-white/40 rounded-sm h-[50%]" />
                  <div className="w-full bg-slate-500 dark:bg-white/60 rounded-sm h-[80%]" />
                  <div className="w-full bg-slate-800 dark:bg-white rounded-sm h-[95%]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-18 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-3 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-white/50 uppercase">Proctoring Status</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white tracking-wider">98.4% INTEGRITY</span>
                </div>
                <div className="h-18 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-3 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-white/50">Vocal Pace</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white tracking-wider">125 WPM (Optimal)</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-2 w-12 bg-slate-400 dark:bg-white/40 rounded" />
                <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-2 w-[80%] bg-slate-200 dark:bg-white/10 rounded" />
              </div>
              <div className="space-y-2">
                <div className="text-[9px] font-bold text-slate-500 dark:text-white/40 uppercase">Gemini AI Integrator</div>
                <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded overflow-hidden">
                  <div className="h-full bg-slate-800 dark:bg-white w-2/3" />
                </div>
              </div>
            </div>
          </div>

          {/* Request Access Bar */}
          <div className="mt-6 flex items-center justify-between bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full p-1.5 max-w-md mx-auto w-full">
            <span className="text-xs text-slate-600 dark:text-white/60 pl-4">Request Platform Access</span>
            <button 
              onClick={() => openAuth(false)}
              className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold text-xs rounded-full shadow-lg transition-all"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Features grid with gloss effect */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          {/* Card 1: Efficient Scheduling */}
          <div className="relative p-6 bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl text-left overflow-hidden group hover:border-slate-400 dark:hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-xl dark:shadow-black/50 transform hover:-translate-y-1">
            {/* Glossy reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-5 text-slate-900 dark:text-white">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Efficient Scheduling</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Simulate realistic, company-specific mock interviews scheduled dynamically at your convenience.
            </p>
          </div>

          {/* Card 2: Structured Interviews */}
          <div className="relative p-6 bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl text-left overflow-hidden group hover:border-slate-400 dark:hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-xl dark:shadow-black/50 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-5 text-slate-900 dark:text-white">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Structured Interviews</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Dynamic cross-questioning rounds that adapt based on your responses, mimicking real technical interviewer loops.
            </p>
          </div>

          {/* Card 3: AI Insights & Feedback */}
          <div className="relative p-6 bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl text-left overflow-hidden group hover:border-slate-400 dark:hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-xl dark:shadow-black/50 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-5 text-slate-900 dark:text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">AI Insights & Feedback</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Get detailed speaking pace tracking, filler word detection counts, and automated visual performance score sheets.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} InterviewHub - Designed for Placement Excellence. Built with MERN + Google Gemini.
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
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
                      className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-98 transition-all rounded-full font-bold text-sm border border-slate-800 dark:border-white shadow-sm mt-6 disabled:opacity-50"
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
                        className="text-slate-800 dark:text-white hover:underline font-semibold"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Security Question</label>
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300">
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
                      className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-98 transition-all rounded-full font-bold text-sm border border-slate-800 dark:border-white shadow-sm mt-6 disabled:opacity-50"
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
                        className="text-slate-800 dark:text-white hover:underline font-semibold"
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
                          className="text-xs font-semibold text-slate-800 dark:text-white hover:underline"
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
                    className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-98 transition-all rounded-full font-bold text-sm border border-slate-800 dark:border-white shadow-sm mt-6 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  {isLogin ? (
                    <span>
                      Don't have an account?{' '}
                      <button onClick={() => { setIsLogin(false); setErrorMsg(''); }} className="text-slate-800 dark:text-white hover:underline font-medium">Sign Up</button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button onClick={() => { setIsLogin(true); setErrorMsg(''); }} className="text-slate-800 dark:text-white hover:underline font-medium">Log In</button>
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
