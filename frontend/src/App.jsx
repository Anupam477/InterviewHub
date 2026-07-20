import React, { useState, useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import InterviewRoom from './pages/InterviewRoom.jsx';
import ReportCard from './pages/ReportCard.jsx';

const AppContent = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [page, setPage] = useState('landing');
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Auto transition to dashboard if user is already logged in
  useEffect(() => {
    if (!loading) {
      if (user) {
        setPage('dashboard');
      } else {
        setPage('landing');
      }
    }
  }, [user, loading]);

  const handleStartSession = (sessionId) => {
    setActiveSessionId(sessionId);
    setPage('interview');
  };

  const handleFinishSession = (sessionId) => {
    setActiveSessionId(sessionId);
    setPage('report');
  };

  const handleViewReport = (sessionId) => {
    setActiveSessionId(sessionId);
    setPage('report');
  };

  const handleCloseReport = () => {
    setPage('dashboard');
  };

  const handleLogout = () => {
    logout();
    setPage('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  switch (page) {
    case 'landing':
      return <LandingPage onEnterDashboard={() => setPage('dashboard')} />;
    case 'dashboard':
      return (
        <Dashboard
          onStartSession={handleStartSession}
          onViewReport={handleViewReport}
          onLogout={handleLogout}
        />
      );
    case 'interview':
      return (
        <InterviewRoom
          sessionId={activeSessionId}
          onFinishSession={handleFinishSession}
        />
      );
    case 'report':
      return (
        <ReportCard
          sessionId={activeSessionId}
          onClose={handleCloseReport}
        />
      );
    default:
      return <LandingPage onEnterDashboard={() => setPage('dashboard')} />;
  }
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
