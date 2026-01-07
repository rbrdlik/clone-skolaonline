import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi, getMe, refreshToken as refreshTokenApi } from "../models/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Načtení uživatele při startu aplikace
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();
        if (response && response.status === 200) {
          setUser(response.payload);
          setIsAuthenticated(true);
        } else {
          // Token je neplatný, zkusíme refresh
          const refreshResponse = await refreshTokenApi();
          if (refreshResponse && refreshResponse.status === 200) {
            // Zkusíme znovu načíst uživatele
            const retryResponse = await getMe();
            if (retryResponse && retryResponse.status === 200) {
              setUser(retryResponse.payload);
              setIsAuthenticated(true);
            } else {
              // Refresh nefungoval, vymažeme tokeny
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            // Refresh nefungoval, vymažeme tokeny
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Funkce pro přihlášení
  const login = async (username, password) => {
    try {
      const response = await loginApi(username, password);
      if (response && response.status === 200) {
        // Načteme uživatele po úspěšném přihlášení
        const userResponse = await getMe();
        if (userResponse && userResponse.status === 200) {
          setUser(userResponse.payload);
          setIsAuthenticated(true);
          return { success: true, user: userResponse.payload };
        }
      }
      return { success: false, error: response?.message || "Přihlášení selhalo" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Chyba při přihlášení" };
    }
  };

  // Funkce pro odhlášení
  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Funkce pro refresh tokenu (může být volána externě)
  const refreshToken = async () => {
    try {
      const response = await refreshTokenApi();
      if (response && response.status === 200) {
        return { success: true };
      }
      // Refresh selhal, odhlásíme uživatele
      await logout();
      return { success: false };
    } catch (error) {
      console.error("Refresh token error:", error);
      await logout();
      return { success: false };
    }
  };

  // Funkce pro aktualizaci uživatelských dat
  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
