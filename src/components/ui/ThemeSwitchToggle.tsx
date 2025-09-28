'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes'; 
import { Sun, Moon } from 'lucide-react'; 

const ThemeSwitchToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDarkMode = theme === 'dark';

  const handleToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggle} 
      className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-300 focus:outline-none 
        ${isDarkMode ? 'bg-indigo-700' : 'bg-gray-300'}`}
      aria-checked={isDarkMode}
      role="switch"
    >
      <span
        className={`inline-flex items-center justify-center 
          w-6 h-6 transform bg-white rounded-full shadow-md 
          transition-transform duration-300 ease-in-out 
          ${isDarkMode ? 'translate-x-[1.3rem]' : 'translate-x-0.5'}`} 
      >
        {isDarkMode ? (
          <Moon className="w-4 h-4 text-gray-700" /> 
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" /> 
        )}
      </span>
    </button>
  );
};

export default ThemeSwitchToggle;