import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightPalette, darkPalette, typography, spacing, borderRadius, shadows } from '../theme/index.js';

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  colors: lightPalette,
  typography,
  spacing,
  borderRadius,
  shadows
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('hbplus_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('hbplus_theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const colors = isDark ? darkPalette : lightPalette;

  const value = {
    isDark,
    toggleTheme,
    colors,
    typography,
    spacing,
    borderRadius,
    shadows
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
