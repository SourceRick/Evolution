/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('auto');
  const [preferences, setPreferences] = useState({
    altoContraste: false,
    tamanhoFonte: 'medio'
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('bytewave-theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Remover classes anteriores
    root.classList.remove('theme-claro', 'theme-escuro', 'alto-contraste');
    
    // Determinar tema efetivo
    let effectiveTheme = theme;
    if (theme === 'auto') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
    }
    
    // Aplicar classes
    root.classList.add(`theme-${effectiveTheme}`);
    
    if (preferences.altoContraste) {
      root.classList.add('alto-contraste');
    }

    // Salvar no localStorage
    localStorage.setItem('bytewave-theme', theme);
  }, [theme, preferences]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const updatePreferences = (newPrefs) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  const value = {
    theme,
    preferences,
    updateTheme,
    updatePreferences
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};