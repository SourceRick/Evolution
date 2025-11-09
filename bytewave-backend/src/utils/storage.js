import { STORAGE_KEYS } from './constants';

/**
 * Utilitários para localStorage
 */
export const storage = {
  // String
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return defaultValue;
    }
  },

  // Object
  setObject: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Erro ao salvar objeto no localStorage:', error);
      return false;
    }
  },

  getObject: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error('Erro ao ler objeto do localStorage:', error);
      return defaultValue;
    }
  },

  // Remove item
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  },

  // Clear all
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  },

  // Verifica se existe
  has: (key) => {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Erro ao verificar localStorage:', error);
      return false;
    }
  }
};

/**
 * Utilitários específicos do app
 */
export const appStorage = {
  // Token
  setToken: (token) => storage.set(STORAGE_KEYS.TOKEN, token),
  getToken: () => storage.get(STORAGE_KEYS.TOKEN),
  removeToken: () => storage.remove(STORAGE_KEYS.TOKEN),

  // User
  setUser: (user) => storage.setObject(STORAGE_KEYS.USER, user),
  getUser: () => storage.getObject(STORAGE_KEYS.USER),
  removeUser: () => storage.remove(STORAGE_KEYS.USER),

  // Theme
  setTheme: (theme) => storage.set(STORAGE_KEYS.THEME, theme),
  getTheme: () => storage.get(STORAGE_KEYS.THEME, 'auto'),
  removeTheme: () => storage.remove(STORAGE_KEYS.THEME),

  // Preferences
  setPreferences: (preferences) => storage.setObject(STORAGE_KEYS.PREFERENCES, preferences),
  getPreferences: () => storage.getObject(STORAGE_KEYS.PREFERENCES, {}),
  removePreferences: () => storage.remove(STORAGE_KEYS.PREFERENCES),

  // Clear all app data
  clearAll: () => {
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.THEME);
    storage.remove(STORAGE_KEYS.PREFERENCES);
  }
};