import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const colors = {
    dark: {
      bg: '#1a1a1a',
      text: '#ffffff',
      navbar: '#0d0d0d',
      card: '#2a2a2a',
      border: '#3a3a3a',
      water: '#3b82f6',        // Blue for water
      hit: '#ef4444',          // Red for hit
      empty: '#4b5563',        // Dark gray for empty
      primary: '#3b82f6',
    },
    light: {
      bg: '#f5f1e8',           // Beige background
      text: '#1a1a1a',
      navbar: '#e8dcc8',       // Light beige navbar
      card: '#ffffff',
      border: '#d4c4b0',
      water: '#2563eb',        // Blue for water
      hit: '#dc2626',          // Red for hit
      empty: '#c5b8a8',        // Light gray for empty
      primary: '#2563eb',
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: colors[theme], allColors: colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}
