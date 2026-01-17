import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, saveTheme } from '../lib/storage';

export const colors = {
  light: {
    background: '#ffffff',
    surface: '#f4f4f5',
    surfaceHover: '#e4e4e7',
    text: '#18181b',
    textSecondary: '#71717a',
    textMuted: '#a1a1aa',
    border: '#e4e4e7',
    primary: '#eab308',
    primaryText: '#18181b',
    accent: '#3b82f6',
    error: '#ef4444',
  },
  dark: {
    background: '#18181b',
    surface: '#27272a',
    surfaceHover: '#3f3f46',
    text: '#fafafa',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    border: '#3f3f46',
    primary: '#eab308',
    primaryText: '#18181b',
    accent: '#60a5fa',
    error: '#f87171',
  },
};

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof colors.light;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemColorScheme || 'dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await getTheme();
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemColorScheme) {
      setTheme(systemColorScheme);
    }
    setIsLoaded(true);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await saveTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    colors: colors[theme],
    toggleTheme,
    isDark: theme === 'dark',
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
