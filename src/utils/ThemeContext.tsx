import React, { createContext, useContext, useEffect } from 'react';

type ThemeMode = 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  headerStyle: 'solid' | 'transparent-overlay';
  setHeaderStyle: (style: 'solid' | 'transparent-overlay') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    localStorage.removeItem('shala-theme-mode');
    const root = document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
    document.body.classList.add('theme-light');
    document.body.classList.remove('theme-dark');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: 'light',
        toggleTheme: () => {},
        headerStyle: 'solid',
        setHeaderStyle: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
