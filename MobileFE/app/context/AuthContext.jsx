import React, { createContext, useState, useEffect, useContext } from 'react';
import { api, getStoredToken, getStoredUser, storeToken, storeUser, removeToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Načtení uloženého tokenu a uživatele při startu
  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await getStoredToken();
      const storedUser = await getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        
        // Ověření tokenu s backendem
        try {
          const currentUser = await api.getCurrentUser();
          setUser(currentUser);
          await storeUser(currentUser);
        } catch (error) {
          // Token je neplatný
          // V dev módu použijeme mock uživatele místo odhlášení
          if (__DEV__) {
            console.log('Backend není dostupný, používáme mock uživatele');
            const mockUser = {
              id: 'dev-user-1',
              username: 'teststudent',
              studentId: 'student-1',
              name: 'Test Student',
              class: '1A1',
            };
            setUser(mockUser);
            setIsAuthenticated(true);
            await storeUser(mockUser);
          } else {
            await logout();
          }
        }
      } else if (__DEV__) {
        // V dev módu automaticky přihlásit mock uživatele pokud není uložený token
        console.log('Dev mode: Automatické mock přihlášení');
        const mockUser = {
          id: 'dev-user-1',
          username: 'teststudent',
          studentId: 'student-1',
          name: 'Test Student',
          class: '1A1',
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        await storeUser(mockUser);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      // V dev módu použijeme mock uživatele i při chybě
      if (__DEV__) {
        const mockUser = {
          id: 'dev-user-1',
          username: 'teststudent',
          studentId: 'student-1',
          name: 'Test Student',
          class: '1A1',
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        await storeUser(mockUser);
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    // Development mode: mock přihlášení pokud backend není dostupný
    if (__DEV__ && (username === 'dev' || username === 'test')) {
      const mockUser = {
        id: 'dev-user-1',
        username: 'teststudent',
        studentId: 'student-1',
        name: 'Test Student',
        class: '1A1',
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      await storeUser(mockUser);
      return { success: true, user: mockUser };
    }

    try {
      const response = await api.login(username, password);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Development mode: fallback na mock přihlášení pokud backend není dostupný
      if (__DEV__) {
        console.log('Backend není dostupný, používáme mock přihlášení');
        const mockUser = {
          id: 'dev-user-1',
          username: username || 'teststudent',
          studentId: 'student-1',
          name: 'Test Student',
          class: '1A1',
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        await storeUser(mockUser);
        return { success: true, user: mockUser };
      }
      
      return { 
        success: false, 
        error: error.message || 'Přihlášení selhalo. Zkontrolujte své údaje.' 
      };
    }
  }

  async function logout() {
    try {
      await api.logout();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

