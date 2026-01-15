import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = await getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Logování requestu
  console.log('=== API REQUEST ===');
  console.log('URL:', url);
  console.log('Method:', options.method || 'GET');
  if (options.body) {
    try {
      const bodyData = JSON.parse(options.body);
      // Skryjeme heslo v logu
      const safeBody = { ...bodyData };
      if (safeBody.password) {
        safeBody.password = '***';
      }
      console.log('Body:', JSON.stringify(safeBody, null, 2));
    } catch (e) {
      console.log('Body:', options.body);
    }
  }
  console.log('Headers:', { ...config.headers, Authorization: config.headers.Authorization ? 'Bearer ***' : undefined });

  try {
    const response = await fetch(url, config);
    
    // Zkusíme parsovat JSON, ale pokud selže (např. prázdná odpověď), použijeme prázdný objekt
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      data = {};
    }

    // Logování odpovědi
    console.log('=== API RESPONSE ===');
    console.log('Status:', response.status, response.statusText);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error(`API Error ${response.status} for ${url}:`, data);
      const errorMessage = data.message || data.error || `API request failed (${response.status})`;
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('URL:', url);
    console.error('Error:', error.message);
    console.error('Status:', error.status);
    throw error;
  }
}

const TOKEN_KEY = '@skolaonline_token';
const REFRESH_TOKEN_KEY = '@skolaonline_refreshToken';
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
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
}

export async function storeRefreshToken(refreshToken) {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
  }
}

export async function getStoredRefreshToken() {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
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

export const api = {
  async login(username, password) {
    console.log('=== LOGIN START ===');
    console.log('Username:', username);
    console.log('Password:', '***');
    console.log('API Base URL:', API_BASE_URL);
    
    const loginData = { username, password };
    
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    
    console.log('=== LOGIN RESULT ===');
    if (data.accessToken) {
      console.log('✅ Login successful!');
      console.log('AccessToken received:', data.accessToken.substring(0, 20) + '...');
      console.log('RefreshToken received:', data.refreshToken ? data.refreshToken.substring(0, 20) + '...' : 'none');
    } else {
      console.log('❌ Login failed - no tokens received');
    }
    
    // Backend vrací accessToken a refreshToken, ne token
    if (data.accessToken) {
      await storeToken(data.accessToken);
    }
    if (data.refreshToken) {
      await storeRefreshToken(data.refreshToken);
    }
    
    // Získáme uživatele pomocí /auth/me
    if (data.accessToken) {
      try {
        // Dočasně nastavíme token pro volání getCurrentUser
        const user = await apiCall('/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.accessToken}`
          }
        });
        if (user) {
          await storeUser(user);
          return { 
            accessToken: data.accessToken, 
            refreshToken: data.refreshToken,
            user 
          };
        }
      } catch (error) {
        console.error('Error fetching user after login:', error);
      }
    }
    
    return data;
  },

  async logout() {
    try {
      const refreshToken = await getStoredRefreshToken();
      if (refreshToken) {
        await apiCall('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await removeToken();
    }
    return { success: true };
  },

  async getCurrentUser() {
    return await apiCall('/auth/me');
  },

  // Získání rozvrhu pro konkrétní den (pro studenta - použije jeho třídu)
  async getTimetableForDay(studentId, date) {
    const result = await apiCall(`/schedule/student?studentId=${studentId}&date=${date}`);
    // Backend vrací pole lekcí přímo, ne v payload
    return Array.isArray(result) ? result : (result.payload || result.data || []);
  },

  // Získání rozvrhu třídy pro konkrétní den
  async getClassTimetableForDay(classId, date, includeCancelled = false) {
    const cancelledParam = includeCancelled ? '&includeCancelled=true' : '';
    const result = await apiCall(`/schedule/class?classId=${classId}&date=${date}${cancelledParam}`);
    // Backend vrací pole lekcí přímo, ne v payload
    return Array.isArray(result) ? result : (result.payload || result.data || []);
  },

  // Získání detailu hodiny
  async getLessonDetail(studentId, date, hour) {
    return await apiCall(`/schedule/student/lesson-detail?studentId=${studentId}&date=${date}&hour=${hour}`);
  },

  // Získání přehledu známek podle předmětů
  async getGradesSummary(studentId) {
    return await apiCall(`/grade/student/${studentId}/summary`);
  },

  // Získání známek z konkrétního předmětu
  async getGradesBySubject(studentId, subjectId) {
    return await apiCall(`/grade/student/${studentId}/subject/${subjectId}`);
  },

  // Získání detailu známky podle ID
  async getGradeById(gradeId) {
    return await apiCall(`/grade/${gradeId}`);
  },

  // Získání zpráv pro studenta
  async getMessages(studentId) {
    return await apiCall(`/message/student/${studentId}`);
  },

  // Získání detailu zprávy
  async getMessageDetail(messageId) {
    return await apiCall(`/message/${messageId}`);
  },

  async getClassInfo(classId) {
    return await apiCall(`/class/${classId}`);
  },

  async getAllClasses() {
    const data = await apiCall('/class');
    return data.payload || data || [];
  },

  async getAllSubjects() {
    const data = await apiCall('/subject');
    return data.payload || data || [];
  },
};

export default api;
