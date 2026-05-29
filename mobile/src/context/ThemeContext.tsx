import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AppTheme,
  darkTheme,
  lightTheme,
  ThemeMode,
} from '../config/colors';

interface ThemeContextData {
  theme: AppTheme;
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (
    mode: ThemeMode
  ) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY =
  '@vivafit:theme-mode';

const ThemeContext =
  createContext<ThemeContextData>(
    {} as ThemeContextData
  );

function isThemeMode(
  value: string | null
): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeMode, setMode] =
    useState<ThemeMode>('dark');

  useEffect(() => {
    async function loadTheme() {
      const storedMode =
        await AsyncStorage.getItem(
          THEME_STORAGE_KEY
        );

      if (isThemeMode(storedMode)) {
        setMode(storedMode);
      }
    }

    loadTheme();
  }, []);

  async function setThemeMode(
    mode: ThemeMode
  ) {
    setMode(mode);
    await AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      mode
    );
  }

  async function toggleTheme() {
    await setThemeMode(
      themeMode === 'dark'
        ? 'light'
        : 'dark'
    );
  }

  const value = useMemo(
    () => ({
      theme:
        themeMode === 'dark'
          ? darkTheme
          : lightTheme,
      themeMode,
      isDarkMode:
        themeMode === 'dark',
      setThemeMode,
      toggleTheme,
    }),
    [themeMode]
  );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
