// Ukládání a načítání tokenu z AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

// API Base URL
const API_BASE_URL = API_CONFIG.BASE_URL;

// Helper funkce pro API volání
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Přidání tokenu pokud existuje
  const token = await getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

const TOKEN_KEY = '@skolaonline_token';
const USER_KEY = '@skolaonline_user';

export async function getStoredToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

export async function storeToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
}

export async function getStoredUser() {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function storeUser(user) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
}

// API funkce
export const api = {
  // Autentizace
  async login(username, password) {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (data.token) {
      await storeToken(data.token);
    }
    if (data.user) {
      await storeUser(data.user);
    }
    
    return data;
  },

  async logout() {
    await removeToken();
    return { success: true };
  },

  async getCurrentUser() {
    return await apiCall('/auth/me');
  },

  // Rozvrh
  async getTimetable(studentId, week = null) {
    const params = week ? `?week=${week}` : '';
    return await apiCall(`/timetable/${studentId}${params}`);
  },

  // Známky
  async getGrades(studentId, semester = null) {
    const params = semester ? `?semester=${semester}` : '';
    return await apiCall(`/grades/${studentId}${params}`);
  },

  // Zprávy
  async getMessages(studentId) {
    return await apiCall(`/messages/${studentId}`);
  },

  // Třída
  async getClassInfo(classId) {
    return await apiCall(`/class/${classId}`);
  },
};

export default api;

