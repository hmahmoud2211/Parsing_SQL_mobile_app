import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors
const lightColors = {
  primary: '#4263EB',
  secondary: '#6C5CE7',
  accent: '#F97316',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#212529',
  subtext: '#6C757D',
  border: '#DEE2E6',
  notification: '#FA5252',
  codeBackground: '#F1F3F5',
  codeBorder: '#DEE2E6',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  syntaxKeyword: '#9C36B5',
  syntaxString: '#22863A',
  syntaxNumber: '#005CC5',
  syntaxComment: '#6A737D',
  syntaxOperator: '#D73A49',
};

const darkColors = {
  primary: '#748FFC',
  secondary: '#9C7CFC',
  accent: '#FF922B',
  background: '#212529',
  card: '#343A40',
  text: '#F8F9FA',
  subtext: '#ADB5BD',
  border: '#495057',
  notification: '#FA5252',
  codeBackground: '#1E2329',
  codeBorder: '#343A40',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  syntaxKeyword: '#CC99CD',
  syntaxString: '#7EC699',
  syntaxNumber: '#79B8FF',
  syntaxComment: '#959DA5',
  syntaxOperator: '#F97583',
};

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: typeof lightColors;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemColorScheme || 'light');

  // Update theme when system theme changes
  useEffect(() => {
    if (systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme(current => (current === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);