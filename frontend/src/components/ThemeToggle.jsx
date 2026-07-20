import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.jsx';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-850'
          : 'bg-white border-slate-200 text-indigo-600 hover:text-indigo-500 hover:bg-slate-50'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
