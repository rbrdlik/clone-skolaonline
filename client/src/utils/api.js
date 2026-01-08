import { refreshToken } from "../models/auth";

/**
 * Wrapper pro fetch, který automaticky refreshuje token při 401 chybě
 */
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  // Přidáme token do headers, pokud existuje
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // První pokus
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Pokud dostaneme 401, zkusíme refresh token
  if (response.status === 401) {
    const refreshResponse = await refreshToken();
    
    if (refreshResponse && refreshResponse.status === 200) {
      // Zkusíme znovu s novým tokenem
      const newToken = localStorage.getItem("token");
      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      }
    } else {
      // Refresh selhal, vymažeme tokeny
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      // Můžeme vyhodit chybu nebo vrátit response
      return response;
    }
  }

  return response;
};
