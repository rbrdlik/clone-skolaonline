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

  // Helper funkce pro transformaci user objektu z backendu
  const transformUser = (backendUser) => {
    if (!backendUser) return null;
    
    return {
      ...backendUser,
      _id: backendUser._id || backendUser.id,
      // Vytvoříme name z first_name a last_name
      name: backendUser.first_name && backendUser.last_name 
        ? `${backendUser.first_name} ${backendUser.last_name}`
        : backendUser.username || 'Uživatel',
      // studentId je _id uživatele
      studentId: backendUser._id || backendUser.id,
    };
  };

  // Načtení třídy studenta (vrátí objekt s name a _id)
  const loadStudentClass = async (studentId) => {
    try {
      // Použijeme getAllClasses a najdeme třídu, která obsahuje studenta
      const classes = await api.getAllClasses();
      if (classes && Array.isArray(classes)) {
        const studentClass = classes.find(cls => {
          if (!cls.students || !Array.isArray(cls.students)) return false;
          // Backend vrací students jako populate (objekty) nebo jako ObjectId
          return cls.students.some(s => {
            const sId = s._id || s.id || s;
            return sId.toString() === studentId.toString();
          });
        });
        if (studentClass) {
          return {
            name: studentClass.name,
            classId: studentClass._id || studentClass.id,
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading student class:', error);
      return null;
    }
  };

  async function loadStoredAuth() {
    try {
      const storedToken = await getStoredToken();
      const storedUser = await getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(transformUser(storedUser));
        setIsAuthenticated(true);
        
        // Ověření tokenu s backendem a aktualizace dat
        try {
          const currentUser = await api.getCurrentUser();
          const transformedUser = transformUser(currentUser);
          
          // Načteme třídu studenta, pokud je student
          if (transformedUser.role === 'student' && transformedUser._id) {
            const classInfo = await loadStudentClass(transformedUser._id);
            if (classInfo) {
              transformedUser.class = classInfo.name;
              transformedUser.classId = classInfo.classId;
            }
          }
          
          setUser(transformedUser);
          await storeUser(transformedUser);
        } catch (error) {
          // Token je neplatný - odhlásíme uživatele
          await logout();
        }
      }
      // V dev módu NEAUTOMATICKY přihlašujeme - uživatel se musí přihlásit přes login formulář
    } catch (error) {
      console.error('Error loading stored auth:', error);
      // Při chybě necháme uživatele nepřihlášeného - zobrazí se login
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    // Vždy se pokusíme přihlásit přes backend, abychom získali skutečné ID
    try {
      const response = await api.login(username, password);
      
      // Backend vrací accessToken a user
      if (response.accessToken && response.user) {
        const transformedUser = transformUser(response.user);
        
        // Načteme třídu studenta, pokud je student
        if (transformedUser.role === 'student' && transformedUser._id) {
          const classInfo = await loadStudentClass(transformedUser._id);
          if (classInfo) {
            transformedUser.class = classInfo.name;
            transformedUser.classId = classInfo.classId;
          }
        }
        
        setToken(response.accessToken);
        setUser(transformedUser);
        setIsAuthenticated(true);
        await storeUser(transformedUser);
        return { success: true, user: transformedUser };
      } else if (response.accessToken) {
        // Pokud user není v odpovědi, získáme ho přes /auth/me
        try {
          const user = await api.getCurrentUser();
          const transformedUser = transformUser(user);
          
          // Načteme třídu studenta, pokud je student
          if (transformedUser.role === 'student' && transformedUser._id) {
            const classInfo = await loadStudentClass(transformedUser._id);
            if (classInfo) {
              transformedUser.class = classInfo.name;
              transformedUser.classId = classInfo.classId;
            }
          }
          
          setUser(transformedUser);
          setIsAuthenticated(true);
          await storeUser(transformedUser);
          return { success: true, user: transformedUser };
        } catch (error) {
          return { success: false, error: 'Nepodařilo se načíst informace o uživateli' };
        }
      } else {
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Vždy vracíme chybu - nepoužíváme mock uživatele, aby se používalo skutečné ID z backendu
      return { 
        success: false, 
        error: error.message || 'Přihlášení selhalo. Zkontrolujte své údaje.' 
      };
    }
  }

  async function logout() {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
      await removeToken();
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
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

